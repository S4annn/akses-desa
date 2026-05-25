import type {
  Agenda,
  BudgetItem,
  ChatbotKnowledge,
  Complaint,
  GalleryItem,
  MSME,
  Post,
  ServiceRequest,
  ServiceType,
  SocialAid,
  Village,
  VillageOfficial,
} from '../types/app';

export const village: Village = {
  id: 'village-1',
  name: 'Desa Condongcatur',
  district: 'Depok',
  regency: 'Sleman',
  province: 'Daerah Istimewa Yogyakarta',
  address: 'Jl. Anggajaya I No. 1, Condongcatur, Depok, Sleman, DIY',
  phone: '(0274) 880-XXX',
  email: 'info@condongcatur.id',
  // Koordinat: Desa Condongcatur, Depok, Sleman, DIY
  latitude: -7.7587,
  longitude: 110.4011,
  description:
    'Desa Condongcatur adalah desa berkembang di Kecamatan Depok, Kabupaten Sleman, dengan masyarakat yang aktif, fokus pada pelayanan publik, UMKM, dan inovasi sosial.',
  history:
    'Desa Condongcatur merupakan desa yang berkembang di kawasan strategis Kecamatan Depok, Sleman. Dengan lokasi yang dekat dengan pusat pendidikan dan ekonomi, Condongcatur terus mendorong inovasi pelayanan publik, pemberdayaan UMKM, dan penguatan kegiatan sosial bersama warganya.',
  vision:
    'Mewujudkan Desa Condongcatur yang mandiri, transparan, sejahtera, dan berdaya saing melalui pelayanan publik yang humanis dan digital.',
  mission: [
    'Meningkatkan kualitas pelayanan administrasi desa',
    'Mendorong keterbukaan informasi publik',
    'Mengembangkan potensi UMKM dan ekonomi lokal',
    'Memperkuat partisipasi warga dalam pembangunan',
    'Meningkatkan kualitas lingkungan dan sosial masyarakat',
  ],
};

export const officials: VillageOfficial[] = [
  {
    id: '1',
    name: 'Budi Santoso, S.Sos.',
    position: 'Kepala Desa',
    photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    id: '2',
    name: 'Rina Wulandari, S.E.',
    position: 'Sekretaris Desa',
    photo_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    id: '3',
    name: 'Andi Pratama',
    position: 'Kaur Keuangan',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    id: '4',
    name: 'Siti Aminah, S.Pd.',
    position: 'Kasi Pelayanan',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    id: '5',
    name: 'Dedi Kurniawan',
    position: 'Kasi Pemerintahan',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    id: '6',
    name: 'Nur Hayati',
    position: 'Kasi Kesejahteraan',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    id: '7',
    name: 'Hartono Wijaya',
    position: 'Kaur Umum & TU',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    id: '8',
    name: 'Yuliana Sari, S.Kom.',
    position: 'Kaur Perencanaan',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80',
  },
];

