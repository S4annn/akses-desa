import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { SmartImage } from '../../components/common/SmartImage';
import { listPublicPosts } from '../../services/postsService';
import type { Post } from '../../types/app';
import { formatDate } from '../../utils/formatDate';

const filters = ['Semua', 'berita', 'pengumuman', 'kegiatan', 'layanan'] as const;

export function NewsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('Semua');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublicPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filter !== 'Semua' && p.type !== filter) return false;
      if (search && !`${p.title} ${p.excerpt}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, filter]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      <Seo title="Berita & Pengumuman" description="Berita, pengumuman, dan kegiatan terbaru dari desa." />
      <PageHeader eyebrow="Berita & Pengumuman" title="Kabar dari desa" description="Informasi resmi, agenda, dan kegiatan terbaru." />
      <div className="container-page py-10">
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Cari artikel..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`chip border capitalize ${filter === f ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{f}</button>
            ))}
          </div>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-8">
            <EmptyState title="Belum ada artikel" description="Berita dan pengumuman akan muncul di sini setelah diterbitkan oleh admin desa." />
          </div>
        )}

        {featured && (
          <Link to={`/berita/${featured.slug}`} className="card group mt-8 grid overflow-hidden lg:grid-cols-2">
            <div className="h-72 overflow-hidden bg-slate-100">
              {featured.image_url && (
                <SmartImage src={featured.image_url} alt={featured.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              )}
            </div>
            <div className="p-6 sm:p-8">
              <span className="chip border border-brand-200 bg-brand-50 capitalize text-brand-700">{featured.type}</span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-slate-600">{featured.excerpt}</p>
              <p className="mt-4 text-sm text-slate-500">{formatDate(featured.published_at)} · {featured.author}</p>
            </div>
          </Link>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.id} to={`/berita/${p.slug}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative h-40 overflow-hidden bg-slate-100">
                {p.image_url && <SmartImage src={p.image_url} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />}
                <span className="chip absolute left-3 top-3 border border-white/40 bg-white/85 capitalize text-brand-700 backdrop-blur">{p.type}</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500">{formatDate(p.published_at)}</p>
                <p className="mt-1 line-clamp-2 text-base font-semibold text-slate-900">{p.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
