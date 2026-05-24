export function maskName(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts
    .map((p) => (p.length <= 2 ? p[0] + '*' : p[0] + '*'.repeat(Math.max(1, p.length - 2)) + p[p.length - 1]))
    .join(' ');
}

export function maskNIK(nik: string): string {
  if (!nik || nik.length < 8) return '****';
  return nik.slice(0, 4) + '*'.repeat(nik.length - 8) + nik.slice(-4);
}

export function maskPhone(phone: string): string {
  if (!phone) return '';
  return phone.slice(0, 4) + '****' + phone.slice(-3);
}
