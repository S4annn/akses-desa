import { Eye, MapPin, MessageCircle, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { RealMap, complaintMarkerColor, type MapMarker } from '../../components/common/RealMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../hooks/useToast';
import {
  deleteComplaint,
  listComplaintsForAdmin,
  updateComplaintStatus,
} from '../../services/complaintsService';
import { subscribeRefresh } from '../../services/notificationBus';
import type { Complaint, ComplaintStatus, Urgency } from '../../types/app';
import { formatDate } from '../../utils/formatDate';

export function ComplaintsAdminPage() {
  const [items, setItems] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ComplaintStatus | 'Semua'>('Semua');
  const [urgency, setUrgency] = useState<Urgency | 'Semua'>('Semua');
  const [active, setActive] = useState<Complaint | null>(null);
  const { show } = useToast();

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listComplaintsForAdmin());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // Auto-refresh saat ada event di bus dari tab lain / form publik
    const unsub = subscribeRefresh(
      ['complaint_created', 'complaint_updated', 'complaint_deleted'],
      refresh
    );
    return unsub;
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((c) => {
        if (status !== 'Semua' && c.status !== status) return false;
        if (urgency !== 'Semua' && c.citizen_urgency !== urgency) return false;
        if (
          search &&
          !`${c.tracking_code} ${c.category} ${c.location}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [items, search, status, urgency]
  );

  const mapMarkers: MapMarker[] = filtered
    .filter((c): c is Complaint & { latitude: number; longitude: number } =>
      c.latitude != null && c.longitude != null
    )
    .map((c) => ({
      id: c.id,
      lat: c.latitude,
      lng: c.longitude,
      color: complaintMarkerColor(c.citizen_urgency, c.category),
      popupTitle: c.category,
      popupBody: `${c.tracking_code} · ${c.location}`,
    }));

  async function update(id: string, st: ComplaintStatus, response?: string) {
    try {
      await updateComplaintStatus(id, st, response);
      setItems((arr) =>
        arr.map((c) => (c.id === id ? { ...c, status: st, admin_response: response ?? c.admin_response } : c))
      );
      show('Status pengaduan diperbarui', 'success');
      setActive(null);
    } catch (err) {
      show((err as Error).message || 'Gagal update status', 'error');
    }
  }

  async function remove(id: string, fromList = false) {
    if (!confirm('Hapus pengaduan ini? Tindakan tidak dapat dibatalkan.')) return;
    try {
      await deleteComplaint(id);
      setItems((arr) => arr.filter((c) => c.id !== id));
      show('Pengaduan dihapus', 'success');
      if (!fromList) setActive(null);
    } catch (err) {
      show((err as Error).message || 'Gagal hapus', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaduan Warga</h1>
        <p className="text-sm text-slate-500">Pantau, tindaklanjuti, atau hapus laporan warga.</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <input className="input flex-1 min-w-[200px]" placeholder="Cari kode/kategori/lokasi..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus | 'Semua')}>
            <option>Semua</option>
            <option>Masuk</option>
            <option>Ditinjau</option>
            <option>Dalam Tindak Lanjut</option>
            <option>Selesai</option>
            <option>Ditolak</option>
          </select>
          <select className="input" value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency | 'Semua')}>
            <option>Semua</option>
            <option value="rendah">Rendah</option>
            <option value="sedang">Sedang</option>
            <option value="tinggi">Tinggi</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat data...</div>}
          {!loading && filtered.length === 0 && (
            <div className="card p-8 text-center text-sm text-slate-500">Tidak ada pengaduan sesuai filter.</div>
          )}
          {!loading &&
            filtered.map((c) => (
              <div key={c.id} className="card flex items-start gap-3 p-4">
                <button
                  onClick={() => setActive(c)}
                  className="flex flex-1 items-start gap-3 text-left"
                  aria-label={`Detail ${c.tracking_code}`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs font-semibold text-brand-700">{c.tracking_code}</p>
                      <StatusBadge kind="complaint" value={c.status} />
                      <StatusBadge kind="urgency" value={c.citizen_urgency} />
                    </div>
                    <p className="mt-1 font-semibold text-slate-900">{c.category}</p>
                    <p className="text-sm text-slate-500">{c.location}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(c.created_at)}</p>
                  </div>
                </button>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    onClick={() => setActive(c)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Lihat detail"
                    title="Detail"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(c.id, true)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-rose-500 hover:bg-rose-50"
                    aria-label="Hapus pengaduan"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <MapPin className="h-4 w-4 text-rose-500" /> Peta Pengaduan
          </h3>
          <div className="mt-3 h-72 overflow-hidden rounded-xl">
            <RealMap markers={mapMarkers} zoom={14} scrollWheelZoom={false} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {mapMarkers.length === 0
              ? 'Belum ada pengaduan dengan koordinat. Tambahkan koordinat lokasi saat melapor agar muncul di peta.'
              : `${mapMarkers.length} pengaduan dengan koordinat lokasi.`}
          </p>
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.category} description={active?.location} size="lg">
        {active && <Detail c={active} onUpdate={update} onDelete={remove} />}
      </Modal>
    </div>
  );
}

function Detail({
  c,
  onUpdate,
  onDelete,
}: {
  c: Complaint;
  onUpdate: (id: string, st: ComplaintStatus, r?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [status, setStatus] = useState<ComplaintStatus>(c.status);
  const [response, setResponse] = useState(c.admin_response ?? '');

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-3 text-sm">
        <p className="font-mono text-xs text-brand-700">{c.tracking_code}</p>
        <p className="mt-1 font-semibold text-slate-900">{c.category}</p>
        <p className="text-slate-600">{c.description}</p>
        {!c.is_anonymous && c.citizen_name && (
          <p className="mt-2 text-xs text-slate-500">
            Pelapor: <span className="font-medium text-slate-700">{c.citizen_name}</span>
            {c.phone && <> · {c.phone}</>}
          </p>
        )}
        {c.is_anonymous && <p className="mt-2 text-xs italic text-slate-400">Pelapor anonim</p>}
      </div>

      {c.ai_summary && (
        <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-3">
          <p className="flex items-center gap-1 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" /> Analisis AI
          </p>
          <p className="mt-1 text-sm">
            <b>Kategori:</b> {c.ai_category} · <b>Urgensi:</b> <StatusBadge kind="urgency" value={c.ai_urgency ?? 'sedang'} />
          </p>
          <p className="mt-1 text-sm text-slate-700">
            <b>Ringkasan:</b> {c.ai_summary}
          </p>
          <p className="text-sm text-slate-700">
            <b>Rekomendasi:</b> {c.ai_recommended_action}
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Update status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus)}>
            {['Masuk', 'Ditinjau', 'Dalam Tindak Lanjut', 'Selesai', 'Ditolak'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tanggapan admin</label>
          <input className="input" value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Tindakan/balasan untuk warga" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap gap-2">
          {c.phone && !c.is_anonymous && (
            <button
              type="button"
              onClick={() => {
                const wa = `https://wa.me/${c.phone!.replace(/^0/, '62').replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                  `Halo, ini update untuk pengaduan Anda di AksesDesa.\n\n` +
                    `🔢 Kode: ${c.tracking_code}\n` +
                    `📌 Kategori: ${c.category}\n` +
                    `📍 Lokasi: ${c.location}\n` +
                    `📊 Status: ${status}\n\n` +
                    (response ? `Tanggapan admin:\n${response}\n\n` : '') +
                    `Terima kasih atas laporannya.`
                )}`;
                window.open(wa, '_blank', 'noopener,noreferrer');
              }}
              className="btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <MessageCircle className="h-4 w-4" /> Notifikasi WA
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(c.id)}
            className="btn-outline border-rose-300 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" /> Hapus
          </button>
        </div>
        <button onClick={() => onUpdate(c.id, status, response)} className="btn-primary">
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
