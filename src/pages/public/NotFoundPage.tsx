import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Home, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-cream via-white to-brand-50 px-6">
      <div className="absolute inset-0 bg-topo-pattern opacity-50" />
      <div className="blob h-80 w-80 -top-20 -left-20 bg-brand-200/60" />
      <div className="blob h-96 w-96 -bottom-32 -right-20 bg-emerald-200/50" />

      <div className="relative w-full max-w-xl text-center">
        <Logo />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mt-10 grid h-32 w-32 place-items-center"
        >
          <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-700 to-emerald-500 shadow-soft" />
          <span className="relative text-5xl font-extrabold text-white tracking-tight">404</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        >
          Halaman tidak ditemukan
        </motion.h1>
        <p className="mt-3 text-slate-600">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia. Mari kembali ke beranda dan jelajahi layanan AksesDesa.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-outline">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" /> Ke Beranda
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Link to="/layanan" className="card group flex items-center gap-3 p-4 text-left transition hover:-translate-y-1 hover:shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <Search className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Cari Layanan</p>
              <p className="text-xs text-slate-500">Daftar surat administrasi</p>
            </div>
          </Link>
          <Link to="/cek-status" className="card group flex items-center gap-3 p-4 text-left transition hover:-translate-y-1 hover:shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Compass className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Cek Status</p>
              <p className="text-xs text-slate-500">Lacak pengajuan & pengaduan</p>
            </div>
          </Link>
          <Link to="/berita" className="card group flex items-center gap-3 p-4 text-left transition hover:-translate-y-1 hover:shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <Home className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Berita Desa</p>
              <p className="text-xs text-slate-500">Kabar terbaru</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
