import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Copy, FileText, Home, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { PageHeader } from '../../components/common/PageHeader';
import { serviceTypes } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import { generateTrackingCode } from '../../utils/generateTrackingCode';

const schema = z.object({
  service_type_id: z.string().min(1, 'Jenis layanan wajib dipilih'),
  citizen_name: z.string().min(2, 'Nama wajib diisi'),
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit'),
  kk_number: z.string().regex(/^\d{16}$/, 'Nomor KK harus 16 digit'),
  birth_place: z.string().min(2, 'Tempat lahir wajib'),
  birth_date: z.string().min(1, 'Tanggal lahir wajib'),
  gender: z.enum(['Laki-laki', 'Perempuan']),
  address: z.string().min(5, 'Alamat wajib'),
  hamlet: z.string().min(1, 'Dusun wajib'),
  rt: z.string().min(1, 'RT wajib'),
  rw: z.string().min(1, 'RW wajib'),
  phone: z.string().min(8, 'Nomor WhatsApp wajib'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  purpose: z.string().min(3, 'Keperluan wajib diisi'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ServiceRequestPage() {
  const [params] = useSearchParams();
  const presetService = params.get('service') ?? '';
  const { show } = useToast();
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { service_type_id: presetService, gender: 'Laki-laki' },
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 600));
    const code = generateTrackingCode('ADS');
    setTrackingCode(code);
    show('Pengajuan berhasil dikirim', 'success');
    reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (trackingCode) {
    return (
      <div>
        <PageHeader eyebrow="Berhasil" title="Pengajuan diterima" description="Simpan kode tracking untuk memantau status." />
        <div className="container-page py-10">
          <div className="card mx-auto max-w-xl p-8 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Pengajuan berhasil dikirim</h2>
            <p className="mt-1 text-slate-600">Simpan kode tracking kamu untuk mengecek status pengajuan.</p>
            <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 px-4 py-3">
              <span className="font-mono text-lg font-bold tracking-wider text-brand-800">{trackingCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(trackingCode);
                  show('Kode disalin', 'success');
                }}
                className="btn-ghost"
              >
                <Copy className="h-4 w-4" /> Salin
              </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to={`/cek-status?code=${trackingCode}`} className="btn-primary">Cek Status</Link>
              <Link to="/" className="btn-outline"><Home className="h-4 w-4" /> Kembali ke Beranda</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Ajukan Surat" title="Form Pengajuan Surat" description="Isi formulir di bawah, layanan akan diproses oleh perangkat desa." />
      <div className="container-page py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-base font-semibold text-slate-900">Layanan & Keperluan</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Jenis layanan" error={errors.service_type_id?.message}>
                  <select className="input" {...register('service_type_id')}>
                    <option value="">Pilih layanan</option>
                    {serviceTypes.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Keperluan surat" error={errors.purpose?.message}>
                  <input className="input" placeholder="Misal: Pendaftaran sekolah" {...register('purpose')} />
                </Field>
                <Field label="Catatan tambahan (opsional)" wide>
                  <textarea className="input" rows={3} {...register('notes')} />
                </Field>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-base font-semibold text-slate-900">Data Pemohon</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Nama lengkap" error={errors.citizen_name?.message}>
                  <input className="input" {...register('citizen_name')} />
                </Field>
                <Field label="NIK (16 digit)" error={errors.nik?.message}>
                  <input className="input" maxLength={16} inputMode="numeric" {...register('nik')} />
                </Field>
                <Field label="Nomor KK (16 digit)" error={errors.kk_number?.message}>
                  <input className="input" maxLength={16} inputMode="numeric" {...register('kk_number')} />
                </Field>
                <Field label="Tempat lahir" error={errors.birth_place?.message}>
                  <input className="input" {...register('birth_place')} />
                </Field>
                <Field label="Tanggal lahir" error={errors.birth_date?.message}>
                  <input type="date" className="input" {...register('birth_date')} />
                </Field>
                <Field label="Jenis kelamin">
                  <select className="input" {...register('gender')}>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </Field>
                <Field label="Alamat lengkap" wide error={errors.address?.message}>
                  <input className="input" {...register('address')} />
                </Field>
                <Field label="Dusun" error={errors.hamlet?.message}>
                  <input className="input" {...register('hamlet')} />
                </Field>
                <Field label="RT" error={errors.rt?.message}>
                  <input className="input" {...register('rt')} />
                </Field>
                <Field label="RW" error={errors.rw?.message}>
                  <input className="input" {...register('rw')} />
                </Field>
                <Field label="Nomor WhatsApp" error={errors.phone?.message}>
                  <input className="input" {...register('phone')} />
                </Field>
                <Field label="Email (opsional)" error={errors.email?.message}>
                  <input className="input" {...register('email')} />
                </Field>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-base font-semibold text-slate-900">Dokumen Pendukung</h3>
              <p className="mt-1 text-sm text-slate-500">Format jpg, png, atau pdf, maks 5MB per file.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['Upload KTP', 'Upload KK', 'Dokumen pendukung (opsional)'].map((label) => (
                  <label key={label} className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-sm text-slate-500 hover:border-brand-400 hover:bg-brand-50/50">
                    <Upload className="h-5 w-5 text-brand-600" />
                    <span className="font-medium">{label}</span>
                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1">
            <div className="card sticky top-20 p-6">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <FileText className="h-4 w-4 text-brand-600" /> Ringkasan Pengajuan
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex justify-between"><span>Biaya</span><span className="font-semibold text-emerald-700">Gratis</span></li>
                <li className="flex justify-between"><span>Estimasi</span><span className="font-medium">1-3 hari kerja</span></li>
                <li className="flex justify-between"><span>Verifikasi</span><span className="font-medium">Perangkat Desa</span></li>
              </ul>
              <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full justify-center">
                {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
              </button>
              <p className="mt-3 text-[11px] text-slate-500">
                Dengan mengirim, Anda menyetujui penggunaan data Anda untuk pemrosesan layanan administrasi desa.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, wide, children }: { label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
