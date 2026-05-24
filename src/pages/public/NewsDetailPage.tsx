import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { posts } from '../../data/dummyData';
import { formatDate } from '../../utils/formatDate';

export function NewsDetailPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-slate-600">Artikel tidak ditemukan.</p>
        <Link to="/berita" className="btn-primary mt-4 inline-flex">Kembali ke Berita</Link>
      </div>
    );
  }

  return (
    <div>
      <Seo title={post.title} description={post.excerpt} image={post.image_url} type="article" />
      <PageHeader eyebrow={post.type} title={post.title} description={post.excerpt} />
      <div className="container-page py-10">
        <Link to="/berita" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Semua berita</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <article className="lg:col-span-2">
            {post.image_url && <img src={post.image_url} alt={post.title} className="rounded-2xl" />}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatDate(post.published_at)}</span>
              <span className="inline-flex items-center gap-1"><User className="h-4 w-4" /> {post.author}</span>
            </div>
            <div className="prose prose-slate mt-6 max-w-none whitespace-pre-line text-[15px] leading-relaxed text-slate-700">
              {post.content}
            </div>
          </article>
          <aside>
            <h3 className="text-base font-semibold text-slate-900">Artikel terkait</h3>
            <div className="mt-3 space-y-3">
              {related.map((r) => (
                <Link key={r.id} to={`/berita/${r.slug}`} className="card flex gap-3 p-3 hover:shadow-soft">
                  {r.image_url && <img src={r.image_url} alt={r.title} className="h-16 w-20 rounded-lg object-cover" />}
                  <div>
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">{r.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{formatDate(r.published_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
