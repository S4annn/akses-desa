import { CheckCircle2, FileText, HandHeart, Info, Send } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { socialAids } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import type { SocialAid } from '../../types/app';
import { generateTrackingCode } from '../../utils/generateTrackingCode';
import { maskName } from '../../utils/maskSensitiveData';

const samplePublicRecipients = [
  { name: 'Sari Wahyuni', hamlet: 'Melati', status: 'Layak' },
  { name: 'Budi Hartono', hamlet: 'Mawar', status: 'Dalam Verifikasi' },
  { name: 'Nur Aini', hamlet: 'Anggrek', status: 'Layak' },
];

export function SocialAidPage() {
  const [active, setActive] = useState<SocialAid | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const { show } = useToast();

  return (
    <div>
      <PageHeader
        eyebrow="Bantuan Sosial"
        title="Program Bantuan Sosial Desa"
        description="Akses informasi bantuan, persyaratan, dan ajukan usulan dengan mudah."
      />
      <div className="container-page py-10 space-y-10">
        <section>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {socialAids.map((s) => (
              <div key={s.id} className="card flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
                    <HandHeart className="h-5 w-5" />
                  </span>
                  <span className={`chip border ${s.status === 'Aktif' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                    {s.status}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-3">{s.description}</p>
                <p className="mt-3 text-xs text-slate-500">Periode: <span className="font-medium text-slate-700">{s.period}</span></p>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => setActive(s)} className="btn-outline flex-1 justify-center"><Info className="h-4 w-4" /> Detail</button>
                  <button
                    onClick={() => {
                      setActive(s);
                    }}
                    className="btn-primary flex-1 justify-center"
                  >
                    <Send className="h-4 w-4" /> Ajukan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Status Usulan Publik</h2>
          <p className="mt-1 text-sm text-slate-500">Untuk privasi, nama disamarkan dan NIK tidak ditampilkan.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {samplePublicRecipients.map((r, i) => (
              <div key={i} className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-800">{maskName(r.name)}</p>
                <p className="text-xs text-slate-500">Dusun {r.hamlet}</p>
                <span className="chip mt-2 border border-amber-200 bg-amber-50 text-amber-700">{r.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Modal open={!!active} onClose={() => { setActive(null); setSubmitted(null); }} title={active?.name} description="Detail dan formulir pengajuan" size="lg">
        {active && !submitted && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">{active.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Persyaratan</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  {active.requirements.map((r) => (
                    <li key={r} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> {r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Dokumen dibutuhkan</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  {active.required_documents.map((r) => (
                    <li key={r} className="flex gap-2"><FileText className="mt-0.5 h-4 w-4 text-brand-600" /> {r}</li>
                  ))}
                </ul>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const code = generateTrackingCode('BNS');
                setSubmitted(code);
                show('Usulan bantuan dikirim', 'success');
              }}
              className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2"
            >
              <Field label="Nama lengkap"><input className="input" required /></Field>
              <Field label="NIK"><input className="input" maxLength={16} required /></Field>
              <Field label="Nomor KK"><input className="input" maxLength={16} required /></Field>
              <Field label="Nomor WhatsApp"><input className="input" required /></Field>
              <Field label="Alamat" wide><input className="input" required /></Field>
              <Field label="Kondisi keluarga" wide><textarea className="input" rows={2} required /></Field>
              <Field label="Penghasilan perkiraan/bulan"><input className="input" type="number" required /></Field>
              <Field label="Tanggungan keluarga"><input className="input" type="number" required /></Field>
              <div className="sm:col-span-2 flex justify-end gap-2">
                <button type="button" onClick={() => setActive(null)} className="btn-ghost">Batal</button>
                <button type="submit" className="btn-primary">Kirim Usulan</button>
              </div>
            </form>
          </div>
        )}
        {submitted && (
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h3 className="mt-3 text-lg font-bold text-slate-900">Usulan dikirim</h3>
            <p className="mt-1 text-sm text-slate-600">Kode tracking Anda:</p>
            <p className="mt-2 font-mono text-lg font-bold tracking-wider text-brand-800">{submitted}</p>
            <p className="mt-3 text-xs text-slate-500">Status final ditentukan oleh perangkat desa setelah verifikasi lapangan.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
