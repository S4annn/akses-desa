import { CheckCircle2, Image as ImageIcon, MapPin, MessageSquareWarning, ShieldOff, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { sampleComplaints } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import { classifyComplaint, type ComplaintClassification } from '../../services/geminiService';
import type { Urgency } from '../../types/app';
import { formatDate } from '../../utils/formatDate';
import { generateTrackingCode } from '../../utils/generateTrackingCode';

const categories = [
  'Jalan rusak',
  'Lampu jalan mati',
  'Sampah liar',
  'Drainase tersumbat',
  'Banjir/genangan',
  'Fasilitas umum rusak',
  'Keamanan lingkungan',
  'Pelayanan desa',
  'Lainnya',
];

interface FormData {
  name: string;
  phone: string;
  is_anonymous: boolean;
  category: string;
  location: string;
  description: string;
  urgency: Urgency;
}

export function ComplaintPage() {
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: { is_anonymous: false, category: 'Jalan rusak', urgency: 'sedang' },
  });
  const isAnon = watch('is_anonymous');
  const { show } = useToast();
  const [result, setResult] = useState<{ code: string; ai: ComplaintClassification } | null>(null);

  async function onSubmit(data: FormData) {
    const ai = await classifyComplaint(data.description, data.category, data.location);
    const code = generateTrackingCode('ADU');
    setResult({ code, ai });
    show('Pengaduan terkirim, terima kasih!', 'success');
    reset({ is_anonymous: false, category: 'Jalan rusak', urgency: 'sedang' });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Pengaduan Warga"
        title="Sampaikan masalah, bantu desa lebih responsif"
        description="Setiap laporan tercatat dan ditindaklanjuti secara transparan."
      />

      <div className="container-page grid gap-6 py-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6 lg:col-span-2">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <MessageSquareWarning className="h-5 w-5 text-rose-600" /> Form Pengaduan
          </h3>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3">
            <input type="checkbox" {...register('is_anonymous')} className="h-4 w-4 rounded text-brand-600" />
            <ShieldOff className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-700">Kirim sebagai anonim</span>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Nama (opsional)</label>
              <input className="input" disabled={isAnon} {...register('name')} />
            </div>
            <div>
              <label className="label">Nomor WhatsApp (opsional)</label>
              <input className="input" disabled={isAnon} {...register('phone')} />
            </div>
            <div>
              <label className="label">Kategori pengaduan</label>
              <select className="input" {...register('category')}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tingkat urgensi</label>
              <select className="input" {...register('urgency')}>
                <option value="rendah">Rendah</option>
                <option value="sedang">Sedang</option>
                <option value="tinggi">Tinggi</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Lokasi kejadian</label>
              <input className="input" placeholder="Misal: RT 03 Dusun Melati, dekat balai desa" required {...register('location')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Deskripsi pengaduan</label>
              <textarea className="input" rows={5} required placeholder="Jelaskan kondisi, waktu kejadian, dan dampak yang dirasakan..." {...register('description')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Foto pendukung (opsional)</label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 p-4 text-sm text-slate-500 hover:border-brand-400 hover:bg-brand-50/50">
                <ImageIcon className="h-5 w-5 text-brand-600" />
                <span>Klik untuk unggah foto (jpg/png, maks 5MB)</span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
            {isSubmitting ? 'Mengirim & menganalisis...' : 'Kirim Pengaduan'}
          </button>
          <p className="text-[11px] text-slate-500">
            Untuk privasi, identitas dan nomor HP tidak ditampilkan di daftar pengaduan publik.
          </p>
        </form>

        <div className="space-y-4 lg:col-span-1">
          {result && (
            <div className="card border-2 border-emerald-200 bg-emerald-50/40 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h4 className="mt-2 text-base font-semibold text-emerald-900">Pengaduan berhasil dikirim</h4>
              <p className="mt-1 text-sm text-emerald-800">Kode: <span className="font-mono font-bold">{result.code}</span></p>
              <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3">
                <p className="flex items-center gap-1 text-xs font-semibold text-brand-700">
                  <Sparkles className="h-3.5 w-3.5" /> Analisis AI
                </p>
                <p className="mt-1 text-sm text-slate-700"><b>Kategori:</b> {result.ai.category}</p>
                <p className="text-sm text-slate-700"><b>Urgensi:</b> <StatusBadge kind="urgency" value={result.ai.urgency} /></p>
                <p className="mt-1 text-sm text-slate-700"><b>Ringkasan:</b> {result.ai.summary}</p>
                <p className="text-sm text-slate-700"><b>Rekomendasi:</b> {result.ai.recommended_action}</p>
              </div>
            </div>
          )}

          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-900">Pengaduan terbaru (publik)</h3>
            <p className="text-xs text-slate-500">Identitas pelapor disembunyikan untuk privasi.</p>
            <ul className="mt-4 space-y-3">
              {sampleComplaints.map((c) => (
                <li key={c.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{c.category}</p>
                    <StatusBadge kind="complaint" value={c.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" /> {c.location}
                  </p>
                  <p className="text-[11px] text-slate-400">{formatDate(c.created_at)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
