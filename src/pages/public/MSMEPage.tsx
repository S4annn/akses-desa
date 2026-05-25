import { CheckCircle2, MapPin, Phone, Plus, Search, Store } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { SmartImage } from '../../components/common/SmartImage';
import { useToast } from '../../hooks/useToast';
import { listPublicMSMEs, registerMSME } from '../../services/msmeService';
import type { MSME } from '../../types/app';

const categories = ['Semua', 'Makanan & Minuman', 'Kerajinan', 'Pertanian', 'Jasa', 'Toko Kelontong', 'Fashion', 'Wisata', 'Lainnya'];

export function MSMEPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Semua');
  const [active, setActive] = useState<MSME | null>(null);
  const [register, setRegister] = useState(false);
  const [msmes, setMsmes] = useState<MSME[]>([]);
  const { show } = useToast();

  useEffect(() => {
    listPublicMSMEs().then(setMsmes).catch(() => setMsmes([]));
  }, []);

  const filtered = useMemo(() => {
    return msmes.filter((m) => {
      if (cat !== 'Semua' && m.category !== cat) return false;
      if (search && !`${m.business_name} ${m.description}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, cat]);

  return (
    <div>
      <Seo title="UMKM Desa" description="Katalog UMKM lokal desa: makanan, kerajinan, pertanian, jasa, dan lainnya. Dukung produk warga." />
      <PageHeader
        eyebrow="UMKM Desa"
        title="Katalog UMKM Lokal"
        description="Dukung produk dan jasa terbaik dari warga desa."
        action={
          <button onClick={() => setRegister(true)} className="btn bg-white text-brand-800 hover:bg-cream">
            <Plus className="h-4 w-4" /> Daftarkan UMKM
          </button>
        }
      />
      <div className="container-page py-10">
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Cari UMKM..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`chip whitespace-nowrap border ${cat === c ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <button key={m.id} onClick={() => setActive(m)} className="card group overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative h-44 overflow-hidden bg-slate-100">
                {m.image_url ? (
                  <SmartImage src={m.image_url} alt={m.business_name} className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <Store className="m-auto h-10 w-10 text-slate-300" />
                )}
                {m.is_verified && (
                  <span className="chip absolute left-2 top-2 border border-white/50 bg-white/85 text-emerald-700 backdrop-blur">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-700">{m.category}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{m.business_name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{m.description}</p>
                <p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" /> {m.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.business_name} description={active?.category} size="lg">
        {active && (
          <div className="space-y-4">
            {active.image_url && (
              <SmartImage src={active.image_url} alt={active.business_name} className="h-56 w-full rounded-xl object-cover" />
            )}
            <p className="text-sm text-slate-600">{active.description}</p>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Pemilik</p>
                <p className="font-semibold text-slate-800">{active.owner_name}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Jam Operasional</p>
                <p className="font-semibold text-slate-800">{active.opening_hours ?? '-'}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3 sm:col-span-2">
                <p className="text-xs text-slate-500">Alamat</p>
                <p className="font-semibold text-slate-800">{active.address}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`https://wa.me/${active.phone.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="btn-primary">
                <Phone className="h-4 w-4" /> Hubungi WhatsApp
              </a>
              <button className="btn-outline"><MapPin className="h-4 w-4" /> Lihat Lokasi</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={register} onClose={() => setRegister(false)} title="Daftarkan UMKM" description="UMKM akan diverifikasi oleh admin desa.">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try {
              await registerMSME({
                business_name: String(fd.get('business_name') ?? ''),
                owner_name: String(fd.get('owner_name') ?? ''),
                category: String(fd.get('category') ?? 'Lainnya'),
                description: String(fd.get('description') ?? ''),
                phone: String(fd.get('phone') ?? ''),
                address: String(fd.get('address') ?? ''),
              });
              setRegister(false);
              show('Pendaftaran UMKM dikirim, menunggu verifikasi admin.', 'success');
            } catch (err) {
              show((err as Error).message || 'Gagal mendaftarkan UMKM', 'error');
            }
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <div className="sm:col-span-2"><label className="label">Nama usaha</label><input name="business_name" className="input" required /></div>
          <div><label className="label">Nama pemilik</label><input name="owner_name" className="input" required /></div>
          <div>
            <label className="label">Kategori</label>
            <select name="category" className="input" required>{categories.filter((c) => c !== 'Semua').map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div className="sm:col-span-2"><label className="label">Deskripsi</label><textarea name="description" className="input" rows={3} required /></div>
          <div className="sm:col-span-2"><label className="label">Alamat</label><input name="address" className="input" required /></div>
          <div><label className="label">Nomor WhatsApp</label><input name="phone" className="input" required /></div>
          <div><label className="label">Foto produk</label><input className="input" type="file" accept="image/*" /></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setRegister(false)} className="btn-ghost">Batal</button>
            <button type="submit" className="btn-primary">Kirim</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
