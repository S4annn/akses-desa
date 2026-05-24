import { CheckCircle2, Edit, Plus, Store, ToggleLeft, ToggleRight, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { msmes as initial } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import type { MSME } from '../../types/app';

export function MSMEAdminPage() {
  const [items, setItems] = useState<MSME[]>(initial);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((m) => { counts[m.category] = (counts[m.category] ?? 0) + 1; });
    return counts;
  }, [items]);

  function toggleVerified(id: string) {
    setItems((arr) => arr.map((m) => (m.id === id ? { ...m, is_verified: !m.is_verified } : m)));
    show('Status verifikasi diperbarui', 'success');
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">UMKM Desa</h1>
          <p className="text-sm text-slate-500">Verifikasi dan kelola UMKM lokal.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah UMKM</button>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900">Distribusi Kategori</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(stats).map(([k, v]) => (
            <span key={k} className="chip border border-slate-200 bg-slate-50 text-slate-700">{k} · <b className="text-brand-700 ml-1">{v}</b></span>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="px-4 py-3">UMKM</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Pemilik</th><th className="px-4 py-3">Verified</th><th className="px-4 py-3">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-600"><Store className="h-4 w-4" /></div>
                      <div>
                        <p className="font-semibold text-slate-900">{m.business_name}</p>
                        <p className="text-xs text-slate-500">{m.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{m.category}</td>
                  <td className="px-4 py-3 text-slate-700">{m.owner_name}</td>
                  <td className="px-4 py-3">
                    {m.is_verified ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-slate-300" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => toggleVerified(m.id)} className="btn-ghost">
                        {m.is_verified ? <ToggleRight className="h-4 w-4 text-emerald-600" /> : <ToggleLeft className="h-4 w-4" />}
                        {m.is_verified ? 'Verified' : 'Verifikasi'}
                      </button>
                      <button className="btn-ghost"><Edit className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Tambah UMKM">
        <form onSubmit={(e) => { e.preventDefault(); show('UMKM ditambahkan', 'success'); setCreating(false); }} className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label">Nama Usaha</label><input className="input" required /></div>
          <div><label className="label">Pemilik</label><input className="input" required /></div>
          <div><label className="label">Kategori</label><input className="input" required /></div>
          <div className="sm:col-span-2"><label className="label">Alamat</label><input className="input" required /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
