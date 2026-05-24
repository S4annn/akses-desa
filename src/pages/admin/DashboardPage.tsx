import {
  Activity,
  Calendar,
  CheckCircle2,
  FileText,
  HandHeart,
  Megaphone,
  MessageSquareWarning,
  Sparkles,
  Store,
  TrendingUp,
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { agendas, msmes, posts, sampleComplaints, sampleRequests, villageStats } from '../../data/dummyData';
import { timeAgo } from '../../utils/formatDate';

const weekly = [
  { day: 'Sen', pengajuan: 12, pengaduan: 4 },
  { day: 'Sel', pengajuan: 18, pengaduan: 6 },
  { day: 'Rab', pengajuan: 15, pengaduan: 5 },
  { day: 'Kam', pengajuan: 22, pengaduan: 8 },
  { day: 'Jum', pengajuan: 28, pengaduan: 7 },
  { day: 'Sab', pengajuan: 9, pengaduan: 3 },
  { day: 'Min', pengajuan: 6, pengaduan: 2 },
];
const byCategory = [
  { name: 'Jalan', value: 22 },
  { name: 'Lampu', value: 14 },
  { name: 'Sampah', value: 9 },
  { name: 'Drainase', value: 11 },
  { name: 'Lainnya', value: 6 },
];
const byStatus = [
  { name: 'Selesai', value: 64, color: '#10B981' },
  { name: 'Diproses', value: 22, color: '#8B5CF6' },
  { name: 'Diverifikasi', value: 9, color: '#14B8A6' },
  { name: 'Ditolak', value: 5, color: '#F43F5E' },
];

const activities = [
  { icon: FileText, text: 'Surat Domisili baru diajukan', time: new Date(Date.now() - 1000 * 60 * 8).toISOString(), tone: 'bg-brand-50 text-brand-700' },
  { icon: MessageSquareWarning, text: 'Pengaduan lampu jalan masuk', time: new Date(Date.now() - 1000 * 60 * 25).toISOString(), tone: 'bg-rose-50 text-rose-700' },
  { icon: Store, text: 'UMKM baru mendaftar: Keripik Singkong', time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), tone: 'bg-violet-50 text-violet-700' },
  { icon: Megaphone, text: 'Berita "Posyandu Bulan Ini" dipublikasikan', time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), tone: 'bg-amber-50 text-amber-700' },
];

export function DashboardPage() {
  const totalRequests = sampleRequests.length + 125;
  const pendingRequests = 17;
  const totalComplaints = sampleComplaints.length + 28;
  const openComplaints = 9;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Selamat datang kembali</h1>
          <p className="text-sm text-slate-500">Ringkasan aktivitas desa hari ini.</p>
        </div>
        <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> Sistem normal
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total Pengajuan" value={totalRequests} hint={`${pendingRequests} menunggu verifikasi`} tone="brand" />
        <StatCard icon={MessageSquareWarning} label="Total Pengaduan" value={totalComplaints} hint={`${openComplaints} belum selesai`} tone="rose" />
        <StatCard icon={Store} label="Total UMKM" value={msmes.length + 240} hint={`${msmes.filter((m) => m.is_verified).length + 200} terverifikasi`} tone="violet" />
        <StatCard icon={TrendingUp} label="Layanan Terselesaikan" value={`${villageStats.resolvedRate}%`} hint="rata-rata 30 hari" tone="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Pengajuan & Pengaduan Mingguan</h3>
              <p className="text-xs text-slate-500">7 hari terakhir</p>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#0F766E" stopOpacity={0.4} />
                    <stop offset="1" stopColor="#0F766E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#F43F5E" stopOpacity={0.3} />
                    <stop offset="1" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                <Area type="monotone" dataKey="pengajuan" stroke="#0F766E" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="pengaduan" stroke="#F43F5E" fill="url(#g2)" strokeWidth={2} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-base font-semibold text-slate-900">Status Layanan</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {byStatus.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {byStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900">Pengaduan per Kategori</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="value" fill="#14B8A6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-base font-semibold text-slate-900">Aktivitas Warga</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <LineChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Line type="monotone" dataKey="pengajuan" stroke="#0F766E" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <Activity className="h-4 w-4 text-brand-600" /> Aktivitas Terbaru
          </h3>
          <ul className="mt-3 divide-y divide-slate-100">
            {activities.map((a, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${a.tone}`}>
                  <a.icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">{a.text}</p>
                  <p className="text-xs text-slate-500">{timeAgo(a.time)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-amber-500" /> Prioritas
          </h3>
          <ul className="mt-3 space-y-3">
            <li className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-sm">
              <p className="font-semibold text-amber-900">3 pengajuan butuh verifikasi</p>
              <p className="text-xs text-amber-800">Tinjau dokumen yang dilampirkan warga.</p>
            </li>
            <li className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-sm">
              <p className="font-semibold text-rose-900">2 pengaduan urgent</p>
              <p className="text-xs text-rose-800">Tinjau lokasi dan koordinasikan dengan petugas teknis.</p>
            </li>
            <li className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-sm">
              <p className="font-semibold text-sky-900">5 usulan bansos menunggu</p>
              <p className="text-xs text-sky-800">Verifikasi kelayakan bersama tim sosial.</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Mini icon={HandHeart} title="Bansos Aktif" value={6} tone="bg-amber-50 text-amber-700" />
        <Mini icon={Calendar} title="Agenda Bulan Ini" value={agendas.length} tone="bg-violet-50 text-violet-700" />
        <Mini icon={Megaphone} title="Berita Aktif" value={posts.length} tone="bg-sky-50 text-sky-700" />
      </div>
    </div>
  );
}

function Mini({ icon: Icon, title, value, tone }: { icon: typeof Activity; title: string; value: number; tone: string }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