export const serviceTypes: ServiceType[] = [
  {
    id: 'st-1',
    name: 'Surat Keterangan Domisili',
    category: 'Kependudukan',
    description: 'Surat keterangan tempat tinggal warga di Desa Condongcatur.',
    requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Surat pengantar RT/RW'],
    processing_time: '1-2 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
  {
    id: 'st-2',
    name: 'Surat Keterangan Usaha',
    category: 'Usaha',
    description: 'Untuk pelaku usaha mikro dan kecil di wilayah desa.',
    requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Foto tempat usaha', 'Surat pengantar RT/RW'],
    processing_time: '1-2 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
  {
    id: 'st-3',
    name: 'Surat Keterangan Tidak Mampu',
    category: 'Sosial',
    description: 'Diterbitkan untuk warga yang membutuhkan bantuan sosial.',
    requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Surat pengantar RT/RW'],
    processing_time: '2-3 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
  {
    id: 'st-4',
    name: 'Surat Pengantar SKCK',
    category: 'Kependudukan',
    description: 'Pengantar untuk membuat SKCK di kepolisian.',
    requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Pas foto 4x6'],
    processing_time: '1 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
  {
    id: 'st-5',
    name: 'Surat Keterangan Kelahiran',
    category: 'Kependudukan',
    description: 'Surat untuk pencatatan kelahiran warga baru.',
    requirements: ['Fotokopi KTP orang tua', 'Fotokopi KK', 'Surat keterangan dari bidan/RS'],
    processing_time: '1-2 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
  {
    id: 'st-6',
    name: 'Surat Keterangan Kematian',
    category: 'Kependudukan',
    description: 'Surat untuk pencatatan kematian warga.',
    requirements: ['Fotokopi KTP almarhum', 'Fotokopi KK', 'Surat keterangan dari RS/medis'],
    processing_time: '1 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
  {
    id: 'st-7',
    name: 'Surat Pengantar Nikah',
    category: 'Kependudukan',
    description: 'Pengantar untuk pengajuan pernikahan ke KUA.',
    requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Pas foto', 'Surat pengantar RT/RW'],
    processing_time: '2 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
  {
    id: 'st-8',
    name: 'Surat Keterangan Pindah',
    category: 'Kependudukan',
    description: 'Surat untuk warga yang akan pindah domisili.',
    requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Surat pengantar RT/RW'],
    processing_time: '2-3 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
  {
    id: 'st-9',
    name: 'Surat Izin Keramaian',
    category: 'Perizinan',
    description: 'Izin penyelenggaraan acara/keramaian di lingkungan desa.',
    requirements: ['Fotokopi KTP penanggung jawab', 'Surat pengantar RT/RW', 'Detail acara'],
    processing_time: '2-3 hari kerja',
    fee: 'Gratis',
    is_active: true,
  },
];

export const sampleRequests: ServiceRequest[] = [
  {
    id: 'r1',
    tracking_code: 'ADS-2026-8F3K2',
    service_type_id: 'st-1',
    service_name: 'Surat Keterangan Domisili',
    citizen_name: 'Ahmad Subagja',
    phone: '081234567890',
    purpose: 'Pendaftaran sekolah anak',
    status: 'Diproses',
    admin_note: 'Dokumen pendukung sudah lengkap, sedang menunggu tanda tangan kepala desa.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'r2',
    tracking_code: 'ADS-2026-7B2M9',
    service_type_id: 'st-2',
    service_name: 'Surat Keterangan Usaha',
    citizen_name: 'Sari Indriani',
    phone: '081234567891',
    purpose: 'Pengajuan modal usaha',
    status: 'Selesai',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'r3',
    tracking_code: 'ADS-2026-9C4N1',
    service_type_id: 'st-3',
    service_name: 'Surat Keterangan Tidak Mampu',
    citizen_name: 'Budi Hartono',
    phone: '081234567892',
    purpose: 'Beasiswa pendidikan anak',
    status: 'Diverifikasi',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const sampleComplaints: Complaint[] = [
  {
    id: 'c1',
    tracking_code: 'ADU-2026-7K2MN',
    category: 'Lampu jalan mati',
    location: 'Dusun Melati, dekat Mushola Al-Ikhlas',
    description: 'Lampu jalan dekat mushola mati selama dua minggu.',
    is_anonymous: false,
    citizen_urgency: 'sedang',
    ai_category: 'Lampu Jalan',
    ai_urgency: 'sedang',
    ai_summary: 'Lampu jalan dekat mushola mati selama dua minggu.',
    ai_recommended_action: 'Teruskan ke petugas teknis untuk pengecekan.',
    status: 'Dalam Tindak Lanjut',
    latitude: -7.7956,
    longitude: 110.3695,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'c2',
    tracking_code: 'ADU-2026-3P9XQ',
    category: 'Drainase tersumbat',
    location: 'RT 03 / RW 02, Dusun Mawar',
    description: 'Saluran air tersumbat menyebabkan genangan setelah hujan.',
    is_anonymous: true,
    citizen_urgency: 'tinggi',
    ai_urgency: 'tinggi',
    ai_summary: 'Drainase tersumbat berisiko banjir lokal.',
    status: 'Selesai',
    latitude: -7.7946,
    longitude: 110.3675,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'c3',
    tracking_code: 'ADU-2026-2Q8VR',
    category: 'Jalan rusak',
    location: 'Jalan Desa, Dusun Anggrek',
    description: 'Jalan berlubang ukuran sedang membahayakan pengendara.',
    is_anonymous: false,
    citizen_urgency: 'tinggi',
    ai_urgency: 'tinggi',
    status: 'Ditinjau',
    latitude: -7.7976,
    longitude: 110.3705,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'c4',
    tracking_code: 'ADU-2026-5R7VW',
    category: 'Sampah liar',
    location: 'Pinggir sungai dekat Dusun Kenanga',
    description: 'Tumpukan sampah liar di pinggir sungai.',
    is_anonymous: true,
    citizen_urgency: 'sedang',
    status: 'Masuk',
    latitude: -7.7936,
    longitude: 110.3665,
    created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
];

export const socialAids: SocialAid[] = [
  {
    id: 'sa-1',
    name: 'Bantuan Sembako',
    description: 'Bantuan paket sembako rutin untuk keluarga prasejahtera.',
    requirements: ['Terdaftar sebagai warga desa', 'Kategori prasejahtera'],
    required_documents: ['Fotokopi KTP', 'Fotokopi KK', 'SKTM'],
    period: 'Bulanan',
    status: 'Aktif',
  },
  {
    id: 'sa-2',
    name: 'Bantuan Pendidikan',
    description: 'Bantuan biaya pendidikan untuk anak dari keluarga tidak mampu.',
    requirements: ['Anak masih bersekolah', 'Keluarga tidak mampu'],
    required_documents: ['Fotokopi KTP orang tua', 'Fotokopi rapor', 'SKTM'],
    period: 'Per semester',
    status: 'Aktif',
  },
  {
    id: 'sa-3',
    name: 'Bantuan Kesehatan',
    description: 'Bantuan biaya kesehatan untuk warga yang membutuhkan.',
    requirements: ['Surat rujukan medis', 'Warga desa'],
    required_documents: ['Fotokopi KTP', 'Surat rujukan'],
    period: 'Sesuai kebutuhan',
    status: 'Aktif',
  },
  {
    id: 'sa-4',
    name: 'Bantuan Lansia',
    description: 'Bantuan untuk warga lanjut usia tanpa pendamping.',
    requirements: ['Usia minimal 60 tahun', 'Warga desa'],
    required_documents: ['Fotokopi KTP', 'Fotokopi KK'],
    period: 'Bulanan',
    status: 'Aktif',
  },
  {
    id: 'sa-5',
    name: 'Bantuan Disabilitas',
    description: 'Dukungan untuk warga penyandang disabilitas.',
    requirements: ['Surat keterangan disabilitas', 'Warga desa'],
    required_documents: ['Fotokopi KTP', 'Surat keterangan medis'],
    period: 'Bulanan',
    status: 'Aktif',
  },
  {
    id: 'sa-6',
    name: 'Bantuan Modal UMKM',
    description: 'Stimulus modal usaha untuk pelaku UMKM lokal.',
    requirements: ['UMKM aktif minimal 6 bulan', 'Terdaftar di desa'],
    required_documents: ['Fotokopi KTP', 'Surat keterangan usaha'],
    period: 'Per program',
    status: 'Aktif',
  },
];

export const msmes: MSME[] = [
  {
    id: 'm-1',
    business_name: 'Warung Bu Sari',
    owner_name: 'Sari Wahyuni',
    category: 'Makanan & Minuman',
    description: 'Warung rumahan dengan menu nasi rames, lauk harian, dan jajanan tradisional.',
    phone: '081234567890',
    address: 'Dusun Melati, RT 02',
    image_url:
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=70',
    opening_hours: '07.00 - 21.00',
    is_verified: true,
  },
  {
    id: 'm-2',
    business_name: 'Keripik Singkong Makmur',
    owner_name: 'Pak Hartono',
    category: 'Makanan & Minuman',
    description: 'Produksi keripik singkong berbagai rasa dari bahan lokal desa.',
    phone: '081234567891',
    address: 'Dusun Mawar, RT 04',
    image_url:
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=70',
    opening_hours: '08.00 - 17.00',
    is_verified: true,
  },
  {
    id: 'm-3',
    business_name: 'Kopi Desa Lestari',
    owner_name: 'Pak Joko',
    category: 'Pertanian',
    description: 'Produk kopi lokal hasil petani desa dengan proses sangrai rumahan.',
    phone: '081234567892',
    address: 'Dusun Anggrek, RT 01',
    image_url:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=70',
    opening_hours: '08.00 - 18.00',
    is_verified: true,
  },
  {
    id: 'm-4',
    business_name: 'Anyaman Bambu Rahayu',
    owner_name: 'Bu Rahayu',
    category: 'Kerajinan',
    description: 'Kerajinan bambu lokal seperti keranjang, hiasan rumah, dan souvenir.',
    phone: '081234567893',
    address: 'Dusun Kenanga, RT 03',
    image_url:
      'https://images.unsplash.com/photo-1604335079402-2db04ad6e8a4?auto=format&fit=crop&w=800&q=70',
    opening_hours: '08.00 - 16.00',
    is_verified: true,
  },
  {
    id: 'm-5',
    business_name: 'Laundry Bersih Jaya',
    owner_name: 'Pak Surya',
    category: 'Jasa',
    description: 'Layanan laundry kiloan untuk warga sekitar.',
    phone: '081234567894',
    address: 'Dusun Melati, RT 05',
    image_url:
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=70',
    opening_hours: '07.00 - 20.00',
    is_verified: false,
  },
  {
    id: 'm-6',
    business_name: 'Toko Sembako Barokah',
    owner_name: 'Bu Aminah',
    category: 'Toko Kelontong',
    description: 'Toko sembako lengkap melayani warga desa setiap hari.',
    phone: '081234567895',
    address: 'Dusun Mawar, RT 02',
    image_url:
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=70',
    opening_hours: '06.00 - 21.00',
    is_verified: true,
  },
];

export const posts: Post[] = [
  {
    id: 'p-1',
    title: 'Musyawarah Desa Bahas Program Infrastruktur 2026',
    slug: 'musyawarah-desa-program-infrastruktur-2026',
    type: 'berita',
    excerpt:
      'Pemerintah desa bersama BPD dan tokoh masyarakat membahas prioritas pembangunan infrastruktur tahun 2026.',
    content:
      'Pemerintah Desa Condongcatur menggelar musyawarah desa untuk menetapkan prioritas program infrastruktur 2026. Beberapa program yang akan didorong meliputi perbaikan jalan dusun, drainase, dan penerangan jalan umum. Musyawarah dihadiri perangkat desa, BPD, tokoh masyarakat, serta perwakilan karang taruna.\n\nHasil musyawarah akan ditindaklanjuti melalui penyusunan APBDes dan tahapan perencanaan teknis di awal tahun anggaran.',
    image_url:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=70',
    author: 'Sekretariat Desa',
    published_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'p-2',
    title: 'Jadwal Posyandu Balita Bulan Ini',
    slug: 'jadwal-posyandu-balita-bulan-ini',
    type: 'pengumuman',
    excerpt:
      'Posyandu balita rutin akan dilaksanakan minggu ini di setiap dusun dengan layanan imunisasi dan vitamin.',
    content:
      'Pelaksanaan Posyandu balita bulan ini akan diadakan di balai dusun masing-masing. Layanan meliputi penimbangan, pengukuran tinggi badan, imunisasi rutin, dan pemberian vitamin A.\n\nWarga diharapkan membawa buku KIA dan datang sesuai jadwal yang ditentukan.',
    image_url:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=70',
    author: 'Kasi Kesejahteraan',
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'p-3',
    title: 'Pelatihan Digital Marketing untuk UMKM Lokal',
    slug: 'pelatihan-digital-marketing-umkm',
    type: 'kegiatan',
    excerpt:
      'Pelatihan digital marketing diselenggarakan untuk membantu pelaku UMKM lokal naik kelas secara digital.',
    content:
      'Desa Condongcatur mengadakan pelatihan digital marketing bagi pelaku UMKM lokal. Materi mencakup foto produk, copywriting, dan pemanfaatan media sosial untuk menjangkau pelanggan.\n\nPeserta akan mendapatkan modul dan sesi praktik langsung dari mentor.',
    image_url:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70',
    author: 'Kasi Pelayanan',
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'p-4',
    title: 'Pengumuman Pelayanan Administrasi Selama Libur Nasional',
    slug: 'pengumuman-pelayanan-libur-nasional',
    type: 'pengumuman',
    excerpt:
      'Selama libur nasional, layanan administrasi desa akan menyesuaikan jadwal khusus.',
    content:
      'Sehubungan dengan libur nasional, pelayanan administrasi desa akan menyesuaikan jadwal sebagai berikut. Untuk layanan mendesak, warga dapat menghubungi kontak darurat desa yang tertera di halaman kontak.',
    image_url:
      'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=1200&q=70',
    author: 'Sekretariat Desa',
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'p-5',
    title: 'Kerja Bakti Bersih Lingkungan Dusun Melati',
    slug: 'kerja-bakti-dusun-melati',
    type: 'kegiatan',
    excerpt: 'Warga Dusun Melati menggelar kerja bakti membersihkan saluran air dan area publik.',
    content:
      'Warga Dusun Melati bersama perangkat desa melaksanakan kerja bakti membersihkan saluran air, area publik, dan fasilitas pos ronda. Kegiatan ini bagian dari upaya rutin menjaga kebersihan dan kenyamanan lingkungan.',
    image_url:
      'https://images.unsplash.com/photo-1505672678657-cc7037095e60?auto=format&fit=crop&w=1200&q=70',
    author: 'Kasi Pemerintahan',
    published_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
];

export const agendas: Agenda[] = [
  {
    id: 'a-1',
    title: 'Posyandu Balita',
    description: 'Penimbangan, imunisasi, dan vitamin A.',
    location: 'Balai Dusun Melati',
    category: 'Kesehatan',
    start_date: new Date(Date.now() + 86400000 * 2).toISOString(),
  },
  {
    id: 'a-2',
    title: 'Kerja Bakti Dusun Melati',
    description: 'Membersihkan saluran air dan fasilitas publik.',
    location: 'Dusun Melati',
    category: 'Lingkungan',
    start_date: new Date(Date.now() + 86400000 * 5).toISOString(),
  },
  {
    id: 'a-3',
    title: 'Musyawarah Desa',
    description: 'Pembahasan program kerja triwulan.',
    location: 'Balai Desa Condongcatur',
    category: 'Pemerintahan',
    start_date: new Date(Date.now() + 86400000 * 7).toISOString(),
  },
  {
    id: 'a-4',
    title: 'Pelatihan UMKM',
    description: 'Digital marketing untuk pelaku UMKM lokal.',
    location: 'Aula Desa',
    category: 'Ekonomi',
    start_date: new Date(Date.now() + 86400000 * 10).toISOString(),
  },
  {
    id: 'a-5',
    title: 'Pembagian Bantuan Sembako',
    description: 'Penyaluran bantuan sembako bulanan.',
    location: 'Balai Desa',
    category: 'Sosial',
    start_date: new Date(Date.now() + 86400000 * 12).toISOString(),
  },
  {
    id: 'a-6',
    title: 'Rapat Karang Taruna',
    description: 'Persiapan kegiatan pemuda desa.',
    location: 'Aula Desa',
    category: 'Pemuda',
    start_date: new Date(Date.now() + 86400000 * 14).toISOString(),
  },
];

export const budgetItems: BudgetItem[] = [
  {
    id: 'b-1',
    year: 2026,
    category: 'Infrastruktur',
    title: 'Perbaikan jalan dan drainase',
    allocated_amount: 350000000,
    realized_amount: 220000000,
  },
  {
    id: 'b-2',
    year: 2026,
    category: 'Kesehatan',
    title: 'Posyandu, imunisasi, dan kegiatan kesehatan',
    allocated_amount: 120000000,
    realized_amount: 75000000,
  },
  {
    id: 'b-3',
    year: 2026,
    category: 'Pendidikan',
    title: 'Beasiswa dan pelatihan masyarakat',
    allocated_amount: 95000000,
    realized_amount: 60000000,
  },
  {
    id: 'b-4',
    year: 2026,
    category: 'Pemberdayaan UMKM',
    title: 'Pelatihan dan stimulus modal UMKM',
    allocated_amount: 80000000,
    realized_amount: 50000000,
  },
  {
    id: 'b-5',
    year: 2026,
    category: 'Sosial',
    title: 'Bantuan sosial dan kegiatan sosial',
    allocated_amount: 150000000,
    realized_amount: 95000000,
  },
  {
    id: 'b-6',
    year: 2026,
    category: 'Operasional Desa',
    title: 'Operasional pelayanan desa',
    allocated_amount: 200000000,
    realized_amount: 130000000,
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Pemandangan Sawah Desa',
    image_url:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=70',
    category: 'Lingkungan',
  },
  {
    id: 'g-2',
    title: 'Kegiatan Posyandu',
    image_url:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=70',
    category: 'Kegiatan',
  },
  {
    id: 'g-3',
    title: 'Pasar Desa',
    image_url:
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=70',
    category: 'UMKM',
  },
  {
    id: 'g-4',
    title: 'Kerajinan Bambu',
    image_url:
      'https://images.unsplash.com/photo-1604335079402-2db04ad6e8a4?auto=format&fit=crop&w=900&q=70',
    category: 'UMKM',
  },
  {
    id: 'g-5',
    title: 'Kerja Bakti Warga',
    image_url:
      'https://images.unsplash.com/photo-1505672678657-cc7037095e60?auto=format&fit=crop&w=900&q=70',
    category: 'Kegiatan',
  },
  {
    id: 'g-6',
    title: 'Kebun Kopi Lokal',
    image_url:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=70',
    category: 'Potensi',
  },
  {
    id: 'g-7',
    title: 'Pelatihan UMKM',
    image_url:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=70',
    category: 'Kegiatan',
  },
  {
    id: 'g-8',
    title: 'Senja Desa',
    image_url:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=70',
    category: 'Lingkungan',
  },
];

export const knowledgeBase: ChatbotKnowledge[] = [
  {
    id: 'kb-1',
    question: 'Syarat membuat surat domisili',
    answer:
      'Syarat surat domisili: fotokopi KTP, fotokopi KK, dan surat pengantar RT/RW. Diproses 1-2 hari kerja, gratis.',
    category: 'Layanan',
    is_active: true,
  },
  {
    id: 'kb-2',
    question: 'Cara mengajukan SKU (Surat Keterangan Usaha)',
    answer:
      'Siapkan fotokopi KTP, KK, foto tempat usaha, dan surat pengantar RT/RW. Ajukan melalui menu "Ajukan Surat" atau datang ke kantor desa.',
    category: 'Layanan',
    is_active: true,
  },
  {
    id: 'kb-3',
    question: 'Jadwal posyandu',
    answer:
      'Posyandu balita rutin diadakan setiap bulan di balai dusun masing-masing. Cek menu Agenda untuk jadwal terbaru.',
    category: 'Kesehatan',
    is_active: true,
  },
  {
    id: 'kb-4',
    question: 'Cara melaporkan jalan rusak atau lampu mati',
    answer:
      'Buka menu Pengaduan Warga, pilih kategori, isi lokasi dan deskripsi, lampirkan foto bila ada. Sistem akan memberi kode tracking untuk memantau status.',
    category: 'Pengaduan',
    is_active: true,
  },
  {
    id: 'kb-5',
    question: 'Jenis bantuan sosial yang tersedia',
    answer:
      'Bantuan yang tersedia: Sembako, Pendidikan, Kesehatan, Lansia, Disabilitas, dan Modal UMKM. Cek menu Bantuan Sosial untuk detail dan syaratnya.',
    category: 'Bansos',
    is_active: true,
  },
  {
    id: 'kb-6',
    question: 'Jam pelayanan kantor desa',
    answer: 'Jam layanan: Senin-Jumat 08.00-15.00. Sabtu dan Minggu tutup.',
    category: 'Umum',
    is_active: true,
  },
];

export const villageStats = {
  population: 4832,
  families: 1245,
  hamlets: 9,
  rt: 42,
  rw: 12,
  msmes: 248,
  monthlyRequests: 128,
  resolvedRate: 97,
  agendas: 32,
};
