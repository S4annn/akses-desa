import { Edit, HandHeart, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { socialAids } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import type { SocialAid } from '../../types/app';

export function SocialAidAdminPage() {
  const [items, setItems] = useState<SocialAid[]>(socialAids);
  const [edit, setEdit] = useState<SocialAid | null>(null);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bantuan Sosial</h1>
          <p className="text-sm text-slate-500">Kelola program bantuan dan usulan warga.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Program Baru</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <HandHeart className="h-5 w-5" />
              </span>
              <span className={`chip border ${s.status === 'Aktif' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>{s.status}</span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-slate-900">{s.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{s.description}</p>
            <p className="mt-2 text-xs text-slate-500">Periode: {s.period}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEdit(s)} className="btn-outline flex-1 justify-center"><Edit className="h-4 w-4" /> Edit</button>
              <button
                onClick={() => { setItems((arr) => arr.filter((x) => x.id !== s.id)); show('Program dihapus', 'success'); }}
                className="btn-ghost text-rose-600"
              ><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="text-base font-semibold text-slate-900">Catatan Penting</h3>
        <p className="mt-2 text-sm text-slate-600">
          AI dapat membantu menjelaskan persyaratan, namun keputusan final kelayakan bansos tetap oleh perangkat desa setelah verifikasi lapangan.
        </p>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit Program Bantuan">
        {edit && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              show('Perubahan disimpan', 'success');
              setEdit(null);
            }}
            className="space-y-3"
          >
            <Field label="Nama"><input className="input" defaultValue={edit.name} /></Field>
            <Field label="Deskripsi"><textarea className="input" rows={3} defaultValue={edit.description} /></Field>
            <Field label="Periode"><input className="input" defaultValue={edit.period} /></Field>
            <Field label="Status">
              <select className="input" defaultValue={edit.status}><option>Aktif</option><option>Tutup</option></select>
            </Field>
            <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setEdit(null)}>Batal</button><button className="btn-primary">Simpan</button></div>
          </form>
        )}
      </Modal>

      <Modal open={creating} onClose={() => setCreating(false)} title="Program Bantuan Baru">
        <form onSubmit={(e) => { e.preventDefault(); show('Program ditambahkan', 'success'); setCreating(false); }} className="space-y-3">
          <Field label="Nama"><input className="input" required /></Field>
          <Field label="Deskripsi"><textarea className="input" rows={3} required /></Field>
          <Field label="Periode"><input className="input" required /></Field>
          <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setCreating(false)}>Batal</button><button className="btn-primary">Tambah</button></div>
        </form>
      </Modal>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}</div>;
}
