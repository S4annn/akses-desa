import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, FileText, MessageSquareWarning, Store } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { useToast } from '../../hooks/useToast';
import { subscribe } from '../../services/notificationBus';

const typeMeta = {
  request: { icon: FileText, tone: 'bg-brand-50 text-brand-700' },
  complaint: { icon: MessageSquareWarning, tone: 'bg-rose-50 text-rose-600' },
  msme: { icon: Store, tone: 'bg-violet-50 text-violet-600' },
};

export function NotificationDropdown() {
  const { items, unreadCount, loading, markAllRead, refresh } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Subscribe ke bus untuk auto-refresh + toast saat ada event baru
  useEffect(() => {
    const unsub = subscribe((event) => {
      const messages: Record<string, string> = {
        request_created: 'Pengajuan surat baru masuk',
        complaint_created: 'Pengaduan warga baru masuk',
        msme_created: 'UMKM baru menunggu verifikasi',
      };
      const msg = messages[event.type];
      if (msg) toast.show(msg, 'info');
      refresh();
    });
    return unsub;
  }, [refresh, toast]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
        aria-label="Notifikasi"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-80 max-w-[92vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Notifikasi</p>
                <p className="text-[11px] text-slate-500">{unreadCount} belum dibaca</p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 hover:text-brand-800"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {loading && (
                <div className="px-4 py-8 text-center text-xs text-slate-500">Memuat...</div>
              )}
              {!loading && items.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <Bell className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-700">Tidak ada notifikasi</p>
                  <p className="text-xs text-slate-500">Anda akan diberitahu saat ada aktivitas baru.</p>
                </div>
              )}
              {!loading &&
                items.map((n) => {
                  const meta = typeMeta[n.type];
                  return (
                    <Link
                      key={n.id}
                      to={n.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-start gap-3 border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50 ${n.unread ? 'bg-brand-50/30' : ''}`}
                    >
                      <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${meta.tone}`}>
                        <meta.icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                          {n.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
                        </div>
                        <p className="truncate text-xs text-slate-600">{n.description}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{n.timeLabel}</p>
                      </div>
                    </Link>
                  );
                })}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center">
                <Link to="/admin" onClick={() => setOpen(false)} className="text-xs font-medium text-brand-700 hover:text-brand-800">
                  Lihat semua di Dashboard →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
