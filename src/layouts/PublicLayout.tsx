import { FileSearch, FileText, MessageSquareWarning } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="flex min-h-screen flex-col bg-mist">
      <Navbar />
      <main className={isHome ? '' : 'pb-12'}>
        <Outlet />
      </main>
      <Footer />
      {/* Mobile floating quick actions */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-30 -translate-x-1/2 sm:hidden">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-card backdrop-blur">
          <Link to="/ajukan" className="rounded-full px-3 py-2 text-xs font-semibold text-brand-700">
            <FileText className="mr-1 inline h-4 w-4" /> Ajukan
          </Link>
          <Link to="/pengaduan" className="rounded-full px-3 py-2 text-xs font-semibold text-rose-600">
            <MessageSquareWarning className="mr-1 inline h-4 w-4" /> Lapor
          </Link>
          <Link to="/cek-status" className="rounded-full bg-brand-700 px-3 py-2 text-xs font-semibold text-white">
            <FileSearch className="mr-1 inline h-4 w-4" /> Cek Status
          </Link>
        </div>
      </div>
    </div>
  );
}
