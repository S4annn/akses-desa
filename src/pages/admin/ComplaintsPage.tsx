import { Eye, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../hooks/useToast';
import { listComplaintsForAdmin, updateComplaintStatus } from '../../services/complaintsService';
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

  useEffect(() => {
    setLoading(true);
    listComplaintsForAdmin()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => items.filter((c) => {
    if (status !== 'Semua' && c.status !== status) return false;
    if (urgency !== 'Semua' && c.citizen_urgency !== urgency) return false;
    if (search && !`${c.tracking_code} ${c.category} ${c.location}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, search, status, urgency]);

  async function update(id: string, st: ComplaintStatus, response?: string) {
    try {
      await updateComplaintStatus(id, st, response);
      setItems((arr) => arr.map((c) => (c.id === id ? { ...c, status: st, admin_response: response ?? c.admin_response } : c)));
      show('Status pengaduan diperbarui', 'success');
      setActive(null);
    } catch (err) {
      show((err as Error).message || 'Gagal update status', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaduan Warga</h1>
        <p className="text-sm text-slate-500">Pantau dan tindaklanjuti laporan warga.</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <input className="input flex-1 min-w-[200px]" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus | 'Semua')}>
            <option>Semua</option>
            <option>Masuk</option><option>Ditinjau</option><option>Dalam Tindak Lanjut</option><option>Selesai</option><option>Ditolak</option>
          </select>
          <select className="input" value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency | 'Semua')}>
            <option>Semua</option><option value="rendah">Rendah</option><option value="sedang">Sedang</option><option value="tinggi">Tinggi</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat data...</div>}
          {!loading && filtered.length === 0 && <div className="card p-8 text-center text-sm text-slate-500">Tidak ada pengaduan sesuai filter.</div>}
          {!loading && filtered.map((c) => (
            <button key={c.id} onClick={() => setActive(c)} className="card flex w-full items-start gap-3 p-4 text-left transition hover:shadow-soft">
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
              <Eye className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>
        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <MapPin className="h-4 w-4 text-rose-500" /> Peta Pengaduan
          </h3>
          <div className="mt-3 h-72 overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-emerald-50">
            <FakeMap />
          </div>
          <p className="mt-3 text-xs text-slate-500">Marker menunjukkan kategori dan lokasi pengaduan.</p>
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.category} description={active?.location} size="lg">
        {active && <Detail c={active} onUpdate={update} />}
      </Modal>
    </div>
  );
}

function Detail({ c, onUpdate }: { c: Complaint; onUpdate: (id: string, st: ComplaintStatus, r?: string) => void }) {
  const [status, setStatus] = useState<ComplaintStatus>(c.status);
  const [response, setResponse] = useState(c.admin_response ?? '');
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-3 text-sm">
        <p className="font-mono text-xs text-brand-700">{c.tracking_code}</p>
        <p className="mt-1 font-semibold text-slate-900">{c.category}</p>
        <p className="text-slate-600">{c.description}</p>
      </div>
      {c.ai_summary && (
        <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-3">
          <p className="flex items-center gap-1 text-xs font-semibold text-brand-700"><Sparkles className="h-3.5 w-3.5" /> Analisis AI</p>
          <p className="mt-1 text-sm"><b>Kategori:</b> {c.ai_category} · <b>Urgensi:</b> <StatusBadge kind="urgency" value={c.ai_urgency ?? 'sedang'} /></p>
          <p className="mt-1 text-sm text-slate-700"><b>Ringkasan:</b> {c.ai_summary}</p>
          <p className="text-sm text-slate-700"><b>Rekomendasi:</b> {c.ai_recommended_action}</p>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Update status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus)}>
            {['Masuk','Ditinjau','Dalam Tindak Lanjut','Selesai','Ditolak'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Tanggapan admin</label>
          <input className="input" value={response} onChange={(e) => setResponse(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => onUpdate(c.id, status, response)} className="btn-primary">Simpan</button>
      </div>
    </div>
  );
}

function FakeMap() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <defs>
        <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(20,184,166,.18)" strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid2)" />
      <path d="M0,160 C80,120 160,200 240,170 C320,140 380,210 400,170" stroke="#0F766E" strokeOpacity=".4" strokeWidth="2" fill="none" />
      {[
        { x: 80, y: 90, c: '#F43F5E' },
        { x: 200, y: 130, c: '#F59E0B' },
        { x: 300, y: 200, c: '#10B981' },
        { x: 130, y: 220, c: '#38BDF8' },
      ].map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r={14} fill={m.c} fillOpacity=".15" />
          <circle cx={m.x} cy={m.y} r={6} fill={m.c} />
          <circle cx={m.x} cy={m.y} r={3} fill="#fff" />
        </g>
      ))}
    </svg>
  );
}
