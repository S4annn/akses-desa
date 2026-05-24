import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { galleryItems as initial } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import type { GalleryItem } from '../../types/app';

export function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Galeri Desa</h1><p className="text-sm text-slate-500">Kelola foto kegiatan dan potensi desa.</p></div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Upload Foto</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="card overflow-hidden">
            <img src={g.image_url} alt={g.title} className="h-36 w-full object-cover" />
            <div className="p-3">
              <p className="text-sm font-semibold text-slate-900">{g.title}</p>
              <p className="text-xs text-slate-500">{g.category}</p>
              <button onClick={() => { setItems((a) => a.filter((x) => x.id !== g.id)); show('Foto dihapus', 'success'); }} className="btn-ghost mt-2 w-full justify-center text-rose-600"><Trash2 className="h-4 w-4" /> Hapus</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Upload Foto">
        <form onSubmit={(e) => { e.preventDefault(); show('Foto diunggah', 'success'); setCreating(false); }} className="space-y-3">
          <div><label className="label">Judul</label><input className="input" required /></div>
          <div><label className="label">Kategori</label><input className="input" required /></div>
          <div><label className="label">File</label><input type="file" accept="image/*" className="input" required /></div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="btn-ghost">Batal</button><button className="btn-primary">Upload</button></div>
        </form>
      </Modal>
    </div>
  );
}
