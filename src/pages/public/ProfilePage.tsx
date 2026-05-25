import { Building2, Compass, Goal, MapPin, Sparkles, Users, Wheat } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { Skeleton } from '../../components/common/Skeleton';
import { SmartImage } from '../../components/common/SmartImage';
import { villageStats } from '../../data/dummyData';
import { useLiveData } from '../../hooks/useLiveData';
import { listOfficials } from '../../services/villageOfficialsService';
import { getActiveVillage } from '../../services/villageService';
import type { Village, VillageOfficial } from '../../types/app';

export function ProfilePage() {
  const { data: village } = useLiveData<Village | null>(
    () => getActiveVillage(),
    ['village_updated'],
    null
  );
  const { data: officials = [] } = useLiveData<VillageOfficial[]>(
    () => listOfficials(),
    ['village_updated'],
    []
  );
  const loading = !village;

  const potencies = [
    { icon: Wheat, label: 'Pertanian organik' },
    { icon: Sparkles, label: 'Kerajinan bambu' },
    { icon: Building2, label: 'Kuliner lokal' },
    { icon: Compass, label: 'Wisata alam' },
    { icon: Goal, label: 'UMKM rumahan' },
  ];

  if (loading || !village) {
    return (
      <div>
        <PageHeader eyebrow="Profil Desa" title="Memuat profil..." />
        <div className="container-page py-12 space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

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
          <p className="mt-1 text-sm text-slate-500">Perangkat desa yang melayani warga.</p>

          {officials.length === 0 ? (
            <div className="mt-6 card p-8 text-center text-sm text-slate-500">Belum ada data perangkat desa.</div>
          ) : (
            <div className="mt-8 space-y-8">
              {/* Kepala Desa — featured di atas, center */}
              {officials.filter((o) => o.position.toLowerCase().includes('kepala')).length > 0 && (
                <div className="flex justify-center">
                  {officials
                    .filter((o) => o.position.toLowerCase().includes('kepala'))
                    .map((o) => (
                      <OfficialFeatured key={o.id} official={o} />
                    ))}
                </div>
              )}

              {/* Garis hierarki connector */}
              {officials.filter((o) => o.position.toLowerCase().includes('sekretaris')).length > 0 && (
                <div className="flex justify-center">
                  <div className="h-8 w-px bg-gradient-to-b from-brand-300 to-brand-100" />
                </div>
              )}

              {/* Sekretaris Desa — center */}
              {officials.filter((o) => o.position.toLowerCase().includes('sekretaris')).length > 0 && (
                <div className="flex justify-center">
                  <div className="grid w-full max-w-sm gap-4">
                    {officials
                      .filter((o) => o.position.toLowerCase().includes('sekretaris'))
                      .map((o) => (
                        <OfficialCard key={o.id} official={o} highlight />
                      ))}
                  </div>
                </div>
              )}

              {/* Garis hierarki connector */}
              {officials.filter(
                (o) =>
                  !o.position.toLowerCase().includes('kepala') &&
                  !o.position.toLowerCase().includes('sekretaris')
              ).length > 0 && (
                <div className="flex justify-center">
                  <div className="h-8 w-px bg-gradient-to-b from-brand-300 to-brand-100" />
                </div>
              )}

              {/* Kaur & Kasi — grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {officials
                  .filter(
                    (o) =>
                      !o.position.toLowerCase().includes('kepala') &&
                      !o.position.toLowerCase().includes('sekretaris')
                  )
                  .map((o) => (
                    <OfficialCard key={o.id} official={o} />
                  ))}
              </div>
            </div>
          )}
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

/**
 * Card featured untuk Kepala Desa — center, larger, with gradient frame.
 */
function OfficialFeatured({ official }: { official: VillageOfficial }) {
  return (
    <div className="card relative overflow-hidden mx-auto max-w-md">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-500" />
      <div className="relative px-6 pt-12 pb-6 text-center">
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-soft">
          {official.photo_url ? (
            <SmartImage src={official.photo_url} alt={official.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-600 to-emerald-500 text-3xl font-bold text-white">
              {official.name.charAt(0)}
            </div>
          )}
        </div>
        <p className="mt-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
          {official.position}
        </p>
        <h3 className="mt-2 text-xl font-bold text-slate-900">{official.name}</h3>
      </div>
    </div>
  );
}

/**
 * Card biasa untuk perangkat desa lainnya.
 */
function OfficialCard({ official, highlight = false }: { official: VillageOfficial; highlight?: boolean }) {
  return (
    <div className={`card flex flex-col items-center p-5 text-center transition hover:-translate-y-1 hover:shadow-soft ${highlight ? 'border-brand-200 bg-brand-50/30' : ''}`}>
      <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white shadow-sm">
        {official.photo_url ? (
          <SmartImage src={official.photo_url} alt={official.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-600 to-emerald-500 text-2xl font-bold text-white">
            {official.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-700">{official.position}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{official.name}</p>
    </div>
  );
}
