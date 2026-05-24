import { Building2, Save } from 'lucide-react';
import { village } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';

export function VillageSettingsPage() {
  const { show } = useToast();
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-slate-900">Pengaturan Desa</h1><p className="text-sm text-slate-500">Kelola identitas dan informasi dasar desa.</p></div>
      <form
        onSubmit={(e) => { e.preventDefault(); show('Pengaturan disimpan', 'success'); }}
        className="card space-y-4 p-6"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-emerald-500 text-white"><Building2 className="h-5 w-5" /></span>
          <div><p className="text-sm font-semibold text-slate-900">Identitas Desa</p><p className="text-xs text-slate-500">Tampil di seluruh halaman publik.</p></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nama Desa" defaultValue={village.name} />
          <Field label="Kecamatan" defaultValue={village.district} />
          <Field label="Kabupaten" defaultValue={village.regency} />
          <Field label="Provinsi" defaultValue={village.province} />
          <Field label="Telepon" defaultValue={village.phone} />
          <Field label="Email" defaultValue={village.email} />
          <Field label="Alamat" wide defaultValue={village.address} />
        </div>
        <div>
          <label className="label">Sejarah</label>
          <textarea className="input" rows={4} defaultValue={village.history} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Visi</label><textarea className="input" rows={3} defaultValue={village.vision} /></div>
          <div><label className="label">Misi</label><textarea className="input" rows={5} defaultValue={village.mission.join('\n')} /></div>
        </div>
        <div className="flex justify-end"><button className="btn-primary"><Save className="h-4 w-4" /> Simpan Perubahan</button></div>
      </form>
    </div>
  );
}

function Field({ label, defaultValue, wide }: { label: string; defaultValue?: string; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      <input className="input" defaultValue={defaultValue} />
    </div>
  );
}
