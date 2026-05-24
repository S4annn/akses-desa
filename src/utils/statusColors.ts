import type { AidStatus, ComplaintStatus, ServiceStatus, Urgency } from '../types/app';

export const serviceStatusColor: Record<ServiceStatus, string> = {
  Diajukan: 'bg-sky-50 text-sky-700 border-sky-200',
  Diverifikasi: 'bg-teal-50 text-teal-700 border-teal-200',
  'Butuh Perbaikan': 'bg-amber-50 text-amber-700 border-amber-200',
  Diproses: 'bg-violet-50 text-violet-700 border-violet-200',
  'Siap Diambil': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Selesai: 'bg-green-50 text-green-700 border-green-200',
  Ditolak: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const complaintStatusColor: Record<ComplaintStatus, string> = {
  Masuk: 'bg-sky-50 text-sky-700 border-sky-200',
  Ditinjau: 'bg-amber-50 text-amber-700 border-amber-200',
  'Dalam Tindak Lanjut': 'bg-violet-50 text-violet-700 border-violet-200',
  Selesai: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Ditolak: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const aidStatusColor: Record<AidStatus, string> = {
  Diajukan: 'bg-sky-50 text-sky-700 border-sky-200',
  Diverifikasi: 'bg-teal-50 text-teal-700 border-teal-200',
  Layak: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Tidak Layak': 'bg-rose-50 text-rose-700 border-rose-200',
  Disalurkan: 'bg-green-50 text-green-700 border-green-200',
  Ditolak: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const urgencyColor: Record<Urgency, string> = {
  rendah: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sedang: 'bg-amber-50 text-amber-700 border-amber-200',
  tinggi: 'bg-rose-50 text-rose-700 border-rose-200',
};
