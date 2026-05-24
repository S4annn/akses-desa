import { Download, FileSpreadsheet, TrendingUp, Wallet } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { budgetItems } from '../../data/dummyData';
import { formatRupiah } from '../../utils/formatDate';

const COLORS = ['#0F766E', '#14B8A6', '#5EEAD4', '#F59E0B', '#F43F5E', '#38BDF8'];

export function TransparencyPage() {
  const total = budgetItems.reduce((s, b) => s + b.allocated_amount, 0);
  const realized = budgetItems.reduce((s, b) => s + b.realized_amount, 0);
  const programs = budgetItems.length;
  const completed = budgetItems.filter((b) => b.realized_amount / b.allocated_amount >= 0.9).length;

  return (
    <div>
      <PageHeader eyebrow="Transparansi" title="Anggaran & Program Desa" description="Ringkasan APBDes, alokasi, dan progress program desa." />
      <div className="container-page space-y-10 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Total Anggaran" value={formatRupiah(total)} tone="brand" />
          <StatCard icon={TrendingUp} label="Realisasi" value={formatRupiah(realized)} tone="amber" />
          <StatCard icon={FileSpreadsheet} label="Program Berjalan" value={programs} tone="violet" />
          <StatCard icon={TrendingUp} label="Program Hampir Selesai" value={completed} tone="sky" />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-900">Alokasi Anggaran</h3>
            <p className="text-sm text-slate-500">Distribusi APBDes 2026 per kategori.</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={budgetItems} dataKey="allocated_amount" nameKey="category" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {budgetItems.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatRupiah(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {budgetItems.map((b, i) => (
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
              {budgetItems.map((b) => {
                const pct = Math.round((b.realized_amount / b.allocated_amount) * 100);
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

        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-900">Dokumen Publik</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {['Laporan APBDes 2025', 'RPJM Desa 2024-2029', 'Laporan Realisasi Triwulan I', 'Profil Desa 2026'].map((d) => (
              <button key={d} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm hover:bg-slate-50">
                <span className="font-medium text-slate-800">{d}</span>
                <Download className="h-4 w-4 text-brand-600" />
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Data pada demo ini merupakan data contoh.</p>
        </div>
      </div>
    </div>
  );
}
