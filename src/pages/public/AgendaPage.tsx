import { Calendar, Clock, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { listAgendas } from '../../services/agendaService';
import type { Agenda } from '../../types/app';
import { formatDate } from '../../utils/formatDate';

const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

export function AgendaPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year] = useState(now.getFullYear());
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAgendas()
      .then(setAgendas)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return agendas.filter((a) => {
      const d = new Date(a.start_date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [month, year]);

  const calDays = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const start = first.getDay();
    return {
      days: Array.from({ length: last.getDate() }, (_, i) => i + 1),
      pad: start,
    };
  }, [month, year]);

  const eventDates = new Set(
    agendas.filter((a) => {
      const d = new Date(a.start_date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).map((a) => new Date(a.start_date).getDate())
  );

  return (
    <div>
      <Seo title="Agenda Kegiatan" description="Jadwal kegiatan desa: posyandu, musyawarah, kerja bakti, pelatihan UMKM, dan lainnya." />
      <PageHeader eyebrow="Agenda Desa" title="Agenda Kegiatan" description="Lihat jadwal kegiatan desa setiap bulan." />
      <div className="container-page grid gap-6 py-10 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">{monthNames[month]} {year}</h3>
            <div className="flex gap-1">
              <button onClick={() => setMonth((m) => (m + 11) % 12)} className="btn-ghost px-2">‹</button>
              <button onClick={() => setMonth((m) => (m + 1) % 12)} className="btn-ghost px-2">›</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
            {['M','S','S','R','K','J','S'].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: calDays.pad }).map((_, i) => <span key={`p${i}`} />)}
            {calDays.days.map((d) => {
              const has = eventDates.has(d);
              return (
                <span
                  key={d}
                  className={`relative grid aspect-square place-items-center rounded-lg text-sm ${
                    has ? 'bg-brand-50 font-bold text-brand-700' : 'text-slate-700'
                  }`}
                >
                  {d}
                  {has && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-brand-600" />}
                </span>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900">Daftar Agenda</h3>
          {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat agenda...</div>}
          {!loading && filtered.length === 0 && (
            <EmptyState title="Belum ada agenda" description="Belum ada kegiatan terjadwal di bulan ini." icon={<Calendar className="h-7 w-7" />} />
          )}
          {!loading && filtered.map((a) => (
            <div key={a.id} className="card flex items-start gap-4 p-4">
              <div className="flex w-16 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-emerald-500 p-2 text-center text-white">
                <span className="text-[10px] font-semibold opacity-80">{monthNames[new Date(a.start_date).getMonth()].slice(0,3).toUpperCase()}</span>
                <span className="text-xl font-bold leading-none">{new Date(a.start_date).getDate()}</span>
              </div>
              <div className="flex-1">
                <span className="chip border border-slate-200 bg-slate-50 text-slate-700">{a.category}</span>
                <p className="mt-1 text-base font-semibold text-slate-900">{a.title}</p>
                <p className="mt-1 text-sm text-slate-500">{a.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(a.start_date)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 09.00 WIB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
