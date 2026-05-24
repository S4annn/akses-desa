import { Bot, Menu, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/pengaduan', label: 'Pengaduan' },
  { to: '/bansos', label: 'Bansos' },
  { to: '/umkm', label: 'UMKM' },
  { to: '/berita', label: 'Berita' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/transparansi', label: 'Transparansi' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition ${scrolled ? 'border-b border-slate-200/70 bg-white/80 backdrop-blur-xl' : 'bg-white/40 backdrop-blur-sm'}`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/chatbot" className="hidden sm:inline-flex btn-ghost text-brand-700">
            <Bot className="h-4 w-4" />
            AI Desa
          </Link>
          <Link to="/login" className="hidden sm:inline-flex btn-primary">
            <ShieldCheck className="h-4 w-4" /> Admin
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page py-3">
            <div className="grid grid-cols-2 gap-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/galeri" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Galeri
              </NavLink>
              <NavLink to="/kontak" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Kontak
              </NavLink>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/chatbot" className="btn-secondary justify-center">
                <Bot className="h-4 w-4" /> AI Desa
              </Link>
              <Link to="/login" className="btn-primary justify-center">
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
