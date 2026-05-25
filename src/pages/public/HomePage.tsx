import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
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
import { SectionHeader } from '../../components/common/SectionHeader';
import { Seo } from '../../components/common/Seo';
import { SmartImage } from '../../components/common/SmartImage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { villageStats } from '../../data/dummyData';
import { listPublicComplaints } from '../../services/complaintsService';
import { listPublicMSMEs } from '../../services/msmeService';
import { listPublicPosts } from '../../services/postsService';
import type { Complaint, MSME, Post } from '../../types/app';
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

const aiPrompts = [
  'Syarat membuat surat domisili apa?',
  'Bagaimana cara mengajukan SKU?',
  'Kapan jadwal posyandu?',
  'Bagaimana melapor jalan rusak?',
];

export function HomePage() {
  return (
    <div>
      <Seo
        title="Beranda"
        description="Layanan desa lebih mudah, cepat, dan transparan. Ajukan surat, lapor pengaduan, akses bansos, temukan UMKM lokal, dan tanya AI Desa."
      />
      <Hero />
      <QuickAccess />
      <Stats />
      <FeaturedServices />
      <HowItWorks />
      <ComplaintsPreview />
      <MSMEPreview />
      <AISection />
      <NewsPreview />
    </div>
  );
}

function Hero() {
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
      {/* Vignette gradient — terang di kanan (foto desa kelihatan), 
          lembut di kiri (text readable) */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/45 to-white/15" />
      {/* Tint hijau halus untuk match brand */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-transparent to-emerald-50/30" />
      <div className="absolute inset-0 bg-topo-pattern opacity-20" />
      <div className="blob h-80 w-80 -top-20 -left-20 bg-brand-200/40" />
      <div className="blob h-96 w-96 -bottom-32 -right-20 bg-emerald-200/40" />
      <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Portal Digital Desa Modern
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              Layanan Desa Lebih <span className="gradient-text">Mudah, Cepat,</span> dan Transparan.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
              AksesDesa membantu warga mengurus administrasi, melihat pengumuman, mengajukan pengaduan, mengecek bantuan sosial, dan menemukan UMKM lokal dalam satu portal digital.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/ajukan" className="btn-primary">
                <FileText className="h-4 w-4" /> Ajukan Layanan
              </Link>
              <Link to="/pengaduan" className="btn-outline">
                <MessageSquareWarning className="h-4 w-4" /> Laporkan Masalah
              </Link>
              <Link to="/chatbot" className="btn-secondary">
                <Bot className="h-4 w-4" /> Tanya AI Desa
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: ClipboardList, label: 'Layanan Online' },
                { icon: MessageSquareWarning, label: 'Pengaduan Terpantau' },
                { icon: Newspaper, label: 'Info Terpusat' },
                { icon: Phone, label: 'Ramah Mobile' },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2 backdrop-blur">
                  <t.icon className="h-4 w-4 text-brand-600" />
                  <span className="text-xs font-medium text-slate-700">{t.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hero visual mockup */}
        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-emerald-500 text-white">
                    <Compass className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Desa Sukamaju</p>
                    <p className="text-[11px] text-slate-500">Command Center · Realtime</p>
                  </div>
                </div>
                <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Layanan Aktif
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { icon: FileText, label: 'Pengajuan Surat', value: '128', tone: 'from-brand-600 to-emerald-500' },
                  { icon: Store, label: 'UMKM Terdaftar', value: '34', tone: 'from-amber-500 to-rose-400' },
                  { icon: MessageSquareWarning, label: 'Pengaduan Diproses', value: '12', tone: 'from-sky-500 to-violet-500' },
                  { icon: Calendar, label: 'Agenda Bulan Ini', value: '8', tone: 'from-violet-500 to-fuchsia-500' },
                ].map((c) => (
                  <div key={c.label} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${c.tone} text-white`}>
                      <c.icon className="h-4 w-4" />
                    </span>
                    <p className="mt-2 text-xs text-slate-500">{c.label}</p>
                    <p className="text-xl font-bold text-slate-900">{c.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-emerald-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-brand-700">
                      <Bot className="h-4 w-4" />
                    </span>
                    <p className="text-xs font-semibold text-slate-800">AI Desa Siap Membantu</p>
                  </div>
                  <span className="text-[10px] text-slate-500">Online</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-600">
                  "Cari syarat surat, jadwal kegiatan, atau cara melapor pengaduan."
                </p>
              </div>
            </motion.div>

            {/* Floating cards — diposisikan di luar dashboard agar tidak menutupi konten */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -left-6 -bottom-4 hidden w-56 rounded-2xl border border-slate-100 bg-white p-3 shadow-soft animate-float sm:block"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Surat Domisili</p>
                  <p className="text-[10px] text-slate-500">ADS-2026-8F3K2 · Diproses</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-brand-600 to-emerald-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="absolute -right-6 -top-6 hidden w-60 rounded-2xl border border-slate-100 bg-white p-3 shadow-soft animate-float sm:block"
              style={{ animationDelay: '1s' }}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Pengaduan Lampu Jalan</p>
                  <p className="text-[10px] text-slate-500">Selesai · Dusun Melati</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px]">
                <MapPin className="h-3 w-3 text-rose-500" />
                <span className="text-slate-500">Diselesaikan dalam 2 hari</span>
              </div>
            </motion.div>
          </div>
        </div>
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
  const [items, setItems] = useState<Complaint[]>([]);
  useEffect(() => {
    listPublicComplaints(4).then(setItems).catch(() => setItems([]));
  }, []);
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
  const [items, setItems] = useState<MSME[]>([]);
  useEffect(() => {
    listPublicMSMEs().then((d) => setItems(d.slice(0, 4))).catch(() => setItems([]));
  }, []);
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

function AISection() {
  return (
    <section className="container-page py-14">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-slate-900 via-brand-900 to-emerald-900 p-8 sm:p-12 text-white">
        <div className="absolute inset-0 bg-topo-pattern opacity-20" />
        <div className="blob h-72 w-72 -top-10 -right-10 bg-brand-400/30" />
        <div className="blob h-72 w-72 -bottom-10 -left-10 bg-emerald-400/30" />
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="chip border border-white/20 bg-white/10 text-white">
              <Sparkles className="h-3.5 w-3.5" /> AI Desa
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Tanya AI Desa, dapat jawaban lebih cepat.
            </h2>
            <p className="mt-3 max-w-xl text-white/85">
              Cari syarat layanan, jadwal kegiatan, informasi bantuan sosial, dan panduan pengajuan tanpa harus bingung mencari halaman.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {aiPrompts.map((p) => (
                <Link
                  key={p}
                  to={`/chatbot?q=${encodeURIComponent(p)}`}
                  className="chip border border-white/20 bg-white/10 text-white/90 hover:bg-white/20"
                >
                  {p}
                </Link>
              ))}
            </div>
            <Link to="/chatbot" className="mt-6 inline-flex btn bg-white text-brand-800 hover:bg-cream">
              <Bot className="h-4 w-4" /> Mulai bertanya
            </Link>
          </div>
          <div className="lg:col-span-5">
            <div className="glass relative rounded-2xl border-white/20 bg-white/10 p-4 text-white/90">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">AI Desa</p>
                  <p className="text-[11px] opacity-80">Asisten Layanan Desa</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl bg-white/15 px-3 py-2">
                  Syarat membuat surat domisili apa?
                </div>
                <div className="rounded-2xl bg-white/95 px-3 py-2 text-slate-800">
                  Cukup siapkan fotokopi KTP, KK, dan surat pengantar RT/RW. Diproses 1-2 hari kerja, gratis.
                </div>
              </div>
              <p className="mt-4 text-[11px] text-white/70">
                Disclaimer: jawaban AI bersifat informasi awal. Konfirmasi keputusan resmi ke kantor desa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsPreview() {
  const [items, setItems] = useState<Post[]>([]);
  useEffect(() => {
    listPublicPosts().then((d) => setItems(d.slice(0, 3))).catch(() => setItems([]));
  }, []);

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
