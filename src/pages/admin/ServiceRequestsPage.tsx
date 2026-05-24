import { Download, Eye, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { sampleRequests, serviceTypes } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import type { ServiceRequest, ServiceStatus } from '../../types/app';
import { formatDate } from '../../utils/formatDate';

const allStatus: ServiceStatus[] = ['Diajukan', 'Diverifikasi', 'Butuh Perbaikan', 'Diproses', 'Siap Diambil', 'Selesai', 'Ditolak'];

export function ServiceRequestsAdminPage() {
  const [items, setItems] = useState(sampleRequests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'Semua'>('Semua');
  const [active, setActive] = useState<ServiceRequest | null>(null);
  const { show } = useToast();

  const filtered = useMemo(() => items.filter((r) => {
    if (statusFilter !== 'Semua' && r.status !== statusFilter) return false;
    if (search && !`${r.tracking_code} ${r.citizen_name} ${r.service_name}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, search, statusFilter]);

  function updateStatus(id: string, status: ServiceStatus, note?: string) {
    setItems((arr) => arr.map((r) => (r.id === id ? { ...r, status, admin_note: note ?? r.admin_note } : r)));
    show('Status diperbarui', 'success');
    setActive(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengajuan Surat</h1>
          <p className="text-sm text-slate-500">Kelola permintaan layanan administrasi warga.</p>
        </div>
        <button className="btn-outline"><Download className="h-4 w-4" /> Export CSV</button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Cari kode/nama/layanan..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | 'Semua')}>
              <option>Semua</option>
              {allStatus.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Layanan</th>
                <th className="px-4 py-3">Pemohon</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{r.tracking_code}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{r.service_name}</td>
                  <td className="px-4 py-3 text-slate-700">{r.citizen_name}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3"><StatusBadge kind="service" value={r.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setActive(r)} className="btn-ghost"><Eye className="h-4 w-4" /> Detail</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">Tidak ada data sesuai filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.service_name} description={active?.tracking_code} size="lg">
        {active && <Detail r={active} onUpdate={updateStatus} />}
      </Modal>
    </div>
  );
}

function Detail({ r, onUpdate }: { r: ServiceRequest; onUpdate: (id: string, status: ServiceStatus, note?: string) => void }) {
  const [status, setStatus] = useState<ServiceStatus>(r.status);
  const [note, setNote] = useState(r.admin_note ?? '');
  const svc = serviceTypes.find((s) => s.id === r.service_type_id);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Pemohon" value={r.citizen_name} />
        <Info label="Tanggal Pengajuan" value={formatDate(r.created_at)} />
        <Info label="Keperluan" value={r.purpose} wide />
        <Info label="No. WhatsApp" value={r.phone} />
        <Info label="Kategori" value={svc?.category ?? '-'} />
      </div>
      <div className="rounded-xl border border-slate-100 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dokumen Pendukung</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {['KTP.pdf', 'KK.pdf'].map((d) => (
            <span key={d} className="chip border border-slate-200 bg-slate-50 text-slate-700">{d}</span>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Update status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as ServiceStatus)}>
            {(['Diajukan','Diverifikasi','Butuh Perbaikan','Diproses','Siap Diambil','Selesai','Ditolak'] as ServiceStatus[]).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Catatan admin</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
        <button onClick={() => onUpdate(r.id, status, note)} className="btn-primary">Simpan Perubahan</button>
      </div>
    </div>
  );
}

function Info({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl border border-slate-100 p-3 ${wide ? 'sm:col-span-2' : ''}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}
