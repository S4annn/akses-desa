/**
 * Konfigurasi gambar terpusat untuk AksesDesa.
 * Ganti URL di bawah dengan foto asli desa Anda kapan pun.
 *
 * Foto utama desa: /desa.jpg (dari folder public/)
 * Untuk ganti foto: replace public/desa.jpg dengan foto baru, nama tetap.
 * Untuk pakai foto berbeda per section: ganti nilai di sini.
 */

const VILLAGE_PHOTO = '/desa.jpg';

export const images = {
  // Hero homepage — background besar di section atas
  heroBackground: VILLAGE_PHOTO,

  // Loading screen background — gambar yang muncul saat halaman dimuat
  loadingBackground: VILLAGE_PHOTO,

  // Profil desa hero
  villageProfile: VILLAGE_PHOTO,

  // Login page background
  loginBackground: VILLAGE_PHOTO,

  // Fallback gambar UMKM kalau belum ada foto
  msmePlaceholder:
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=70',

  // Fallback gambar berita
  newsPlaceholder:
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=70',
};
