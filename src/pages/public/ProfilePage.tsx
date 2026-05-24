import { Building2, Compass, Goal, MapPin, Sparkles, Users, Wheat } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { officials, village, villageStats } from '../../data/dummyData';

export function ProfilePage() {
  const potencies = [
    { icon: Wheat, label: 'Pertanian organik' },
    { icon: Sparkles, label: 'Kerajinan bambu' },
    { icon: Building2, label: 'Kuliner lokal' },
    { icon: Compass, label: 'Wisata alam' },
    { icon: Goal, label: 'UMKM rumahan' },
  ];

  return (
    <div>
      <Seo title="Profil Desa" description={`Profil ${village.name}, ${village.district}, ${village.regency}. Sejarah, visi misi, perangkat desa, dan potensi.`} />
      <PageHeader
        eyebrow="Profil Desa"
        title={village.name}
        description={`${village.district}, ${village.regency}, ${village.province}`}
        action={
          <div className="grid grid-cols-3 gap-3 text-center text-white sm:grid-cols-3">
            {[
              { v: villageStats.population.toLocaleString('id-ID'), l: 'Penduduk' },
              { v: villageStats.hamlets, l: 'Dusun' },
              { v: villageStats.msmes, l: 'UMKM' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-bold">{s.v}</p>
                <p className="text-xs opacity-80">{s.l}</p>
              </div>
            ))}
          </div>
        }
      />

      <div className="container-page space-y-12 py-12">
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900">Sejarah Desa</h2>
            <p className="mt-3 text-slate-600">{village.history}</p>
          </div>
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-brand-700 to-emerald-500 p-6 text-white">
              <Compass className="h-6 w-6" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider opacity-80">Visi</p>
              <p className="mt-1 font-semibold">{village.vision}</p>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Misi</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {village.mission.map((m) => (
                  <li key={m} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">Struktur Pemerintahan Desa</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {officials.map((o) => (
              <div key={o.id} className="card flex items-center gap-4 p-5">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-500 text-white text-lg font-bold">
                  {o.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm text-slate-500">{o.position}</p>
                  <p className="text-base font-semibold text-slate-900">{o.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">Data Demografi</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { l: 'Penduduk', v: villageStats.population, i: Users },
                { l: 'Kepala Keluarga', v: villageStats.families, i: Users },
                { l: 'RT', v: villageStats.rt, i: MapPin },
                { l: 'RW', v: villageStats.rw, i: MapPin },
                { l: 'Dusun', v: villageStats.hamlets, i: MapPin },
                { l: 'UMKM', v: villageStats.msmes, i: Building2 },
              ].map((d) => (
                <div key={d.l} className="rounded-xl border border-slate-100 p-3">
                  <d.i className="h-4 w-4 text-brand-600" />
                  <p className="mt-2 text-xl font-bold text-slate-900">{d.v.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-slate-500">{d.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">Potensi Desa</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {potencies.map((p) => (
                <div key={p.label} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-700">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
