import { CheckCircle2, Edit, Plus, ShieldCheck, Store, ToggleLeft, ToggleRight, Trash2, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { listAllMSMEs, registerMSME, deleteMSME, toggleMSMEVerification, updateMSME } from '../../services/msmeService';
import { subscribeRefresh } from '../../services/notificationBus';
import type { MSME } from '../../types/app';

export function MSMEAdminPage() {
  const [items, setItems] = useState<MSME[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<MSME | null>(null);
  const [filter, setFilter] = useState<'Semua' | 'Verified' | 'Menunggu'>('Semua');
  const { show } = useToast();

  async function refresh() {
    setLoading(true);
    try {
      const data = await listAllMSMEs();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const unsub = subscribeRefresh(['msme_created', 'msme_updated', 'msme_deleted'], refresh);
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'Verified') return items.filter((m) => m.is_verified);
    if (filter === 'Menunggu') return items.filter((m) => !m.is_verified);
    return items;
  }, [items, filter]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((m) => {
      counts[m.category] = (counts[m.category] ?? 0) + 1;
    });
    return counts;
  }, [items]);

  const pendingCount = items.filter((m) => !m.is_verified).length;

  async function handleVerify(id: string, currentlyVerified: boolean) {
    try {
      await toggleMSMEVerification(id, !currentlyVerified);
      setItems((arr) => arr.map((m) => (m.id === id ? { ...m, is_verified: !currentlyVerified } : m)));
      show(currentlyVerified ? 'Verifikasi dibatalkan' : 'UMKM berhasil diverifikasi', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal update status', 'error');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus UMKM ini secara permanen? Tindakan tidak dapat dibatalkan.')) return;
    try {
      await deleteMSME(id);
      setItems((arr) => arr.filter((m) => m.id !== id));
      show('UMKM dihapus', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal hapus', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">UMKM Desa</h1>
          <p className="text-sm text-slate-500">
            Verifikasi dan kelola UMKM lokal.
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {pendingCount} menunggu verifikasi
              </span>
            )}
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah UMKM</button>
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Distribusi Kategori</h3>
          <div className="flex gap-2">
            {(['Semua', 'Menunggu', 'Verified'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip border ${
                  filter === f
                    ? 'border-brand-500 bg-brand-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}{f === 'Menunggu' && pendingCount > 0 ? ` (${pendingCount})` : ''}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(stats).map(([k, v]) => (
            <span key={k} className="chip border border-slate-200 bg-slate-50 text-slate-700">
              {k} · <b className="ml-1 text-brand-700">{v}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="px-4 py-3">UMKM</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Pemilik</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">Memuat data...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">Tidak ada UMKM sesuai filter.</td></tr>
              )}
              {!loading && filtered.map((m) => (
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
                    {m.is_verified ? (
                      <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="chip border border-amber-200 bg-amber-50 text-amber-700">
                        <XCircle className="h-3 w-3" /> Menunggu
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleVerify(m.id, m.is_verified)}
                        className={`btn ${m.is_verified ? 'btn-ghost' : 'btn-primary'} px-3 py-1.5 text-xs`}
                      >
                        {m.is_verified ? (
                          <>
                            <ToggleRight className="h-4 w-4 text-emerald-600" /> Cabut
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" /> Verifikasi
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setEditing(m)}
                        className="btn-ghost"
                        aria-label="Edit UMKM"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="btn-ghost text-rose-600"
                        aria-label="Hapus UMKM"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Tambah UMKM">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try {
              await registerMSME({
                business_name: String(fd.get('business_name') ?? ''),
                owner_name: String(fd.get('owner_name') ?? ''),
                category: String(fd.get('category') ?? 'Lainnya'),
                description: String(fd.get('description') ?? ''),
                phone: String(fd.get('phone') ?? '-'),
                address: String(fd.get('address') ?? ''),
              });
              show('UMKM ditambahkan', 'success');
              setCreating(false);
              refresh();
            } catch (err) {
              show((err as Error).message || 'Gagal tambah UMKM', 'error');
            }
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <div className="sm:col-span-2"><label className="label">Nama Usaha</label><input name="business_name" className="input" required /></div>
          <div><label className="label">Pemilik</label><input name="owner_name" className="input" required /></div>
          <div><label className="label">Kategori</label><input name="category" className="input" required /></div>
          <div className="sm:col-span-2"><label className="label">Deskripsi</label><textarea name="description" className="input" rows={2} /></div>
          <div className="sm:col-span-2"><label className="label">Alamat</label><input name="address" className="input" required /></div>
          <div><label className="label">No. WhatsApp</label><input name="phone" className="input" /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit UMKM" description={editing?.business_name}>
        {editing && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              try {
                await updateMSME(editing.id, {
                  business_name: String(fd.get('business_name') ?? ''),
                  owner_name: String(fd.get('owner_name') ?? ''),
                  category: String(fd.get('category') ?? 'Lainnya'),
                  description: String(fd.get('description') ?? ''),
                  phone: String(fd.get('phone') ?? ''),
                  address: String(fd.get('address') ?? ''),
                });
                show('UMKM diperbarui', 'success');
                setEditing(null);
                refresh();
              } catch (err) {
                show((err as Error).message || 'Gagal update', 'error');
              }
            }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <div className="sm:col-span-2"><label className="label">Nama Usaha</label><input name="business_name" className="input" defaultValue={editing.business_name} required /></div>
            <div><label className="label">Pemilik</label><input name="owner_name" className="input" defaultValue={editing.owner_name} required /></div>
            <div><label className="label">Kategori</label><input name="category" className="input" defaultValue={editing.category} required /></div>
            <div className="sm:col-span-2"><label className="label">Deskripsi</label><textarea name="description" className="input" rows={2} defaultValue={editing.description} /></div>
            <div className="sm:col-span-2"><label className="label">Alamat</label><input name="address" className="input" defaultValue={editing.address} required /></div>
            <div><label className="label">No. WhatsApp</label><input name="phone" className="input" defaultValue={editing.phone} /></div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Batal</button>
              <button type="submit" className="btn-primary">Simpan Perubahan</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
