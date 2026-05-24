import { CheckCircle2, Clock, FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { serviceTypes } from '../../data/dummyData';
import type { ServiceType } from '../../types/app';

const categories = ['Semua', 'Kependudukan', 'Usaha', 'Sosial', 'Perizinan'];

export function ServicesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [active, setActive] = useState<ServiceType | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return serviceTypes.filter((s) => {
      if (!s.is_active) return false;
      if (category !== 'Semua' && s.category !== category) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category]);

  return (
    <div>
      <Seo title="Layanan Desa" description="Daftar layanan administrasi desa: surat keterangan domisili, usaha, SKCK, dan lainnya. Ajukan online tanpa antri." />
      <PageHeader
        eyebrow="Layanan Desa"
        title="Daftar Layanan Administrasi"
        description="Pilih layanan dan ajukan online tanpa harus bolak-balik ke kantor desa."
      />
      <div className="container-page py-10">
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Cari layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`chip border transition ${
                  category === c
                    ? 'border-brand-500 bg-brand-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div key={s.id} className="card flex h-full flex-col p-5 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-500 text-white">
                  <FileText className="h-5 w-5" />
                </span>
                <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Aktif
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{s.description}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" /> {s.processing_time}
                <span>·</span>
                <span className="font-semibold text-emerald-700">{s.fee}</span>
              </div>
              <div className="mt-5 flex gap-2">
                <button onClick={() => setActive(s)} className="btn-outline flex-1 justify-center">
                  Detail
                </button>
                <button
                  onClick={() => navigate(`/ajukan?service=${s.id}`)}
                  className="btn-primary flex-1 justify-center"
                >
                  Ajukan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.name} description={active?.category} size="lg">
        {active && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">{active.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-brand-50 p-3">
                <p className="text-xs text-brand-700">Estimasi proses</p>
                <p className="font-semibold text-slate-900">{active.processing_time}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700">Biaya</p>
                <p className="font-semibold text-slate-900">{active.fee}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-xs text-amber-700">Kategori</p>
                <p className="font-semibold text-slate-900">{active.category}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Syarat dokumen</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                {active.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button onClick={() => setActive(null)} className="btn-ghost">Tutup</button>
              <Link to={`/ajukan?service=${active.id}`} className="btn-primary">
                Ajukan layanan
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
