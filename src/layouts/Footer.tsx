import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { getActiveVillage } from '../services/villageService';
import type { Village } from '../types/app';

export function Footer() {
  const [village, setVillage] = useState<Village | null>(null);

  useEffect(() => {
    getActiveVillage().then(setVillage);
  }, []);

  return (
    <footer className="relative mt-16 bg-slate-900 text-slate-300">
      <div className="absolute inset-x-0 -top-12 mx-auto h-24 max-w-6xl rounded-3xl bg-gradient-to-r from-brand-700 to-emerald-500 opacity-90 blur-3xl" />
      <div className="container-page relative grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo white />
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            Portal digital desa yang lebih mudah, transparan, dan responsif.
          </p>
          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/10"
                aria-label="Sosial Media"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Layanan</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/layanan" className="hover:text-white">Daftar Layanan</Link></li>
            <li><Link to="/ajukan" className="hover:text-white">Ajukan Surat</Link></li>
            <li><Link to="/cek-status" className="hover:text-white">Cek Status Pengajuan/Pengaduan</Link></li>
            <li><Link to="/bansos" className="hover:text-white">Bantuan Sosial</Link></li>
            <li><Link to="/pengaduan" className="hover:text-white">Pengaduan Warga</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Informasi</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/profil" className="hover:text-white">Profil Desa</Link></li>
            <li><Link to="/berita" className="hover:text-white">Berita</Link></li>
            <li><Link to="/agenda" className="hover:text-white">Agenda</Link></li>
            <li><Link to="/transparansi" className="hover:text-white">Transparansi</Link></li>
            <li><Link to="/galeri" className="hover:text-white">Galeri</Link></li>
            <li><Link to="/umkm" className="hover:text-white">UMKM</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Kontak</h4>
          <ul className="mt-3 space-y-3 text-sm">
            {village?.address && <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 text-brand-400" /><span>{village.address}</span></li>}
            {village?.phone && <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 text-brand-400" /><span>{village.phone}</span></li>}
            {village?.email && <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 text-brand-400" /><span>{village.email}</span></li>}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Jam Layanan: Senin-Jumat 08.00-15.00<br />Sabtu & Minggu tutup
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {village?.name ?? 'AksesDesa'}. Semua hak dilindungi.</p>
          <p>Dibangun dengan semangat civic-tech untuk desa Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
