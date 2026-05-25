import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileSearch,
  Loader2,
  MapPin,
  MessageSquareWarning,
  Package,
  Stamp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { StatusBadge } from '../../components/common/StatusBadge';
import { findComplaintByTrackingCode } from '../../services/complaintsService';
import { findRequestByTrackingCode } from '../../services/serviceRequestsService';
import type { Complaint, ComplaintStatus, ServiceRequest, ServiceStatus } from '../../types/app';
import { formatDate } from '../../utils/formatDate';
import { maskName } from '../../utils/maskSensitiveData';

const requestStages: { label: string; status: ServiceStatus; icon: typeof Clock }[] = [
  { label: 'Pengajuan diterima', status: 'Diajukan', icon: ClipboardCheck },
  { label: 'Diverifikasi', status: 'Diverifikasi', icon: FileSearch },
  { label: 'Diproses', status: 'Diproses', icon: Stamp },
  { label: 'Siap diambil', status: 'Siap Diambil', icon: Package },
  { label: 'Selesai', status: 'Selesai', icon: CheckCircle2 },
];

const complaintStages: { label: string; status: ComplaintStatus; icon: typeof Clock }[] = [
  { label: 'Laporan masuk', status: 'Masuk', icon: ClipboardCheck },
  { label: 'Ditinjau', status: 'Ditinjau', icon: FileSearch },
  { label: 'Dalam tindak lanjut', status: 'Dalam Tindak Lanjut', icon: Stamp },
  { label: 'Selesai', status: 'Selesai', icon: CheckCircle2 },
];

type ResultType =
  | { kind: 'request'; data: ServiceRequest }
  | { kind: 'complaint'; data: Complaint }
  | null;

export function TrackingPage() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get('code') ?? '');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType>(null);

  async function search(target: string) {
    if (!target.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const upper = target.trim().toUpperCase();
      // Coba sebagai pengajuan dulu (ADS-...), kalau bukan baru pengaduan (ADU-... / BNS-...)
      if (upper.startsWith('ADS')) {
        const r = await findRequestByTrackingCode(upper);
        setResult(r ? { kind: 'request', data: r } : null);
      } else if (upper.startsWith('ADU')) {
        const c = await findComplaintByTrackingCode(upper);
        setResult(c ? { kind: 'complaint', data: c } : null);
      } else {
        // Coba dua-duanya
        const [r, c] = await Promise.all([
          findRequestByTrackingCode(upper),
          findComplaintByTrackingCode(upper),
        ]);
        if (r) setResult({ kind: 'request', data: r });
        else if (c) setResult({ kind: 'complaint', data: c });
        else setResult(null);
      }
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initial = params.get('code');
    if (initial) search(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Seo title="Cek Status" description="Lacak status pengajuan layanan atau pengaduan Anda dengan kode tracking." />
      <PageHeader
        eyebrow="Cek Status"
        title="Lacak Status Pengajuan & Pengaduan"
        description="Masukkan kode tracking yang Anda terima saat mengajukan layanan atau melaporkan pengaduan. Format: ADS-... untuk pengajuan, ADU-... untuk pengaduan."
      />
      <div className="container-page py-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(code);
          }}
          className="card mx-auto flex max-w-2xl items-center gap-2 p-3"
        >
          <FileSearch className="ml-2 h-5 w-5 text-brand-600" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Contoh: ADS-2026-8F3K2 atau ADU-2026-7K2MN"
            className="input border-0 focus:ring-0"
            autoFocus
          />
          <button type="submit" disabled={loading || !code.trim()} className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lacak'}
          </button>
        </form>

        <div className="mx-auto mt-6 max-w-3xl">
          {searched && !loading && !result && (
            <div className="card p-6 text-center text-slate-600">
              Kode tracking tidak ditemukan. Pastikan format dan kode sesuai dengan yang diberikan saat pengajuan/pengaduan.
            </div>
          )}
          {result?.kind === 'request' && <RequestResult r={result.data} />}
          {result?.kind === 'complaint' && <ComplaintResult c={result.data} />}
        </div>
      </div>
    </div>
  );
}

function RequestResult({ r }: { r: ServiceRequest }) {
  const activeIndex = requestStages.findIndex((s) => s.status === r.status);
  const isRejected = r.status === 'Ditolak';
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Pengajuan Surat · {r.tracking_code}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{r.service_name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            Pemohon: {maskName(r.citizen_name)} · {formatDate(r.created_at)}
          </p>
        </div>
        <StatusBadge kind="service" value={r.status} />
      </div>
      {r.admin_note && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-semibold">Catatan admin</p>
          <p>{r.admin_note}</p>
        </div>
      )}

      {!isRejected && (
        <ol className="mt-6 grid gap-3 sm:grid-cols-5">
          {requestStages.map((s, i) => {
            const done = i <= activeIndex;
            const current = i === activeIndex;
            return (
              <li key={s.label} className={`relative rounded-2xl border p-4 text-center ${done ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
                <span className={`mx-auto grid h-10 w-10 place-items-center rounded-xl ${done ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <p className={`mt-2 text-xs font-semibold ${done ? 'text-brand-800' : 'text-slate-500'}`}>{s.label}</p>
                {current && <span className="mt-1 inline-block animate-pulse text-[10px] font-semibold text-brand-700">Sedang berjalan</span>}
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-6 text-xs text-slate-500">
        Untuk privasi, data sensitif seperti NIK, KK, dan dokumen tidak ditampilkan di halaman publik.
      </p>
    </div>
  );
}

function ComplaintResult({ c }: { c: Complaint }) {
  const activeIndex = complaintStages.findIndex((s) => s.status === c.status);
  const isRejected = c.status === 'Ditolak';
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">Pengaduan Warga · {c.tracking_code}</p>
          <h3 className="mt-1 inline-flex items-center gap-2 text-xl font-bold text-slate-900">
            <MessageSquareWarning className="h-5 w-5 text-rose-600" />
            {c.category}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" /> {c.location}
          </p>
          <p className="text-sm text-slate-500">{formatDate(c.created_at)}</p>
        </div>
        <StatusBadge kind="complaint" value={c.status} />
      </div>

      {c.description && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
          <p className="text-xs font-semibold text-slate-500">Deskripsi laporan</p>
          <p className="mt-1">{c.description}</p>
        </div>
      )}

      {c.admin_response && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <p className="font-semibold">Tanggapan admin</p>
          <p>{c.admin_response}</p>
        </div>
      )}

      {!isRejected && (
        <ol className="mt-6 grid gap-3 sm:grid-cols-4">
          {complaintStages.map((s, i) => {
            const done = i <= activeIndex;
            const current = i === activeIndex;
            return (
              <li key={s.label} className={`relative rounded-2xl border p-4 text-center ${done ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
                <span className={`mx-auto grid h-10 w-10 place-items-center rounded-xl ${done ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <p className={`mt-2 text-xs font-semibold ${done ? 'text-brand-800' : 'text-slate-500'}`}>{s.label}</p>
                {current && <span className="mt-1 inline-block animate-pulse text-[10px] font-semibold text-brand-700">Sedang ditangani</span>}
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-6 text-xs text-slate-500">Identitas pelapor disembunyikan untuk privasi.</p>
    </div>
  );
}
