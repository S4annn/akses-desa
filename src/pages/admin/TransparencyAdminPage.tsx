import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { budgetItems as initial } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import type { BudgetItem } from '../../types/app';
import { formatRupiah } from '../../utils/formatDate';

export function TransparencyAdminPage() {
  const [items, setItems] = useState<BudgetItem[]>(initial);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Transparansi Anggaran</h1><p className="text-sm text-slate-500">Kelola program & realisasi anggaran desa.</p></div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Program Baru</button>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Program</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Pagu</th><th className="px-4 py-3">Realisasi</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3"></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((b) => {
                const pct = Math.round((b.realized_amount / b.allocated_amount) * 100);
                return (
                  <tr key={b.id}>
                    <td className="px-4 py-3"><p className="font-semibold text-slate-900">{b.title}</p><p className="text-xs text-slate-500">Tahun {b.year}</p></td>
                    <td className="px-4 py-3 text-slate-700">{b.category}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{formatRupiah(b.allocated_amount)}</td>
                    <td className="px-4 py-3 text-emerald-700">{formatRupiah(b.realized_amount)}</td>
                    <td className="px-4 py-3"><div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-gradient-to-r from-brand-600 to-emerald-500" style={{ width: `${pct}%` }} /></div><p className="mt-1 text-xs text-slate-500">{pct}%</p></td>
                    <td className="px-4 py-3"><button className="btn-ghost"><Edit className="h-4 w-4" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Program Anggaran Baru">
        <form onSubmit={(e) => { e.preventDefault(); show('Program ditambahkan', 'success'); setCreating(false); }} className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label">Judul</label><input className="input" required /></div>
          <div><label className="label">Kategori</label><input className="input" required /></div>
          <div><label className="label">Tahun</label><input className="input" type="number" defaultValue={2026} required /></div>
          <div><label className="label">Pagu</label><input className="input" type="number" required /></div>
          <div><label className="label">Realisasi</label><input className="input" type="number" required /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
