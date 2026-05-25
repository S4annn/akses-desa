import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Copy, FileText, Home, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { ImageUploader } from '../../components/common/ImageUploader';
import { PageHeader } from '../../components/common/PageHeader';
import { useFormAutosave } from '../../hooks/useFormAutosave';
import { useToast } from '../../hooks/useToast';
import {
  createServiceRequest,
  listServiceTypes,
} from '../../services/serviceRequestsService';
import type { ServiceType } from '../../types/app';

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
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  useEffect(() => {
    listServiceTypes()
      .then(setServiceTypes)
      .catch(() => setServiceTypes([]));
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { service_type_id: presetService, gender: 'Laki-laki' },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const autosave = useFormAutosave('service-request', form);

  // Document uploads
  const [ktpUrl, setKtpUrl] = useState<string>('');
  const [kkUrl, setKkUrl] = useState<string>('');
  const [extraUrl, setExtraUrl] = useState<string>('');

  async function onSubmit(data: FormData) {
    try {
      const { tracking_code } = await createServiceRequest(data);
      setTrackingCode(tracking_code);
      autosave.clear();
      show('Pengajuan berhasil dikirim', 'success');
      reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      show((err as Error).message || 'Gagal mengirim pengajuan, silakan coba lagi.', 'error');
    }
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
        {autosave.hasSaved() && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
            <Save className="h-4 w-4" />
            <span className="flex-1">Draft Anda otomatis tersimpan di browser ini. Lanjutkan kapan saja.</span>
            <button type="button" onClick={() => { autosave.clear(); reset(); }} className="text-xs font-semibold underline hover:text-amber-900">
              Hapus draft
            </button>
          </div>
        )}
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
              <p className="mt-1 text-sm text-slate-500">Format JPG/PNG/WEBP, maks 5MB per file. Upload foto KTP & KK Anda.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Upload KTP</label>
                  <ImageUploader value={ktpUrl} onChange={setKtpUrl} folder="docs/ktp" aspectRatio="4/3" label="Klik unggah KTP" hint="JPG/PNG, maks 5MB" />
                </div>
                <div>
                  <label className="label">Upload KK</label>
                  <ImageUploader value={kkUrl} onChange={setKkUrl} folder="docs/kk" aspectRatio="4/3" label="Klik unggah KK" hint="JPG/PNG, maks 5MB" />
                </div>
                <div>
                  <label className="label">Dokumen tambahan (opsional)</label>
                  <ImageUploader value={extraUrl} onChange={setExtraUrl} folder="docs/extra" aspectRatio="4/3" label="Klik unggah dokumen" hint="JPG/PNG, maks 5MB" />
                </div>
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
