import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { SmartImage } from '../../components/common/SmartImage';
import { useToast } from '../../hooks/useToast';
import { createGalleryItem, deleteGalleryItem, listGallery } from '../../services/galleryService';
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try {
              await createGalleryItem({
                title: String(fd.get('title') ?? ''),
                category: String(fd.get('category') ?? 'Umum'),
                image_url: String(fd.get('image_url') ?? ''),
                description: String(fd.get('description') ?? ''),
              });
              show('Foto ditambahkan', 'success');
              setCreating(false);
              refresh();
            } catch (err) {
              show((err as Error).message || 'Gagal tambah foto', 'error');
            }
          }}
          className="space-y-3"
        >
          <div><label className="label">Judul</label><input name="title" className="input" required /></div>
          <div><label className="label">Kategori</label><input name="category" className="input" required placeholder="Lingkungan / Kegiatan / UMKM" /></div>
          <div><label className="label">URL Gambar</label><input name="image_url" type="url" className="input" required placeholder="https://..." /></div>
          <p className="text-[11px] text-slate-500">Tips: upload gambar ke Supabase Storage atau hosting eksternal, lalu tempelkan URL-nya di sini.</p>
          <div><label className="label">Deskripsi (opsional)</label><textarea name="description" className="input" rows={2} /></div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
