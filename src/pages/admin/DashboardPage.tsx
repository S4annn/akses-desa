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
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { listAgendas } from '../../services/agendaService';
import { listComplaintsForAdmin } from '../../services/complaintsService';
import { listAllMSMEs } from '../../services/msmeService';
import { subscribeRefresh } from '../../services/notificationBus';
import { listAllPosts } from '../../services/postsService';
import { listRequestsForAdmin } from '../../services/serviceRequestsService';
import type { Agenda, Complaint, MSME, Post, ServiceRequest } from '../../types/app';
import { timeAgo } from '../../utils/formatDate';

export function DashboardPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [msmes, setMsmes] = useState<MSME[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [r, c, m, p, a] = await Promise.all([
          listRequestsForAdmin(),
          listComplaintsForAdmin(),
          listAllMSMEs(),
          listAllPosts(),
          listAgendas(),
        ]);
        setRequests(r);
        setComplaints(c);
        setMsmes(m);
        setPosts(p);
        setAgendas(a);
      } finally {
        setLoading(false);
      }
    }

    load();
    // Refresh dashboard saat ada event apapun
    const unsub = subscribeRefresh(
      [
        'request_created', 'request_updated', 'request_deleted',
        'complaint_created', 'complaint_updated', 'complaint_deleted',
        'msme_created', 'msme_updated', 'msme_deleted',
        'post_created', 'post_updated', 'post_deleted',
        'agenda_created', 'agenda_updated', 'agenda_deleted',
      ],
      load
    );
    return unsub;
  }, []);

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'Diajukan' || r.status === 'Diverifikasi').length;
  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter((c) => c.status !== 'Selesai' && c.status !== 'Ditolak').length;
  const totalMsmes = msmes.length;
  const verifiedMsmes = msmes.filter((m) => m.is_verified).length;
  const monthAgendas = useMemo(() => {
    const now = new Date();
    return agendas.filter((a) => {
      const d = new Date(a.start_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [agendas]);

  const resolvedRate = totalRequests
    ? Math.round((requests.filter((r) => r.status === 'Selesai').length / totalRequests) * 100)
    : 0;

  // Weekly aggregation
  const weekly = useMemo(() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const result = days.map((d) => ({ day: d, pengajuan: 0, pengaduan: 0 }));
    const cutoff = Date.now() - 7 * 86400000;
    requests.forEach((r) => {
      const t = new Date(r.created_at).getTime();
      if (t >= cutoff) result[new Date(t).getDay()].pengajuan++;
    });
    complaints.forEach((c) => {
      const t = new Date(c.created_at).getTime();
      if (t >= cutoff) result[new Date(t).getDay()].pengaduan++;
    });
    // Reorder: Senin sampai Minggu
    return [...result.slice(1), result[0]];
  }, [requests, complaints]);

  const byCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      const key = c.category.length > 12 ? c.category.slice(0, 12) + '...' : c.category;
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  const byStatus = useMemo(() => {
    const counts = { Selesai: 0, Diproses: 0, Diverifikasi: 0, Ditolak: 0, Lainnya: 0 };
    const colors = { Selesai: '#10B981', Diproses: '#8B5CF6', Diverifikasi: '#14B8A6', Ditolak: '#F43F5E', Lainnya: '#94A3B8' };
    requests.forEach((r) => {
      if (r.status === 'Selesai') counts.Selesai++;
      else if (r.status === 'Diproses') counts.Diproses++;
      else if (r.status === 'Diverifikasi') counts.Diverifikasi++;
      else if (r.status === 'Ditolak') counts.Ditolak++;
      else counts.Lainnya++;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors[name as keyof typeof colors],
    })).filter((s) => s.value > 0);
  }, [requests]);

  const recentActivities = useMemo(() => {
    const acts: Array<{ icon: typeof Activity; text: string; time: string; tone: string }> = [];
    requests.slice(0, 3).forEach((r) =>
      acts.push({
        icon: FileText,
        text: `${r.service_name} diajukan oleh ${r.citizen_name}`,
        time: r.created_at,
        tone: 'bg-brand-50 text-brand-700',
      })
    );
    complaints.slice(0, 3).forEach((c) =>
      acts.push({
        icon: MessageSquareWarning,
        text: `Pengaduan ${c.category} di ${c.location}`,
        time: c.created_at,
        tone: 'bg-rose-50 text-rose-700',
      })
    );
    return acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);
  }, [requests, complaints]);

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
        <StatCard icon={FileText} label="Total Pengajuan" value={loading ? '—' : totalRequests} hint={`${pendingRequests} menunggu verifikasi`} tone="brand" />
        <StatCard icon={MessageSquareWarning} label="Total Pengaduan" value={loading ? '—' : totalComplaints} hint={`${openComplaints} belum selesai`} tone="rose" />
        <StatCard icon={Store} label="Total UMKM" value={loading ? '—' : totalMsmes} hint={`${verifiedMsmes} terverifikasi`} tone="violet" />
        <StatCard icon={TrendingUp} label="Layanan Terselesaikan" value={loading ? '—' : `${resolvedRate}%`} hint="dari semua pengajuan" tone="amber" />
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
          {byStatus.length === 0 ? (
            <p className="mt-12 text-center text-sm text-slate-500">Belum ada data layanan.</p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900">Pengaduan per Kategori</h3>
          {byCategory.length === 0 ? (
            <p className="mt-12 text-center text-sm text-slate-500">Belum ada pengaduan.</p>
          ) : (
            <div className="mt-4 h-60">
              <ResponsiveContainer>
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Bar dataKey="value" fill="#14B8A6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="card p-5">
          <h3 className="text-base font-semibold text-slate-900">Aktivitas Pengajuan</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <LineChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94A3B8" allowDecimals={false} />
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
          {recentActivities.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-500">Belum ada aktivitas. Aktivitas baru akan muncul di sini.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {recentActivities.map((a, i) => (
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
          )}
        </div>

        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-amber-500" /> Prioritas
          </h3>
          <ul className="mt-3 space-y-3">
            {pendingRequests > 0 && (
              <li className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-sm">
                <p className="font-semibold text-amber-900">{pendingRequests} pengajuan butuh verifikasi</p>
                <p className="text-xs text-amber-800">Tinjau dokumen yang dilampirkan warga.</p>
              </li>
            )}
            {openComplaints > 0 && (
              <li className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-sm">
                <p className="font-semibold text-rose-900">{openComplaints} pengaduan terbuka</p>
                <p className="text-xs text-rose-800">Tinjau dan tindaklanjuti laporan warga.</p>
              </li>
            )}
            {msmes.filter((m) => !m.is_verified).length > 0 && (
              <li className="rounded-xl border border-violet-100 bg-violet-50/50 p-3 text-sm">
                <p className="font-semibold text-violet-900">{msmes.filter((m) => !m.is_verified).length} UMKM menunggu verifikasi</p>
                <p className="text-xs text-violet-800">Periksa kelengkapan data UMKM baru.</p>
              </li>
            )}
            {pendingRequests === 0 && openComplaints === 0 && msmes.filter((m) => !m.is_verified).length === 0 && !loading && (
              <li className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center text-sm">
                <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600" />
                <p className="mt-1 font-semibold text-emerald-900">Semua tertangani</p>
                <p className="text-xs text-emerald-800">Tidak ada item prioritas saat ini.</p>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Mini icon={HandHeart} title="UMKM Verified" value={verifiedMsmes} tone="bg-amber-50 text-amber-700" />
        <Mini icon={Calendar} title="Agenda Bulan Ini" value={monthAgendas} tone="bg-violet-50 text-violet-700" />
        <Mini icon={Megaphone} title="Berita Terbit" value={posts.filter((p) => true).length} tone="bg-sky-50 text-sky-700" />
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
