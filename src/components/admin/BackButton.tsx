import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Tombol "Kembali" untuk halaman admin (kecuali Dashboard).
 * - Auto-hide di /admin (dashboard) sebagai root
 * - navigate(-1) kalau ada history, fallback ke /admin
 */
export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide di dashboard root
  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    return null;
  }

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin');
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700"
      aria-label="Kembali"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Kembali</span>
    </button>
  );
}
