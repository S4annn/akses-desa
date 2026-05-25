import type { ServiceRequest, ServiceStatus } from '../types/app';

/**
 * WhatsApp notification via wa.me link.
 * Tidak butuh API berbayar — buka WhatsApp Web/App di tab baru
 * dengan template message yang sudah diisi.
 */

function normalizePhone(phone: string): string {
  // Hilangkan spasi, dash, dan tanda kurung
  let p = phone.replace(/[\s\-\(\)]/g, '');
  // Ganti +62 → 62, leading 0 → 62
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('0')) p = '62' + p.slice(1);
  return p;
}

const statusMessages: Record<ServiceStatus, string> = {
  Diajukan: 'Pengajuan Anda sudah kami terima dan masuk antrian verifikasi.',
  Diverifikasi: 'Dokumen pengajuan Anda telah diverifikasi.',
  'Butuh Perbaikan': 'Pengajuan Anda perlu perbaikan/kelengkapan dokumen.',
  Diproses: 'Pengajuan Anda sedang diproses oleh perangkat desa.',
  'Siap Diambil': 'Surat Anda sudah selesai dan dapat diambil di kantor desa.',
  Selesai: 'Pengajuan Anda telah selesai. Terima kasih.',
  Ditolak: 'Mohon maaf, pengajuan Anda tidak dapat diproses.',
};

export function buildWhatsAppMessage(request: ServiceRequest, customNote?: string): string {
  const lines = [
    `Halo ${request.citizen_name},`,
    '',
    `Berikut update pengajuan layanan Anda di AksesDesa:`,
    '',
    `📄 Layanan: *${request.service_name ?? 'Surat Administrasi'}*`,
    `🔢 Kode tracking: *${request.tracking_code}*`,
    `📌 Status: *${request.status}*`,
    '',
    statusMessages[request.status],
  ];

  if (customNote && customNote.trim()) {
    lines.push('', `📝 Catatan dari admin:`, customNote);
  }

  lines.push(
    '',
    'Cek status terbaru di portal AksesDesa.',
    '',
    '_Terima kasih atas kesabaran Anda._',
    '_Pesan otomatis dari Pemerintah Desa._'
  );

  return lines.join('\n');
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const p = normalizePhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${p}?text=${encoded}`;
}

export function notifyCitizen(request: ServiceRequest, customNote?: string): void {
  if (!request.phone) {
    throw new Error('Nomor WhatsApp pemohon tidak tersedia.');
  }
  const message = buildWhatsAppMessage(request, customNote);
  const url = buildWhatsAppLink(request.phone, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}
