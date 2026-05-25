import { Building2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../services/supabaseClient';
import { clearVillageCache, getActiveVillage } from '../../services/villageService';
import type { Village } from '../../types/app';

export function VillageSettingsPage() {
  const { show } = useToast();
  const [village, setVillage] = useState<Village | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getActiveVillage()
      .then(setVillage)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!village) return;
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const patch = {
        name: String(fd.get('name') ?? ''),
        district: String(fd.get('district') ?? ''),
        regency: String(fd.get('regency') ?? ''),
        province: String(fd.get('province') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        email: String(fd.get('email') ?? ''),
        address: String(fd.get('address') ?? ''),
        history: String(fd.get('history') ?? ''),
        vision: String(fd.get('vision') ?? ''),
        mission: String(fd.get('mission') ?? ''),
        latitude: fd.get('latitude') ? Number(fd.get('latitude')) : null,
        longitude: fd.get('longitude') ? Number(fd.get('longitude')) : null,
      };

      if (supabase) {
        const { error } = await supabase.from('villages').update(patch).eq('id', village.id);
        if (error) throw error;
      }
      clearVillageCache();
      show('Pengaturan disimpan', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal simpan', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !village) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Desa</h1>
        <p className="text-sm text-slate-500">Kelola identitas dan informasi dasar desa.</p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-emerald-500 text-white">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Identitas Desa</p>
            <p className="text-xs text-slate-500">Tampil di seluruh halaman publik.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="name" label="Nama Desa" defaultValue={village.name} />
          <Field name="district" label="Kecamatan" defaultValue={village.district} />
          <Field name="regency" label="Kabupaten" defaultValue={village.regency} />
          <Field name="province" label="Provinsi" defaultValue={village.province} />
          <Field name="phone" label="Telepon" defaultValue={village.phone} />
          <Field name="email" label="Email" defaultValue={village.email} />
          <Field name="address" label="Alamat" wide defaultValue={village.address} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">📍 Koordinat Desa</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Untuk menampilkan peta desa di halaman publik. Cari koordinat di
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
              className="ml-1 font-medium text-brand-700 hover:underline"
            >
              Google Maps
            </a>
            : klik kanan lokasi desa → angka pertama = latitude, kedua = longitude.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Latitude</label>
              <input
                name="latitude"
                type="number"
                step="any"
                className="input"
                placeholder="-7.7956"
                defaultValue={village.latitude ?? ''}
              />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input
                name="longitude"
                type="number"
                step="any"
                className="input"
                placeholder="110.3695"
                defaultValue={village.longitude ?? ''}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="label">Sejarah</label>
          <textarea name="history" className="input" rows={4} defaultValue={village.history} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Visi</label><textarea name="vision" className="input" rows={3} defaultValue={village.vision} /></div>
          <div>
            <label className="label">Misi (1 per baris)</label>
            <textarea name="mission" className="input" rows={5} defaultValue={Array.isArray(village.mission) ? village.mission.join('\n') : (village.mission as unknown as string)} />
          </div>
        </div>
        <div className="flex justify-end">
          <button disabled={saving} className="btn-primary"><Save className="h-4 w-4" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ name, label, defaultValue, wide }: { name: string; label: string; defaultValue?: string; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      <input name={name} className="input" defaultValue={defaultValue} />
    </div>
  );
}
