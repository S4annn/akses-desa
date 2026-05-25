import { ImageIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { SmartImage } from '../../components/common/SmartImage';
import { listGallery } from '../../services/galleryService';
import type { GalleryItem } from '../../types/app';

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('Semua');
  const [active, setActive] = useState<GalleryItem | null>(null);

  useEffect(() => {
    listGallery()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const cats = useMemo(() => ['Semua', ...Array.from(new Set(items.map((g) => g.category)))], [items]);
  const filtered = cat === 'Semua' ? items : items.filter((g) => g.category === cat);

  return (
    <div>
      <Seo title="Galeri Desa" description="Galeri foto kegiatan, potensi, dan keseharian desa." />
      <PageHeader eyebrow="Galeri" title="Galeri Desa" description="Dokumentasi kegiatan, potensi, dan keseharian desa." />
      <div className="container-page py-10">
        {cats.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`chip border ${
                  cat === c
                    ? 'border-brand-500 bg-brand-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="mt-8 text-center text-sm text-slate-500">Memuat galeri...</div>}
        {!loading && filtered.length === 0 && (
          <div className="mt-8">
            <EmptyState title="Belum ada foto" description="Galeri akan terisi seiring kegiatan desa diselenggarakan." icon={<ImageIcon className="h-7 w-7" />} />
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="mt-6 columns-2 gap-4 sm:columns-3 lg:columns-4">
            {filtered.map((g, i) => (
              <button key={g.id} onClick={() => setActive(g)} className="mb-4 block w-full overflow-hidden rounded-2xl">
                <SmartImage
                  src={g.image_url}
                  alt={g.title}
                  className={`w-full object-cover transition hover:scale-[1.02] ${i % 3 === 0 ? 'h-72' : i % 3 === 1 ? 'h-48' : 'h-60'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title} description={active?.category} size="xl">
        {active && <SmartImage src={active.image_url} alt={active.title} className="w-full rounded-xl" />}
      </Modal>
    </div>
  );
}
