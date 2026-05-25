import { Award, BookOpen, ChevronDown, Compass, FileSearch, Goal, Landmark, Map, Menu, ShieldCheck, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { Logo } from '../components/common/Logo';
import { useI18n } from '../i18n/useI18n';

interface NavItem {
  to: string;
  label: string;
  submenu?: { to: string; icon: typeof Compass; label: string; desc: string }[];
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useI18n();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const profileSubmenu = [
    { to: '/profil#sejarah', icon: BookOpen, label: 'Sejarah Desa', desc: 'Perjalanan dan asal-usul desa' },
    { to: '/profil#visi-misi', icon: Goal, label: 'Visi & Misi', desc: 'Cita-cita dan langkah desa' },
    { to: '/profil#struktur', icon: Users, label: 'Struktur Pemerintahan', desc: 'Perangkat desa & jajaran' },
    { to: '/profil#demografi', icon: Landmark, label: 'Demografi & Wilayah', desc: 'Data penduduk dan luas desa' },
    { to: '/profil#potensi', icon: Award, label: 'Potensi Desa', desc: 'Pertanian, UMKM, & wisata' },
    { to: '/profil#peta', icon: Map, label: 'Peta Wilayah', desc: 'Lokasi & batas desa' },
  ];

  const links: NavItem[] = [
    { to: '/', label: t('common.home') },
    { to: '/profil', label: t('common.profile'), submenu: profileSubmenu },
    { to: '/layanan', label: t('common.services') },
    { to: '/pengaduan', label: t('common.complaints') },
    { to: '/bansos', label: t('common.socialAid') },
    { to: '/umkm', label: t('common.msme') },
    { to: '/berita', label: t('common.news') },
    { to: '/agenda', label: t('common.agenda') },
    { to: '/transparansi', label: t('common.transparency') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <header
      className={`sticky top-0 z-40 transition ${scrolled ? 'border-b border-slate-200/70 bg-white/80 backdrop-blur-xl' : 'bg-white/40 backdrop-blur-sm'}`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav ref={dropdownRef} className="hidden items-center gap-1 lg:flex">
          {links.map((l) =>
            l.submenu ? (
              <div key={l.to} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === l.to ? null : l.to)}
                  onMouseEnter={() => setOpenDropdown(l.to)}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    location.pathname.startsWith(l.to)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-expanded={openDropdown === l.to}
                  aria-haspopup="menu"
                >
                  {l.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${openDropdown === l.to ? 'rotate-180' : ''}`}
                  />
                </button>
                {openDropdown === l.to && (
                  <div
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                    role="menu"
                  >
                    <Link
                      to={l.to}
                      className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-emerald-50 px-4 py-3 transition hover:from-brand-100 hover:to-emerald-100"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-emerald-500 text-white">
                        <Compass className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Halaman Profil Desa</p>
                        <p className="text-xs text-slate-600">Lihat semua informasi desa</p>
                      </div>
                    </Link>
                    <div className="grid divide-y divide-slate-50">
                      {l.submenu.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="group flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                            <s.icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                            <p className="truncate text-xs text-slate-500">{s.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <Link to="/cek-status" className="hidden whitespace-nowrap sm:inline-flex btn-ghost text-brand-700">
            <FileSearch className="h-4 w-4" />
            Cek Status
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
            {/* Profil submenu di mobile */}
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Detail Profil</p>
              <div className="grid grid-cols-2 gap-1">
                {profileSubmenu.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-700 hover:bg-white"
                  >
                    <s.icon className="h-3.5 w-3.5 text-brand-600" />
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/cek-status" className="btn-secondary justify-center">
                <FileSearch className="h-4 w-4" /> Cek Status
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
