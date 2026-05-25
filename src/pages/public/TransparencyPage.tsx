import { Download, FileSpreadsheet, TrendingUp, Wallet } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { StatCard } from '../../components/common/StatCard';
import { useLiveData } from '../../hooks/useLiveData';
import { listBudgetItems } from '../../services/budgetService';
import type { BudgetItem } from '../../types/app';
import { formatRupiah } from '../../utils/formatDate';

const COLORS = ['#0F766E', '#14B8A6', '#5EEAD4', '#F59E0B', '#F43F5E', '#38BDF8', '#8B5CF6', '#EC4899'];

export function TransparencyPage() {
  const { data: items = [], loading } = useLiveData<BudgetItem[]>(
    () => listBudgetItems(),
    ['budget_changed'],
    []
  );

  const total = items.reduce((s, b) => s + b.allocated_amount, 0);
  const realized = items.reduce((s, b) => s + b.realized_amount, 0);
  const programs = items.length;
  const completed = items.filter((b) => b.allocated_amount > 0 && b.realized_amount / b.allocated_amount >= 0.9).length;

  return (
    <div>
      <Seo title="Transparansi Anggaran" description="Ringkasan APBDes, alokasi, dan progress program desa." />
      <PageHeader eyebrow="Transparansi" title="Anggaran & Program Desa" description="Ringkasan APBDes, alokasi, dan progress program desa." />
      <div className="container-page space-y-10 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Total Anggaran" value={formatRupiah(total)} tone="brand" />
          <StatCard icon={TrendingUp} label="Realisasi" value={formatRupiah(realized)} tone="amber" />
          <StatCard icon={FileSpreadsheet} label="Program Berjalan" value={programs} tone="violet" />
          <StatCard icon={TrendingUp} label="Program Hampir Selesai" value={completed} tone="sky" />
        </div>

        {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat data anggaran...</div>}
        {!loading && items.length === 0 && (
          <EmptyState
            title="Belum ada data anggaran"
            description="Data APBDes akan ditampilkan di sini setelah diinput oleh admin desa."
            icon={<Wallet className="h-7 w-7" />}
          />
        )}

        {!loading && items.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="card p-6 lg:col-span-2">
              <h3 className="text-base font-semibold text-slate-900">Alokasi Anggaran</h3>
              <p className="text-sm text-slate-500">Distribusi APBDes per kategori.</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={items} dataKey="allocated_amount" nameKey="category" innerRadius={50} outerRadius={90} paddingAngle={2}>
                      {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatRupiah(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                {items.map((b, i) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-600">{b.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 lg:col-span-3">
              <h3 className="text-base font-semibold text-slate-900">Progress Program</h3>
              <div className="mt-4 space-y-3">
                {items.map((b) => {
                  const pct = b.allocated_amount > 0 ? Math.round((b.realized_amount / b.allocated_amount) * 100) : 0;
                  return (
                    <div key={b.id} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-semibold text-slate-800">{b.category}</p>
                        <p className="text-slate-600">{pct}%</p>
                      </div>
                      <p className="text-xs text-slate-500">{b.title}</p>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span>Realisasi {formatRupiah(b.realized_amount)}</span>
                        <span>Pagu {formatRupiah(b.allocated_amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-900">Dokumen Publik</h3>
          <p className="mt-1 text-sm text-slate-500">Dokumen resmi yang dapat diakses publik.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {['Laporan APBDes Tahun Berjalan', 'RPJM Desa', 'Laporan Realisasi Triwulan', 'Profil Desa'].map((d) => (
              <div key={d} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm">
                <span className="font-medium text-slate-800">{d}</span>
                <span className="text-xs text-slate-400">Belum tersedia</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
