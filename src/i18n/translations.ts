/**
 * Translation strings untuk AksesDesa.
 * Bahasa Indonesia (id) sebagai default + English (en).
 *
 * Pattern: t('section.key') → string
 * Untuk dynamic value: t('section.key', { name: 'Budi' }) → "Halo, Budi"
 */

export type Locale = 'id' | 'en';

export const translations = {
  id: {
    common: {
      home: 'Beranda',
      profile: 'Profil',
      services: 'Layanan',
      complaints: 'Pengaduan',
      socialAid: 'Bansos',
      msme: 'UMKM',
      news: 'Berita',
      agenda: 'Agenda',
      transparency: 'Transparansi',
      gallery: 'Galeri',
      contact: 'Kontak',
      chatbot: 'AI Desa',
      admin: 'Admin',
      apply: 'Ajukan',
      report: 'Laporkan',
      submit: 'Kirim',
      cancel: 'Batal',
      save: 'Simpan',
      delete: 'Hapus',
      edit: 'Edit',
      detail: 'Detail',
      back: 'Kembali',
      loading: 'Memuat...',
      search: 'Cari...',
      noData: 'Belum ada data',
      readMore: 'Selengkapnya',
    },
    home: {
      tagline: 'Portal Digital Desa Modern',
      heroTitle1: 'Layanan Desa Lebih',
      heroTitle2: 'Mudah, Cepat,',
      heroTitle3: 'dan Transparan.',
      heroDesc:
        'AksesDesa membantu warga mengurus administrasi, melihat pengumuman, mengajukan pengaduan, mengecek bantuan sosial, dan menemukan UMKM lokal dalam satu portal digital.',
      ctaApply: 'Ajukan Layanan',
      ctaReport: 'Laporkan Masalah',
      ctaAI: 'Tanya AI Desa',
      quickAccess: 'Akses Cepat',
      quickAccessTitle: 'Layanan yang paling sering dibutuhkan',
      quickAccessDesc: 'Pilih kebutuhan Anda dan AksesDesa akan mengarahkan ke proses yang tepat.',
    },
    nav: {
      adminPanel: 'Login Admin',
    },
    footer: {
      description: 'Portal digital desa yang lebih mudah, transparan, dan responsif.',
      services: 'Layanan',
      information: 'Informasi',
      contact: 'Kontak',
      hours: 'Jam Layanan',
      hoursValue: 'Senin-Jumat 08.00-15.00',
      closed: 'Sabtu & Minggu tutup',
      copyright: 'Semua hak dilindungi.',
      builtWith: 'Dibangun dengan semangat civic-tech untuk desa Indonesia.',
    },
    chatbot: {
      title: 'Tanya AI Layanan Desa',
      desc: 'Asisten cerdas yang membantu warga menemukan informasi cepat.',
      placeholder: 'Tulis pertanyaan Anda...',
      thinking: 'Sedang berpikir...',
      disclaimer: 'Disclaimer: Jawaban AI Desa bersifat bantuan informasi awal. Untuk keputusan resmi, konfirmasi ke kantor desa.',
    },
  },
  en: {
    common: {
      home: 'Home',
      profile: 'Profile',
      services: 'Services',
      complaints: 'Complaints',
      socialAid: 'Aid',
      msme: 'SMEs',
      news: 'News',
      agenda: 'Agenda',
      transparency: 'Transparency',
      gallery: 'Gallery',
      contact: 'Contact',
      chatbot: 'AI Assistant',
      admin: 'Admin',
      apply: 'Apply',
      report: 'Report',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      detail: 'Detail',
      back: 'Back',
      loading: 'Loading...',
      search: 'Search...',
      noData: 'No data yet',
      readMore: 'Read more',
    },
    home: {
      tagline: 'Modern Digital Village Portal',
      heroTitle1: 'Village Services',
      heroTitle2: 'Easier, Faster,',
      heroTitle3: 'and More Transparent.',
      heroDesc:
        'AksesDesa helps residents manage administration, view announcements, file complaints, check social aid, and find local SMEs in one digital portal.',
      ctaApply: 'Apply for Service',
      ctaReport: 'Report Issue',
      ctaAI: 'Ask AI Assistant',
      quickAccess: 'Quick Access',
      quickAccessTitle: 'Most needed services',
      quickAccessDesc: 'Choose what you need and AksesDesa will guide you through the right process.',
    },
    nav: {
      adminPanel: 'Admin Login',
    },
    footer: {
      description: 'A digital village portal that is easier, more transparent, and more responsive.',
      services: 'Services',
      information: 'Information',
      contact: 'Contact',
      hours: 'Service Hours',
      hoursValue: 'Mon-Fri 8 AM - 3 PM',
      closed: 'Closed on Saturday & Sunday',
      copyright: 'All rights reserved.',
      builtWith: 'Built with civic-tech spirit for Indonesian villages.',
    },
    chatbot: {
      title: 'Ask AI Village Assistant',
      desc: 'Smart assistant helping residents find information quickly.',
      placeholder: 'Type your question...',
      thinking: 'Thinking...',
      disclaimer: 'Disclaimer: AI answers are initial information only. For official decisions, please confirm with the village office.',
    },
  },
} as const;

export type TranslationKeys = typeof translations.id;
