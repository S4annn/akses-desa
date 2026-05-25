import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileSearch,
  FileText,
  Files,
  HandHeart,
  Lightbulb,
  MapPin,
  Megaphone,
  MessageSquareWarning,
  Newspaper,
  Phone,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveData } from '../../hooks/useLiveData';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Seo } from '../../components/common/Seo';
import { SmartImage } from '../../components/common/SmartImage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { villageStats } from '../../data/dummyData';
import { listPublicComplaints } from '../../services/complaintsService';
import { listPublicMSMEs } from '../../services/msmeService';
import { listPublicPosts } from '../../services/postsService';
import { getActiveVillage } from '../../services/villageService';
import type { Complaint, MSME, Post, Village } from '../../types/app';
import { formatDate, timeAgo } from '../../utils/formatDate';
import { images } from '../../config/images';

const quickAccess = [
  { to: '/ajukan', icon: FileText, title: 'Ajukan Surat', desc: 'Buat pengajuan administrasi online.', tone: 'bg-brand-50 text-brand-700' },
  { to: '/cek-status', icon: FileSearch, title: 'Cek Status', desc: 'Pantau pengajuan dengan kode tracking.', tone: 'bg-sky-50 text-sky-700' },
  { to: '/bansos', icon: HandHeart, title: 'Bantuan Sosial', desc: 'Lihat program dan ajukan usulan.', tone: 'bg-amber-50 text-amber-700' },
  { to: '/pengaduan', icon: MessageSquareWarning, title: 'Pengaduan Warga', desc: 'Laporkan masalah lingkungan.', tone: 'bg-rose-50 text-rose-700' },
  { to: '/umkm', icon: Store, title: 'UMKM Desa', desc: 'Temukan UMKM lokal di sekitar.', tone: 'bg-violet-50 text-violet-700' },
  { to: '/berita', icon: Newspaper, title: 'Berita Desa', desc: 'Pengumuman dan berita terbaru.', tone: 'bg-emerald-50 text-emerald-700' },
];

const featuredServices = [
  {
    name: 'Surat Keterangan Domisili',
    desc: 'Diterbitkan untuk warga yang berdomisili di desa.',
    time: '1-2 hari',
    icon: Building2,
  },
  {
    name: 'Surat Keterangan Usaha',
    desc: 'Untuk pelaku usaha mikro dan kecil di desa.',
    time: '1-2 hari',
    icon: Store,
  },
  {
    name: 'Surat Keterangan Tidak Mampu',
    desc: 'Diterbitkan untuk keperluan bantuan sosial.',
    time: '2-3 hari',
    icon: HandHeart,
  },
];

const flow = [
  { step: '01', title: 'Pilih layanan', desc: 'Tentukan jenis surat yang dibutuhkan.' },
  { step: '02', title: 'Isi data', desc: 'Lengkapi formulir dan unggah dokumen.' },
  { step: '03', title: 'Verifikasi admin', desc: 'Petugas memeriksa kelengkapan.' },
  { step: '04', title: 'Cek status', desc: 'Pantau dengan kode tracking.' },
  { step: '05', title: 'Ambil dokumen', desc: 'Dokumen siap diambil/diunduh.' },
];

export function HomePage() {
  return (
    <div>
      <Seo
        title="Beranda"
        description="Layanan desa lebih mudah, cepat, dan transparan. Ajukan surat, lapor pengaduan, akses bansos, dan temukan UMKM lokal."
      />
      <Hero />
      <QuickAccess />
      <Stats />
      <FeaturedServices />
      <HowItWorks />
      <ComplaintsPreview />
      <MSMEPreview />
      <NewsPreview />
    </div>
  );
}

