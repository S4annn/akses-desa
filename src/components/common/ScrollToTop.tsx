import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Auto scroll ke atas saat route berubah.
 * Atau ke anchor (#section) kalau ada hash di URL.
 * Pasang sekali di App.tsx.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Tunggu sebentar agar element ter-render dulu
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash]);
  return null;
}
