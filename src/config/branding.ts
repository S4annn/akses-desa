/**
 * Konfigurasi branding terpusat untuk AksesDesa.
 *
 * GANTI LOGO:
 *   1. Taruh file gambar logo di folder `public/` — misal: public/logo.jpg
 *   2. Set `logoImage` di bawah ke '/logo.jpg' (atau path file Anda)
 *   3. Untuk balik ke icon SVG default, set `logoImage: null`
 *
 * GANTI NAMA:
 *   - `nameStart` + `nameEnd` digabung jadi tampilan logo (mis. "Desa" + "Condongcatur")
 *   - `tagline` muncul di bawah nama (kecil)
 */
export const brand = {
  /**
   * Path gambar logo. Set ke null untuk pakai icon SVG default.
   *
   * Contoh:
   *   logoImage: '/logo.jpg'      → pakai public/logo.jpg
   *   logoImage: '/logo.png'      → pakai public/logo.png
   *   logoImage: '/desa-logo.svg' → pakai public/desa-logo.svg
   *   logoImage: null             → pakai SVG default (rumah hijau)
   */
  logoImage: '/logo.png' as string | null,

  // Nama yang ditampilkan di header (fallback kalau Supabase belum siap)
  // Logo component akan otomatis fetch nama desa dari Supabase saat mount.
  name: 'Desa Condongcatur',
  nameStart: 'Desa ',
  nameEnd: 'Condongcatur',

  // Tagline kecil di bawah nama logo
  tagline: 'Portal Digital Desa',
};
