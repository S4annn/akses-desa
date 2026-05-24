export function generateTrackingCode(prefix: 'ADS' | 'ADU' | 'BNS'): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${year}-${code}`;
}
