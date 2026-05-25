import { Calendar, Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { createAgenda, deleteAgenda, listAgendas } from '../../services/agendaService';
import { subscribeRefresh } from '../../services/notificationBus';
import type { Agenda } from '../../types/app';
import { formatDateTime } from '../../utils/formatDate';

export function AgendaAdminPage() {
  const [items, setItems] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listAgendas());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const unsub = subscribeRefresh(['agenda_created', 'agenda_updated', 'agenda_deleted'], refresh);
    return unsub;
  }, []);

  async function remove(id: string) {
    if (!confirm('Hapus agenda ini?')) return;
    try {
      await deleteAgenda(id);
      setItems((arr) => arr.filter((x) => x.id !== id));
      show('Agenda dihapus', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal hapus', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda Kegiatan</h1>
          <p className="text-sm text-slate-500">Atur jadwal kegiatan desa.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Agenda Baru</button>
      </div>

      {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat agenda...</div>}
      {!loading && items.length === 0 && (
        <EmptyState
          title="Belum ada agenda"
          description="Tambahkan kegiatan desa agar warga bisa melihat jadwal."
          icon={<Calendar className="h-7 w-7" />}
          action={<button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Agenda</button>}
        />
      )}

      {!loading && items.length > 0 && (
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
                      <button onClick={() => remove(a.id)} className="btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Agenda Baru">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try {
              await createAgenda({
                title: String(fd.get('title') ?? ''),
                description: String(fd.get('description') ?? ''),
                location: String(fd.get('location') ?? ''),
                category: String(fd.get('category') ?? 'Umum'),
                start_date: String(fd.get('start_date') ?? new Date().toISOString()),
                end_date: (fd.get('end_date') as string) || undefined,
              });
              show('Agenda ditambahkan', 'success');
              setCreating(false);
              refresh();
            } catch (err) {
              show((err as Error).message || 'Gagal tambah agenda', 'error');
            }
          }}
          className="space-y-3"
        >
          <div><label className="label">Judul</label><input name="title" className="input" required /></div>
          <div><label className="label">Deskripsi</label><textarea name="description" className="input" rows={3} required /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Lokasi</label><input name="location" className="input" required /></div>
            <div><label className="label">Kategori</label><input name="category" className="input" required /></div>
            <div><label className="label">Tanggal mulai</label><input name="start_date" type="datetime-local" className="input" required /></div>
            <div><label className="label">Tanggal selesai (opsional)</label><input name="end_date" type="datetime-local" className="input" /></div>
          </div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
