import { CheckCircle2, ClipboardCheck, Clock, FileSearch, Loader2, Package, Stamp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { StatusBadge } from '../../components/common/StatusBadge';
import { findRequestByTrackingCode } from '../../services/serviceRequestsService';
import type { ServiceRequest, ServiceStatus } from '../../types/app';
import { formatDate } from '../../utils/formatDate';
import { maskName } from '../../utils/maskSensitiveData';

const stages: { label: string; status: ServiceStatus; icon: typeof Clock }[] = [
  { label: 'Pengajuan diterima', status: 'Diajukan', icon: ClipboardCheck },
  { label: 'Diverifikasi', status: 'Diverifikasi', icon: FileSearch },
  { label: 'Diproses', status: 'Diproses', icon: Stamp },
  { label: 'Siap diambil', status: 'Siap Diambil', icon: Package },
  { label: 'Selesai', status: 'Selesai', icon: CheckCircle2 },
];

export function TrackingPage() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get('code') ?? '');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServiceRequest | null>(null);

  async function search(target: string) {
    if (!target.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const r = await findRequestByTrackingCode(target);
      setResult(r);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // Auto search jika ada query string
  useEffect(() => {
    const initial = params.get('code');
    if (initial) search(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeIndex = result ? stages.findIndex((s) => s.status === result.status) : -1;

  return (
    <div>
      <Seo title="Cek Status Pengajuan" description="Lacak status pengajuan layanan Anda dengan kode tracking." />
      <PageHeader
        eyebrow="Cek Status"
        title="Lacak status pengajuan Anda"
        description="Masukkan kode tracking yang Anda terima saat mengajukan layanan."
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
            placeholder="Contoh: ADS-2026-8F3K2"
            className="input border-0 focus:ring-0"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lacak'}
          </button>
        </form>

        <div className="mx-auto mt-6 max-w-3xl">
          {searched && !loading && !result && (
            <div className="card p-6 text-center text-slate-600">
              Kode tracking tidak ditemukan. Pastikan format dan kode sesuai dengan yang diberikan saat pengajuan.
            </div>
          )}
          {result && (
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">{result.tracking_code}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">{result.service_name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Pemohon: {maskName(result.citizen_name)} · {formatDate(result.created_at)}
                  </p>
                </div>
                <StatusBadge kind="service" value={result.status} />
              </div>
              {result.admin_note && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="font-semibold">Catatan admin</p>
                  <p>{result.admin_note}</p>
                </div>
              )}

              <ol className="mt-6 grid gap-3 sm:grid-cols-5">
                {stages.map((s, i) => {
                  const done = i <= activeIndex;
                  const current = i === activeIndex;
                  return (
                    <li
                      key={s.label}
                      className={`relative rounded-2xl border p-4 text-center ${
                        done ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span
                        className={`mx-auto grid h-10 w-10 place-items-center rounded-xl ${
                          done ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <s.icon className="h-5 w-5" />
                      </span>
                      <p className={`mt-2 text-xs font-semibold ${done ? 'text-brand-800' : 'text-slate-500'}`}>{s.label}</p>
                      {current && <span className="mt-1 inline-block animate-pulse text-[10px] font-semibold text-brand-700">Sedang berjalan</span>}
                    </li>
                  );
                })}
              </ol>

              <p className="mt-6 text-xs text-slate-500">
                Untuk privasi, data sensitif seperti NIK, KK, dan dokumen tidak ditampilkan di halaman publik.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
