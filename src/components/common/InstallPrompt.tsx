import { Download, Share, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY = 'aksesdesa.installprompt.dismissed';
const DISMISS_DAYS = 7;

/**
 * Floating install banner.
 * - Android/Desktop Chrome: pakai `beforeinstallprompt` event
 * - iOS Safari: tidak ada native prompt, jadi tampilkan instruksi manual
 *   ("Share → Add to Home Screen")
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosMode, setIosMode] = useState(false);

  useEffect(() => {
    // Sudah di-install? Hide
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone) {
      return;
    }

    // Sudah di-dismiss recently?
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const ts = Number(dismissed);
        const daysPassed = (Date.now() - ts) / (1000 * 60 * 60 * 24);
        if (daysPassed < DISMISS_DAYS) return;
      }
    } catch {
      /* ignore */
    }

    // iOS detection (Safari)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    if (isIos) {
      // Tampilkan instruksi setelah 3 detik (biar user explore halaman dulu)
      const t = setTimeout(() => {
        setIosMode(true);
        setShow(true);
      }, 3000);
      return () => clearTimeout(t);
    }

    // Android/Desktop: tunggu beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
    if (result.outcome === 'accepted') {
      // User accepted, no need to remember dismissal
      return;
    }
    dismiss();
  }

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 sm:bottom-6">
      <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-xl">
        <div className="flex items-start gap-3 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-emerald-500 text-white">
            <Download className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {iosMode ? 'Pasang AksesDesa di iPhone' : 'Pasang AksesDesa di HP Anda'}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {iosMode
                ? 'Akses cepat layanan desa langsung dari home screen'
                : 'Akses lebih cepat tanpa buka browser, bisa offline'}
            </p>
            {iosMode ? (
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                <p className="font-semibold">Cara install di iPhone:</p>
                <ol className="mt-1 list-decimal space-y-1 pl-4">
                  <li>
                    Tap tombol <Share className="inline h-3.5 w-3.5" /> <b>Share</b> di Safari
                  </li>
                  <li>
                    Pilih <b>"Add to Home Screen"</b>
                  </li>
                  <li>
                    Tap <b>"Add"</b> di kanan atas
                  </li>
                </ol>
              </div>
            ) : (
              <button
                type="button"
                onClick={install}
                className="btn-primary mt-3 w-full justify-center text-sm"
              >
                <Download className="h-4 w-4" /> Install Aplikasi
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
