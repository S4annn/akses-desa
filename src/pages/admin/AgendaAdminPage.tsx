import { Calendar, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { agendas as initial } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import type { Agenda } from '../../types/app';
import { formatDateTime } from '../../utils/formatDate';

export function AgendaAdminPage() {
  const [items, setItems] = useState<Agenda[]>(initial);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda Kegiatan</h1>
          <p className="text-sm text-slate-500">Atur jadwal kegiatan desa.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Agenda Baru</button>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Agenda</th><th className="px-4 py-3">Lokasi</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Tanggal</th><th className="px-4 py-3"></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600"><Calendar className="h-4 w-4" /></span>
                      <div><p className="font-semibold text-slate-900">{a.title}</p><p className="text-xs text-slate-500 line-clamp-1">{a.description}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{a.location}</td>
                  <td className="px-4 py-3"><span className="chip border border-slate-200 bg-slate-50 text-slate-700">{a.category}</span></td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(a.start_date)}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="btn-ghost"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => { setItems((arr) => arr.filter((x) => x.id !== a.id)); show('Agenda dihapus', 'success'); }} className="btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Agenda Baru">
        <form onSubmit={(e) => { e.preventDefault(); show('Agenda ditambahkan', 'success'); setCreating(false); }} className="space-y-3">
          <div><label className="label">Judul</label><input className="input" required /></div>
          <div><label className="label">Deskripsi</label><textarea className="input" rows={3} required /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Lokasi</label><input className="input" required /></div>
            <div><label className="label">Kategori</label><input className="input" required /></div>
            <div><label className="label">Tanggal mulai</label><input type="datetime-local" className="input" required /></div>
            <div><label className="label">Tanggal selesai</label><input type="datetime-local" className="input" /></div>
          </div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
