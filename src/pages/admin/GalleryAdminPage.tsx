import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ImageUploader } from '../../components/common/ImageUploader';
import { Modal } from '../../components/common/Modal';
import { SmartImage } from '../../components/common/SmartImage';
import { useToast } from '../../hooks/useToast';
import { createGalleryItem, deleteGalleryItem, listGallery } from '../../services/galleryService';
import { subscribeRefresh } from '../../services/notificationBus';
import type { GalleryItem } from '../../types/app';

export function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listGallery());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const unsub = subscribeRefresh(['gallery_created', 'gallery_deleted'], refresh);
    return unsub;
  }, []);

  async function remove(id: string) {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await deleteGalleryItem(id);
      setItems((a) => a.filter((x) => x.id !== id));
      show('Foto dihapus', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal hapus', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Galeri Desa</h1>
          <p className="text-sm text-slate-500">Kelola foto kegiatan dan potensi desa.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Foto</button>
      </div>

      {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat galeri...</div>}
      {!loading && items.length === 0 && (
        <EmptyState
          title="Belum ada foto"
          description="Tambahkan dokumentasi kegiatan agar galeri publik tampil hidup."
          icon={<ImageIcon className="h-7 w-7" />}
          action={<button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Foto</button>}
        />
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <div key={g.id} className="card overflow-hidden">
              <SmartImage src={g.image_url} alt={g.title} className="h-36 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-900">{g.title}</p>
                <p className="text-xs text-slate-500">{g.category}</p>
                <button onClick={() => remove(g.id)} className="btn-ghost mt-2 w-full justify-center text-rose-600"><Trash2 className="h-4 w-4" /> Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Tambah Foto Galeri">
        <GalleryForm
          onSubmit={async (input) => {
            try {
              await createGalleryItem(input);
              show('Foto ditambahkan', 'success');
              setCreating(false);
              refresh();
            } catch (err) {
              show((err as Error).message || 'Gagal tambah foto', 'error');
            }
          }}
          onCancel={() => setCreating(false)}
        />
      </Modal>
    </div>
  );
}

function GalleryForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: { title: string; image_url: string; category: string; description?: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kegiatan');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { show } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      show('Silakan upload gambar terlebih dahulu', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ title, category, image_url: imageUrl, description: description || undefined });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label">Foto</label>
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="gallery" aspectRatio="16/9" />
      </div>
      <div><label className="label">Judul</label><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
      <div>
        <label className="label">Kategori</label>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Kegiatan</option>
          <option>Lingkungan</option>
          <option>UMKM</option>
          <option>Potensi</option>
          <option>Pemerintahan</option>
          <option>Lainnya</option>
        </select>
      </div>
      <div><label className="label">Deskripsi (opsional)</label><textarea className="input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Batal</button>
        <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </form>
  );
}
