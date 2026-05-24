# AksesDesa — Portal Digital Desa Modern

**Tagline:** Portal digital desa yang lebih mudah, transparan, dan responsif.

AksesDesa adalah aplikasi web full-stack untuk pemerintah desa/kelurahan yang menggabungkan:

- Profil desa
- Layanan administrasi online (pengajuan surat)
- Cek status pengajuan
- Informasi & pengajuan bantuan sosial
- Pengaduan warga (dengan klasifikasi AI)
- Katalog UMKM lokal
- Berita & pengumuman desa
- Agenda kegiatan
- Transparansi anggaran
- Galeri desa
- Chatbot AI Layanan Desa
- Dashboard admin civic-tech

---

## Fitur Utama

- **UI modern civic-tech**, mobile-first dengan glassmorphism halus dan micro-interactions
- **Dashboard SaaS-like** untuk admin desa dengan charts (Recharts) dan tabel modern
- **AI Layanan Desa (Gemini)** — chatbot, klasifikasi pengaduan, generator berita
- **Privasi-first** — masking NIK/KK, dokumen upload private, view publik aman
- **Supabase** untuk database, auth, dan storage
- **Demo mode** — aplikasi tetap jalan tanpa Supabase/Gemini menggunakan data dummy

---

## Tech Stack

| Area | Teknologi |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| UI | Custom component system |
| Icons | Lucide React |
| Animation | Framer Motion |
| Charts | Recharts |
| Map | Leaflet (+ peta SVG kustom) |
| Forms | React Hook Form + Zod |
| Routing | React Router v6 |
| Backend | Supabase (Postgres, Auth, Storage) |
| AI | Google Gemini (`@google/generative-ai`) |
| Deployment | Vercel |

---

## Cara Install

```bash
# 1. clone & install
npm install

# 2. siapkan environment
cp .env.example .env
# Isi VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_GEMINI_API_KEY

# 3. jalankan dev
npm run dev
```

Aplikasi otomatis berjalan dengan **data dummy** jika env belum diisi, sehingga UI bisa langsung dieksplorasi.

---

## Setup Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/seed.sql` (sesuaikan village id)
3. Buat **Storage Buckets**:
   - `public-images` (public) — gambar berita, galeri, UMKM
   - `private-docs` (private) — dokumen warga (KTP, KK, dsb)
4. Buat user admin via **Authentication → Add user**:
   - Email: `admin@aksesdesa.id`
   - Password: `aksesdesa123`
5. Insert profile untuk user tersebut:
   ```sql
   insert into profiles (id, full_name, email, role, village_id)
   values ('<user-uuid>', 'Admin AksesDesa', 'admin@aksesdesa.id', 'admin',
           (select id from villages where name = 'Desa Sukamaju'));
   ```
6. Salin Project URL & anon key ke `.env`.

---

## Setup Gemini API

1. Aktifkan key di [Google AI Studio](https://aistudio.google.com/).
2. Tambahkan ke `.env`:
   ```
   VITE_GEMINI_API_KEY=your-key
   ```
3. Jika tanpa key, AI tetap berjalan dengan fallback knowledge base lokal.

---

## Deploy ke Vercel

### Opsi 1 — Via Dashboard (paling cepat)

1. Push repo ke GitHub/GitLab/Bitbucket.
2. Buka [vercel.com/new](https://vercel.com/new) → Import repo.
3. Vercel akan otomatis mendeteksi konfigurasi dari `vercel.json`:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Tambahkan **Environment Variables** di Project Settings:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_GEMINI_API_KEY
   ```
   (boleh dikosongkan — app tetap jalan dengan dummy data + AI fallback)
5. Klik **Deploy**.

### Opsi 2 — Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel              # preview deployment
vercel --prod       # production deployment
```

### Yang sudah dikonfigurasi untuk Vercel

- `vercel.json` — SPA rewrites (semua route → `index.html`), cache header untuk `assets/*`, security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- `.vercelignore` — exclude `node_modules`, `dist`, `.env`, dan folder `supabase/` dari upload.
- `.nvmrc` — pin Node 20.
- **Code splitting** via `manualChunks` di `vite.config.ts`:
  - `react-vendor`, `ui-vendor`, `charts-vendor`, `forms-vendor`, `supabase-vendor`, `ai-vendor`, `map-vendor`
- **Lazy routes** — semua admin pages dan public pages (kecuali Home) di-lazy load. Initial load homepage hanya ~17 kB gzipped.

---

## Struktur Folder

```
src/
  main.tsx
  App.tsx
  index.css
  routes/
    AppRoutes.tsx
    ProtectedRoute.tsx
  layouts/
    PublicLayout.tsx
    AdminLayout.tsx
    Navbar.tsx
    Footer.tsx
  pages/
    public/   ← Home, Profil, Layanan, Pengaduan, Bansos, UMKM, dst.
    admin/    ← Dashboard, pengelolaan layanan, pengaduan, dsb.
  components/
    common/   ← Logo, Modal, StatCard, StatusBadge, dst.
  services/
    supabaseClient.ts
    geminiService.ts
  hooks/
    useAuth.ts
    useToast.tsx
  utils/
    formatDate.ts, generateTrackingCode.ts, maskSensitiveData.ts, statusColors.ts
  data/dummyData.ts
  types/app.ts
supabase/
  schema.sql
  rls.sql
  seed.sql
```

---

## Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=
```

---

## Akun Demo

| Field | Value |
|---|---|
| Email | `admin@aksesdesa.id` |
| Password | `aksesdesa123` |

Login bekerja secara lokal dalam demo mode dan terhubung ke Supabase Auth jika sudah dikonfigurasi.

---

## Catatan Keamanan & Privasi

- NIK & KK lengkap **tidak ditampilkan** di UI publik. Gunakan masking saat menampilkan data warga.
- Bucket dokumen warga **harus private**.
- Pengaduan anonim **tidak menampilkan identitas pelapor**.
- Chatbot AI **hanya menjawab berdasarkan knowledge base**. Jika tidak ada, AI mengarahkan ke kantor desa.
- AI **tidak menentukan kelayakan bansos final** atau memberi nasihat hukum final. Semua keputusan administratif tetap oleh perangkat desa.
- Disclaimer AI ditampilkan di seluruh fitur AI:

> Jawaban AI Desa bersifat bantuan informasi awal. Untuk keputusan resmi, silakan konfirmasi ke kantor desa atau perangkat desa terkait.

---

## Lisensi

Bebas digunakan dan dimodifikasi untuk kebutuhan desa & kelurahan di Indonesia.
