-- AksesDesa seed data
-- Run this AFTER schema.sql and creating an admin auth user.

-- 1) Create village
insert into villages (id, name, district, regency, province, address, phone, email, description, history, vision, mission)
values (
  gen_random_uuid(),
  'Desa Sukamaju',
  'Tanjung Sari',
  'Sleman',
  'Daerah Istimewa Yogyakarta',
  'Jl. Raya Sukamaju No. 12, Sleman, DIY',
  '(0274) 555-1234',
  'info@desasukamaju.id',
  'Desa Sukamaju adalah desa berkembang dengan masyarakat aktif.',
  'Desa Sukamaju merupakan desa yang berkembang dari kawasan pertanian dan perdagangan lokal.',
  'Mewujudkan Desa Sukamaju yang mandiri, transparan, sejahtera, dan berdaya saing.',
  'Pelayanan administrasi yang humanis dan transparan.'
) returning id;

-- After running, copy the village id and replace the placeholder below.
-- Example:
-- with v as (select id from villages where name = 'Desa Sukamaju' limit 1)
-- insert into village_officials (village_id, name, position, order_index)
-- select v.id, x.name, x.position, x.idx from v,
--   (values
--     ('Budi Santoso','Kepala Desa',1),
--     ('Rina Wulandari','Sekretaris Desa',2),
--     ('Andi Pratama','Kaur Keuangan',3),
--     ('Siti Aminah','Kasi Pelayanan',4),
--     ('Dedi Kurniawan','Kasi Pemerintahan',5),
--     ('Nur Hayati','Kasi Kesejahteraan',6)
--   ) as x(name, position, idx);

-- Service types
with v as (select id from villages where name = 'Desa Sukamaju' limit 1)
insert into service_types (village_id, name, category, description, requirements, processing_time)
select v.id, x.name, x.category, x.description, x.requirements::jsonb, x.processing_time from v,
(values
  ('Surat Keterangan Domisili','Kependudukan','Surat keterangan tempat tinggal warga.', '["Fotokopi KTP","Fotokopi KK","Surat pengantar RT/RW"]', '1-2 hari kerja'),
  ('Surat Keterangan Usaha','Usaha','Untuk pelaku usaha mikro dan kecil.', '["Fotokopi KTP","Fotokopi KK","Foto tempat usaha","Surat pengantar RT/RW"]', '1-2 hari kerja'),
  ('Surat Keterangan Tidak Mampu','Sosial','Diterbitkan untuk keperluan bantuan.', '["Fotokopi KTP","Fotokopi KK","Surat pengantar RT/RW"]', '2-3 hari kerja')
) as x(name, category, description, requirements, processing_time);

-- Sample posts
with v as (select id from villages where name = 'Desa Sukamaju' limit 1)
insert into posts (village_id, title, slug, content, excerpt, type, is_published, published_at)
select v.id, x.title, x.slug, x.content, x.excerpt, x.type, true, now() from v,
(values
  ('Musyawarah Desa Bahas Program Infrastruktur 2026','musyawarah-desa-2026','Konten lengkap berita musyawarah desa.','Pemerintah desa membahas prioritas pembangunan 2026.','berita'),
  ('Jadwal Posyandu Balita Bulan Ini','jadwal-posyandu','Konten posyandu rutin.','Posyandu balita rutin akan dilaksanakan minggu ini.','pengumuman')
) as x(title, slug, content, excerpt, type);

-- Budget items
with v as (select id from villages where name = 'Desa Sukamaju' limit 1)
insert into budget_items (village_id, year, category, title, allocated_amount, realized_amount)
select v.id, 2026, x.category, x.title, x.alloc, x.real from v,
(values
  ('Infrastruktur','Perbaikan jalan dan drainase',350000000,220000000),
  ('Kesehatan','Posyandu dan layanan kesehatan',120000000,75000000),
  ('Pendidikan','Beasiswa dan pelatihan',95000000,60000000),
  ('Pemberdayaan UMKM','Pelatihan dan stimulus modal',80000000,50000000),
  ('Sosial','Bantuan sosial',150000000,95000000),
  ('Operasional Desa','Operasional pelayanan',200000000,130000000)
) as x(category, title, alloc, real);

-- Chatbot knowledge
with v as (select id from villages where name = 'Desa Sukamaju' limit 1)
insert into chatbot_knowledge (village_id, question, answer, category, is_active)
select v.id, x.q, x.a, x.cat, true from v,
(values
  ('Syarat surat domisili','Fotokopi KTP, KK, surat pengantar RT/RW. Diproses 1-2 hari kerja.','Layanan'),
  ('Cara mengajukan SKU','Siapkan KTP, KK, foto usaha, pengantar RT/RW. Ajukan via menu Ajukan Surat.','Layanan'),
  ('Jadwal posyandu','Posyandu rutin setiap bulan di balai dusun masing-masing.','Kesehatan'),
  ('Cara melapor jalan rusak','Buka menu Pengaduan Warga, isi kategori dan lokasi.','Pengaduan'),
  ('Bansos yang tersedia','Sembako, Pendidikan, Kesehatan, Lansia, Disabilitas, Modal UMKM.','Bansos'),
  ('Jam pelayanan','Senin-Jumat 08.00-15.00.','Umum')
) as x(q, a, cat);
