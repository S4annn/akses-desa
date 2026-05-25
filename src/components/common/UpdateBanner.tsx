import { motion } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Banner yang muncul saat ada versi baru AksesDesa siap di-update.
 * User klik "Reload" → service worker baru aktif & halaman refresh.
 */
export function UpdateBanner() {
  const [show, setShow] = useState(false);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Cek update tiap 1 jam
      if (registration) {
        setInterval(() => registration.update().catch(() => {}), 60 * 60 * 1000);
      }
    },
  });

  useEffect(() => {
    if (needRefresh) setShow(true);
  }, [needRefresh]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 shadow-soft">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand-700">
          <RefreshCw className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">Versi baru tersedia</p>
          <p className="text-xs text-slate-600">Muat ulang untuk mendapatkan pembaruan.</p>
        </div>
        <button
          onClick={() => updateServiceWorker(true)}
          className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800"
        >
          Muat Ulang
        </button>
        <button
          onClick={() => setShow(false)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
