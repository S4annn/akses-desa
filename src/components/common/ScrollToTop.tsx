import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Auto scroll ke atas saat route berubah.
 * Pasang sekali di App.tsx.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}
