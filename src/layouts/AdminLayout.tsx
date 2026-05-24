import {
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareWarning,
  Search,
  Settings,
  Store,
  Sparkles,
  HandHeart,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../hooks/useAuth';

const menu = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/pengajuan', label: 'Pengajuan Surat', icon: FileText },
  { to: '/admin/pengaduan', label: 'Pengaduan Warga', icon: MessageSquareWarning },
  { to: '/admin/bansos', label: 'Bantuan Sosial', icon: HandHeart },
  { to: '/admin/umkm', label: 'UMKM Desa', icon: Store },
  { to: '/admin/berita', label: 'Berita & Pengumuman', icon: Megaphone },
  { to: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { to: '/admin/transparansi', label: 'Transparansi', icon: FileSpreadsheet },
  { to: '/admin/galeri', label: 'Galeri', icon: ImageIcon },
  { to: '/admin/knowledge', label: 'Knowledge Base AI', icon: BookOpen },
  { to: '/admin/pengaturan', label: 'Pengaturan Desa', icon: Settings },
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Logo />
          <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-slate-100 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-[calc(100vh-4rem)] flex-col">
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {menu.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <m.icon className="h-4.5 w-4.5" />
                <span>{m.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-slate-100 p-3">
            <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              <Home className="h-4 w-4" /> Lihat Situs Publik
            </Link>
            <button
              onClick={handleSignOut}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <button
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Tutup menu"
        />
      )}

      <div className="lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden flex-1 max-w-md sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Cari pengajuan, pengaduan, UMKM..."
                className="input pl-9"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 hover:bg-slate-100">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
              </button>
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200 px-3 py-1.5 sm:flex">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-700 to-emerald-500 text-xs font-semibold text-white">
                  {user?.full_name?.[0] ?? 'A'}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{user?.full_name ?? 'Admin'}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role ?? 'admin'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" />
            <span>Modus admin AksesDesa — kelola layanan desa secara terpusat.</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
