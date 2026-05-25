import { Edit, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { SmartImage } from '../../components/common/SmartImage';
import { useToast } from '../../hooks/useToast';
import { generateVillageNews } from '../../services/geminiService';
import { createPost, deletePost, listAllPosts } from '../../services/postsService';
import type { Post, PostType } from '../../types/app';
import { formatDate } from '../../utils/formatDate';

export function PostsAdminPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listAllPosts());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function remove(id: string) {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      await deletePost(id);
      setItems((arr) => arr.filter((p) => p.id !== id));
      show('Artikel dihapus', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal hapus', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Berita & Pengumuman</h1>
          <p className="text-sm text-slate-500">Kelola konten publik desa.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Artikel Baru</button>
      </div>

      {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat artikel...</div>}
      {!loading && items.length === 0 && (
        <EmptyState
          title="Belum ada artikel"
          description="Mulai tulis berita atau pengumuman untuk warga desa."
          action={<button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tulis Artikel</button>}
        />
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              {p.image_url && <SmartImage src={p.image_url} alt={p.title} className="h-36 w-full object-cover" />}
              <div className="p-4">
                <span className="chip border border-brand-100 bg-brand-50 capitalize text-brand-700">{p.type}</span>
                <p className="mt-2 line-clamp-2 text-base font-semibold text-slate-900">{p.title}</p>
                <p className="text-xs text-slate-500">{formatDate(p.published_at)}</p>
                <div className="mt-3 flex gap-2">
                  <button className="btn-outline flex-1 justify-center"><Edit className="h-4 w-4" /> Edit</button>
                  <button onClick={() => remove(p.id)} className="btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Tulis Artikel" description="Gunakan AI untuk membantu menyusun draft." size="lg">
        <NewArticleForm
          onCreate={async (input) => {
            try {
              await createPost(input);
              setCreating(false);
              show('Artikel diterbitkan', 'success');
              refresh();
            } catch (err) {
              show((err as Error).message || 'Gagal terbitkan', 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

interface CreateInput {
  title: string;
  excerpt: string;
  content: string;
  type: PostType;
  is_published: boolean;
}

function NewArticleForm({ onCreate }: { onCreate: (p: CreateInput) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<PostType>('berita');
  const [points, setPoints] = useState('');
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleAI() {
    if (!points.trim()) return;
    setGenerating(true);
    try {
      const r = await generateVillageNews(points);
      setTitle(r.title);
      setExcerpt(r.excerpt);
      setContent(r.content);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate({ title, excerpt, content, type, is_published: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-3">
        <p className="flex items-center gap-1 text-xs font-semibold text-brand-700"><Sparkles className="h-3.5 w-3.5" /> AI News Generator</p>
        <textarea value={points} onChange={(e) => setPoints(e.target.value)} className="input mt-2" rows={2} placeholder="Masukkan poin singkat, mis: Posyandu tanggal 20 Mei, cek balita, imunisasi..." />
        <button type="button" onClick={handleAI} disabled={generating || !points.trim()} className="btn-secondary mt-2">
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Hasilkan Draft
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Tipe</label>
          <select value={type} onChange={(e) => setType(e.target.value as PostType)} className="input">
            <option value="berita">Berita</option>
            <option value="pengumuman">Pengumuman</option>
            <option value="kegiatan">Kegiatan</option>
            <option value="layanan">Layanan</option>
          </select>
        </div>
        <div className="sm:col-span-2"><label className="label">Judul</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="input" required /></div>
        <div className="sm:col-span-2"><label className="label">Ringkasan</label><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="input" rows={2} required /></div>
        <div className="sm:col-span-2"><label className="label">Konten</label><textarea value={content} onChange={(e) => setContent(e.target.value)} className="input" rows={6} required /></div>
      </div>
      <div className="flex justify-end gap-2"><button disabled={submitting} className="btn-primary">{submitting ? 'Menerbitkan...' : 'Publikasikan'}</button></div>
    </form>
  );
}
