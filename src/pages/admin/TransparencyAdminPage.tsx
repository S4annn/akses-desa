import { Edit, FileSpreadsheet, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { createBudgetItem, deleteBudgetItem, listBudgetItems } from '../../services/budgetService';
import type { BudgetItem } from '../../types/app';
import { formatRupiah } from '../../utils/formatDate';

export function TransparencyAdminPage() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listBudgetItems());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function remove(id: string) {
    if (!confirm('Hapus item ini?')) return;
    try {
      await deleteBudgetItem(id);
      setItems((arr) => arr.filter((x) => x.id !== id));
      show('Item dihapus', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal hapus', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transparansi Anggaran</h1>
          <p className="text-sm text-slate-500">Kelola program & realisasi anggaran desa.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Program Baru</button>
      </div>

      {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat data...</div>}
      {!loading && items.length === 0 && (
        <EmptyState
          title="Belum ada data anggaran"
          description="Mulai catat alokasi APBDes per kategori agar tampil di halaman Transparansi."
          icon={<FileSpreadsheet className="h-7 w-7" />}
          action={<button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Program</button>}
        />
      )}

      {!loading && items.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Program</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Pagu</th><th className="px-4 py-3">Realisasi</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3"></th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((b) => {
                  const pct = b.allocated_amount > 0 ? Math.round((b.realized_amount / b.allocated_amount) * 100) : 0;
                  return (
                    <tr key={b.id}>
                      <td className="px-4 py-3"><p className="font-semibold text-slate-900">{b.title}</p><p className="text-xs text-slate-500">Tahun {b.year}</p></td>
                      <td className="px-4 py-3 text-slate-700">{b.category}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{formatRupiah(b.allocated_amount)}</td>
                      <td className="px-4 py-3 text-emerald-700">{formatRupiah(b.realized_amount)}</td>
                      <td className="px-4 py-3"><div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-gradient-to-r from-brand-600 to-emerald-500" style={{ width: `${pct}%` }} /></div><p className="mt-1 text-xs text-slate-500">{pct}%</p></td>
                      <td className="px-4 py-3 text-right">
                        <button className="btn-ghost"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => remove(b.id)} className="btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Program Anggaran Baru">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try {
              await createBudgetItem({
                title: String(fd.get('title') ?? ''),
                category: String(fd.get('category') ?? 'Umum'),
                year: Number(fd.get('year') ?? new Date().getFullYear()),
                allocated_amount: Number(fd.get('allocated') ?? 0),
                realized_amount: Number(fd.get('realized') ?? 0),
                description: String(fd.get('description') ?? ''),
              });
              show('Program ditambahkan', 'success');
              setCreating(false);
              refresh();
            } catch (err) {
              show((err as Error).message || 'Gagal tambah', 'error');
            }
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <div className="sm:col-span-2"><label className="label">Judul</label><input name="title" className="input" required /></div>
          <div><label className="label">Kategori</label><input name="category" className="input" required /></div>
          <div><label className="label">Tahun</label><input name="year" className="input" type="number" defaultValue={new Date().getFullYear()} required /></div>
          <div><label className="label">Pagu (Rupiah)</label><input name="allocated" className="input" type="number" required /></div>
          <div><label className="label">Realisasi (Rupiah)</label><input name="realized" className="input" type="number" required /></div>
          <div className="sm:col-span-2"><label className="label">Deskripsi</label><textarea name="description" className="input" rows={2} /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
