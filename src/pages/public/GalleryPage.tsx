import { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { galleryItems } from '../../data/dummyData';
import type { GalleryItem } from '../../types/app';

const cats = ['Semua', ...Array.from(new Set(galleryItems.map((g) => g.category)))];

export function GalleryPage() {
  const [cat, setCat] = useState('Semua');
  const [active, setActive] = useState<GalleryItem | null>(null);
  const filtered = cat === 'Semua' ? galleryItems : galleryItems.filter((g) => g.category === cat);

  return (
    <div>
      <PageHeader eyebrow="Galeri" title="Galeri Desa" description="Dokumentasi kegiatan, potensi, dan keseharian desa." />
      <div className="container-page py-10">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`chip border ${cat === c ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{c}</button>
          ))}
        </div>
        <div className="mt-6 columns-2 gap-4 sm:columns-3 lg:columns-4">
          {filtered.map((g, i) => (
            <button key={g.id} onClick={() => setActive(g)} className="mb-4 block w-full overflow-hidden rounded-2xl">
              <img src={g.image_url} alt={g.title} className={`w-full object-cover transition hover:scale-[1.02] ${i % 3 === 0 ? 'h-72' : i % 3 === 1 ? 'h-48' : 'h-60'}`} />
            </button>
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title} description={active?.category} size="xl">
        {active && <img src={active.image_url} alt={active.title} className="w-full rounded-xl" />}
      </Modal>
    </div>
  );
}
