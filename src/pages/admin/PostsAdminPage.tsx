import { Edit, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { posts as initial } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import { generateVillageNews } from '../../services/geminiService';
import type { Post } from '../../types/app';
import { formatDate } from '../../utils/formatDate';

export function PostsAdminPage() {
  const [items, setItems] = useState<Post[]>(initial);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  function remove(id: string) {
    setItems((arr) => arr.filter((p) => p.id !== id));
    show('Artikel dihapus', 'success');
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="card overflow-hidden">
            {p.image_url && <img src={p.image_url} alt={p.title} className="h-36 w-full object-cover" />}
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

      <Modal open={creating} onClose={() => setCreating(false)} title="Tulis Artikel" description="Gunakan AI untuk membantu menyusun draft." size="lg">
        <NewArticleForm
          onCreate={(p) => {
            setItems((arr) => [{ ...p, id: `p-${Date.now()}` }, ...arr]);
            setCreating(false);
            show('Artikel dibuat', 'success');
          }}
        />
      </Modal>
    </div>
  );
}

function NewArticleForm({ onCreate }: { onCreate: (p: Omit<Post, 'id'>) => void }) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [points, setPoints] = useState('');
  const [generating, setGenerating] = useState(false);

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreate({
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          excerpt,
          content,
          type: 'berita',
          author: 'Admin Desa',
          published_at: new Date().toISOString(),
        });
      }}
      className="space-y-3"
    >
      <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-3">
        <p className="flex items-center gap-1 text-xs font-semibold text-brand-700"><Sparkles className="h-3.5 w-3.5" /> AI News Generator</p>
        <textarea value={points} onChange={(e) => setPoints(e.target.value)} className="input mt-2" rows={2} placeholder="Masukkan poin singkat, mis: Posyandu tanggal 20 Mei, cek balita, imunisasi..." />
        <button type="button" onClick={handleAI} disabled={generating} className="btn-secondary mt-2">
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Hasilkan Draft
        </button>
      </div>
      <div><label className="label">Judul</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="input" required /></div>
      <div><label className="label">Ringkasan</label><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="input" rows={2} required /></div>
      <div><label className="label">Konten</label><textarea value={content} onChange={(e) => setContent(e.target.value)} className="input" rows={6} required /></div>
      <div className="flex justify-end gap-2"><button className="btn-primary">Publikasikan</button></div>
    </form>
  );
}
