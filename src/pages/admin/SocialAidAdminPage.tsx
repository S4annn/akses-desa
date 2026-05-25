import { Edit, HandHeart, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { createAid, deleteAid, listAllAids, updateAid } from '../../services/socialAidService';
import type { SocialAid } from '../../types/app';

export function SocialAidAdminPage() {
  const [items, setItems] = useState<SocialAid[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<SocialAid | null>(null);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listAllAids());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function remove(id: string) {
    if (!confirm('Hapus program ini?')) return;
    try {
      await deleteAid(id);
      setItems((arr) => arr.filter((x) => x.id !== id));
      show('Program dihapus', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal hapus', 'error');
    }
  }

  async function save(payload: Omit<SocialAid, 'id'>) {
    try {
      if (edit) {
        await updateAid(edit.id, payload);
      } else {
        await createAid(payload);
      }
      show('Disimpan', 'success');
      setEdit(null);
      setCreating(false);
      refresh();
    } catch (err) {
      show((err as Error).message || 'Gagal simpan', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bantuan Sosial</h1>
          <p className="text-sm text-slate-500">Kelola program bantuan dan usulan warga.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Program Baru</button>
      </div>

      {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat program...</div>}
      {!loading && items.length === 0 && (
        <EmptyState
          title="Belum ada program bantuan"
          description="Buat program bantuan sosial pertama untuk dibuka kepada warga."
          icon={<HandHeart className="h-7 w-7" />}
          action={<button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Program Baru</button>}
        />
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <HandHeart className="h-5 w-5" />
                </span>
                <span className={`chip border ${s.status === 'Aktif' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>{s.status}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{s.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{s.description}</p>
              <p className="mt-2 text-xs text-slate-500">Periode: {s.period}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setEdit(s)} className="btn-outline flex-1 justify-center"><Edit className="h-4 w-4" /> Edit</button>
                <button onClick={() => remove(s.id)} className="btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!edit || creating} onClose={() => { setEdit(null); setCreating(false); }} title={edit ? 'Edit Program' : 'Program Baru'}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await save({
              name: String(fd.get('name') ?? ''),
              description: String(fd.get('description') ?? ''),
              requirements: String(fd.get('requirements') ?? '').split('\n').map((s) => s.trim()).filter(Boolean),
              required_documents: String(fd.get('required_documents') ?? '').split('\n').map((s) => s.trim()).filter(Boolean),
              period: String(fd.get('period') ?? '-'),
              status: (fd.get('status') as 'Aktif' | 'Tutup') ?? 'Aktif',
            });
          }}
          className="space-y-3"
        >
          <div><label className="label">Nama program</label><input name="name" className="input" defaultValue={edit?.name} required /></div>
          <div><label className="label">Deskripsi</label><textarea name="description" className="input" rows={3} defaultValue={edit?.description} required /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Persyaratan (1 per baris)</label><textarea name="requirements" className="input" rows={4} defaultValue={edit?.requirements.join('\n')} /></div>
            <div><label className="label">Dokumen dibutuhkan (1 per baris)</label><textarea name="required_documents" className="input" rows={4} defaultValue={edit?.required_documents.join('\n')} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Periode</label><input name="period" className="input" defaultValue={edit?.period ?? 'Bulanan'} required /></div>
            <div>
              <label className="label">Status</label>
              <select name="status" className="input" defaultValue={edit?.status ?? 'Aktif'}>
                <option>Aktif</option>
                <option>Tutup</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => { setEdit(null); setCreating(false); }} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
