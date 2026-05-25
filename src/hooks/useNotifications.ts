import { useEffect, useState } from 'react';
import { listComplaintsForAdmin } from '../services/complaintsService';
import { listAllMSMEs } from '../services/msmeService';
import { listRequestsForAdmin } from '../services/serviceRequestsService';
import { timeAgo } from '../utils/formatDate';

export interface Notification {
  id: string;
  type: 'request' | 'complaint' | 'msme';
  title: string;
  description: string;
  time: string;
  href: string;
  unread: boolean;
}

const READ_KEY = 'aksesdesa.notifications.lastRead';

/**
 * Aggregate "notifications" dari beberapa entity:
 * - Pengajuan baru (status Diajukan)
 * - Pengaduan baru (status Masuk)
 * - UMKM menunggu verifikasi
 *
 * Dibandingkan dengan timestamp lastRead untuk tentukan unread.
 */
export function useNotifications(pollMs = 30000) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRead, setLastRead] = useState<number>(() => {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? Number(raw) : 0;
  });

  async function load() {
    try {
      const [reqs, complaints, msmes] = await Promise.all([
        listRequestsForAdmin(),
        listComplaintsForAdmin(),
        listAllMSMEs(),
      ]);

      const notifs: Notification[] = [];

      // Pengajuan yang belum diverifikasi
      reqs
        .filter((r) => r.status === 'Diajukan' || r.status === 'Diverifikasi')
        .slice(0, 5)
        .forEach((r) => {
          notifs.push({
            id: `req-${r.id}`,
            type: 'request',
            title: 'Pengajuan baru',
            description: `${r.service_name} · ${r.tracking_code}`,
            time: r.created_at,
            href: '/admin/pengajuan',
            unread: new Date(r.created_at).getTime() > lastRead,
          });
        });

      // Pengaduan yang belum selesai
      complaints
        .filter((c) => c.status === 'Masuk' || c.status === 'Ditinjau')
        .slice(0, 5)
        .forEach((c) => {
          notifs.push({
            id: `comp-${c.id}`,
            type: 'complaint',
            title: 'Pengaduan baru',
            description: `${c.category} · ${c.location}`,
            time: c.created_at,
            href: '/admin/pengaduan',
            unread: new Date(c.created_at).getTime() > lastRead,
          });
        });

      // UMKM menunggu verifikasi
      msmes
        .filter((m) => !m.is_verified)
        .slice(0, 5)
        .forEach((m) => {
          notifs.push({
            id: `msme-${m.id}`,
            type: 'msme',
            title: 'UMKM menunggu verifikasi',
            description: `${m.business_name} · ${m.category}`,
            time: new Date().toISOString(),
            href: '/admin/umkm',
            unread: true,
          });
        });

      // Sort terbaru duluan
      notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setItems(notifs.slice(0, 12));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, pollMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRead]);

  function markAllRead() {
    const now = Date.now();
    setLastRead(now);
    localStorage.setItem(READ_KEY, String(now));
  }

  const unreadCount = items.filter((n) => n.unread).length;

  return {
    items: items.map((n) => ({ ...n, timeLabel: timeAgo(n.time) })),
    unreadCount,
    loading,
    markAllRead,
    refresh: load,
  };
}