function Hero() {
  const { data: village } = useLiveData<Village | null>(
    () => getActiveVillage(),
    ['village_updated'],
    null
  );
  const villageName = village?.name ?? 'Desa Sukamaju';
  const fullLocation = village
    ? `${village.district}, ${village.regency}, ${village.province}`
    : 'Tanjung Sari, Sleman, Daerah Istimewa Yogyakarta';

  return (
    <section className="relative overflow-hidden">
      {/* Background image with village photo */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: `url("${images.heroBackground}")`,
          filter: 'saturate(1.05)',
        }}
      />
      {/* Dark overlay agar text putih readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/40 to-slate-900/70" />
      {/* Tint hijau halus di bawah */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-900/60 to-transparent" />
      <div className="absolute inset-0 bg-topo-pattern opacity-15" />

      <div className="container-page relative flex min-h-[600px] flex-col items-center justify-center py-20 text-center text-white sm:min-h-[680px] sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
            Portal Desa
          </span>

          {/* Salam besar */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight drop-shadow-md sm:text-6xl lg:text-7xl">
            Selamat Datang di
            <span className="mt-2 block bg-gradient-to-r from-brand-300 via-emerald-200 to-cream bg-clip-text text-transparent">
              {villageName}
            </span>
          </h1>

          {/* Lokasi */}
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85 sm:text-base">
            <MapPin className="h-4 w-4" />
            <span>{fullLocation}</span>
          </div>

          {/* Pesan sambutan */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/90 sm:text-lg">
            Portal resmi {villageName} — tempat warga, perangkat desa, dan
            masyarakat luas terhubung. Jelajahi profil desa, layanan publik,
            UMKM lokal, hingga kabar dan agenda terbaru.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/profil" className="btn bg-white text-brand-800 hover:bg-cream shadow-soft">
              <Compass className="h-4 w-4" /> Tentang Desa Kami
            </Link>
            <Link
              to="/layanan"
              className="btn border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <FileText className="h-4 w-4" /> Layanan Desa
            </Link>
          </div>

          {/* Quick links bar */}
          <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {[
              { to: '/berita', icon: Newspaper, label: 'Berita Terbaru' },
              { to: '/agenda', icon: Calendar, label: 'Agenda Desa' },
              { to: '/umkm', icon: Store, label: 'UMKM Lokal' },
              { to: '/galeri', icon: Sparkles, label: 'Galeri Desa' },
            ].map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="group flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur transition hover:border-white/40 hover:bg-white/20"
              >
                <q.icon className="h-4 w-4 text-brand-200 transition group-hover:text-white" />
                <span>{q.label}</span>
                <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
        >
          <div className="flex h-8 w-5 justify-center rounded-full border-2 border-white/40 p-1">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1 rounded-full bg-white/70"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function QuickAccess() {
  return (
    <section className="container-page py-14">
      <SectionHeader
        eyebrow="Akses Cepat"
        title="Layanan yang paling sering dibutuhkan"
        subtitle="Pilih kebutuhan Anda dan AksesDesa akan mengarahkan ke proses yang tepat."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickAccess.map((q, i) => (
          <motion.div
            key={q.to}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to={q.to}
              className="card group flex h-full items-start gap-4 p-5 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${q.tone}`}>
                <q.icon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900">{q.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{q.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                  Buka <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const [stats, setStats] = useState({
    msmes: 0,
    requests: 0,
    complaints: 0,
    posts: 0,
  });

  useEffect(() => {
    Promise.all([listPublicMSMEs(), listPublicPosts(), listPublicComplaints(100)]).then(([m, p, c]) => {
      setStats({
        msmes: m.length,
        requests: villageStats.monthlyRequests,
        complaints: c.length,
        posts: p.length,
      });
    });
  }, []);

  const items = [
    { value: villageStats.population.toLocaleString('id-ID'), label: 'Penduduk', icon: Users },
    { value: villageStats.hamlets, label: 'Dusun', icon: MapPin },
    { value: stats.msmes || '—', label: 'UMKM Aktif', icon: Store },
    { value: stats.posts || '—', label: 'Berita Terbit', icon: Newspaper },
    { value: stats.complaints || '—', label: 'Pengaduan Tercatat', icon: MessageSquareWarning },
  ];
  return (
    <section className="container-page py-14">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-brand-50 p-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((it) => (
            <div key={it.label} className="flex flex-col">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-700 shadow-sm">
                <it.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{it.value}</p>
              <p className="mt-1 text-sm text-slate-500">{it.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedServices() {
  return (
    <section className="container-page py-14">
      <SectionHeader
        eyebrow="Layanan Unggulan"
        title="Surat administrasi paling sering diajukan"
        action={<Link to="/layanan" className="btn-outline">Lihat semua</Link>}
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {featuredServices.map((s) => (
          <div key={s.name} className="card flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-500 text-white">
              <s.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.name}</h3>
            <p className="mt-1 flex-1 text-sm text-slate-500">{s.desc}</p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="chip border border-brand-100 bg-brand-50 text-brand-700">⏱ {s.time}</span>
              <Link to="/ajukan" className="text-sm font-semibold text-brand-700">
                Ajukan →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="container-page py-14">
      <SectionHeader
        eyebrow="Alur Pelayanan"
        title="Cara kerja AksesDesa, dalam 5 langkah."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-5">
        {flow.map((f, i) => (
          <div key={f.step} className="relative">
            <div className="card p-5">
              <span className="text-xs font-semibold tracking-widest text-brand-700">{f.step}</span>
              <p className="mt-2 text-base font-semibold text-slate-900">{f.title}</p>
              <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
            </div>
            {i < flow.length - 1 && (
              <div className="absolute left-full top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-brand-300 to-transparent md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ComplaintsPreview() {
  const { data: items = [] } = useLiveData<Complaint[]>(
    () => listPublicComplaints(4),
    ['complaint_created', 'complaint_updated', 'complaint_deleted'],
    []
  );
  return (
    <section className="container-page py-14">
      <SectionHeader
        eyebrow="Pengaduan Warga"
        title="Pantauan publik laporan warga"
        subtitle="Setiap laporan tercatat, ditinjau, dan ditindaklanjuti secara transparan."
        action={<Link to="/pengaduan" className="btn-outline">Lapor sekarang</Link>}
      />
      <div className="mt-8 grid gap-5 lg:grid-cols-5">
        <div className="card relative overflow-hidden p-0 lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50" />
          <div className="relative h-72 lg:h-full">
            <FakeMap />
          </div>
        </div>
        <div className="space-y-3 lg:col-span-3">
          {items.length === 0 && (
            <div className="card p-6 text-center text-sm text-slate-500">Belum ada pengaduan publik. Jadilah yang pertama melaporkan jika ada masalah di lingkungan Anda.</div>
          )}
          {items.map((c) => (
            <div key={c.id} className="card flex items-start gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
                <MessageSquareWarning className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{c.category}</p>
                  <StatusBadge kind="complaint" value={c.status} />
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{c.location}</p>
                <p className="mt-1 text-xs text-slate-400">{timeAgo(c.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FakeMap() {
  // Decorative map-like preview using SVG for performance.
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 400 320" className="h-full w-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(20,184,166,.18)" strokeWidth="0.7" />
          </pattern>
          <linearGradient id="land" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#CCFBF1" />
            <stop offset="1" stopColor="#FFF7ED" />
          </linearGradient>
        </defs>
        <rect width="400" height="320" fill="url(#land)" />
        <rect width="400" height="320" fill="url(#grid)" />
        <path d="M0,180 C60,140 120,200 180,170 C240,140 300,210 400,180" stroke="#14B8A6" strokeOpacity=".5" strokeWidth="2" fill="none" />
        <path d="M0,240 C80,210 160,260 240,230 C320,200 380,250 400,240" stroke="#0F766E" strokeOpacity=".4" strokeWidth="2" fill="none" />
        {[
          { x: 90, y: 110, c: '#F43F5E', l: 'Lampu Jalan' },
          { x: 220, y: 80, c: '#F59E0B', l: 'Jalan Rusak' },
          { x: 280, y: 180, c: '#10B981', l: 'Drainase' },
          { x: 150, y: 220, c: '#38BDF8', l: 'Sampah' },
        ].map((m, i) => (
          <g key={i}>
            <circle cx={m.x} cy={m.y} r={14} fill={m.c} fillOpacity=".15" />
            <circle cx={m.x} cy={m.y} r={6} fill={m.c} />
            <circle cx={m.x} cy={m.y} r={3} fill="#fff" />
          </g>
        ))}
      </svg>
      <span className="absolute left-3 top-3 chip border border-white/60 bg-white/80 text-slate-700 backdrop-blur">
        <MapPin className="h-3 w-3 text-rose-500" /> Peta Pengaduan
      </span>
    </div>
  );
}

function MSMEPreview() {
  const { data: items = [] } = useLiveData<MSME[]>(
    async () => (await listPublicMSMEs()).slice(0, 4),
    ['msme_created', 'msme_updated', 'msme_deleted'],
    []
  );
  return (
    <section className="container-page py-14">
      <SectionHeader
        eyebrow="UMKM Desa"
        title="Dukung produk lokal terbaik dari desa"
        action={<Link to="/umkm" className="btn-outline">Jelajahi UMKM</Link>}
      />
      {items.length === 0 ? (
        <div className="mt-8 card p-8 text-center text-sm text-slate-500">
          Belum ada UMKM terverifikasi. Daftarkan UMKM Anda di halaman UMKM.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <div key={m.id} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative h-36 overflow-hidden bg-slate-100">
                {m.image_url && (
                  <SmartImage src={m.image_url} alt={m.business_name} className="h-full w-full object-cover transition group-hover:scale-105" />
                )}
                {m.is_verified && (
                  <span className="chip absolute left-2 top-2 border border-white/40 bg-white/80 text-emerald-700 backdrop-blur">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-700">{m.category}</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">{m.business_name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function NewsPreview() {
  const { data: items = [] } = useLiveData<Post[]>(
    async () => (await listPublicPosts()).slice(0, 3),
    ['post_created', 'post_updated', 'post_deleted'],
    []
  );

  return (
    <section className="container-page pb-20 pt-14">
      <SectionHeader
        eyebrow="Berita & Pengumuman"
        title="Kabar terbaru dari desa"
        action={<Link to="/berita" className="btn-outline">Semua berita</Link>}
      />
      {items.length === 0 ? (
        <div className="mt-8 card p-8 text-center text-sm text-slate-500">
          Belum ada artikel diterbitkan. Admin desa akan memuat berita & pengumuman di sini.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {items.map((p, i) => (
            <Link
              key={p.id}
              to={`/berita/${p.slug}`}
              className={`card group overflow-hidden transition hover:-translate-y-1 hover:shadow-soft ${i === 0 && items.length >= 2 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
            >
              <div className={`relative ${i === 0 && items.length >= 2 ? 'h-72' : 'h-44'} overflow-hidden bg-slate-100`}>
                {p.image_url && (
                  <SmartImage src={p.image_url} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                )}
                <span className="chip absolute left-3 top-3 border border-white/40 bg-white/80 capitalize text-brand-700 backdrop-blur">
                  {p.type}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs text-slate-500">{formatDate(p.published_at)} · {p.author}</p>
                <h3 className={`mt-1 font-semibold text-slate-900 ${i === 0 && items.length >= 2 ? 'text-xl' : 'text-base'}`}>{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
