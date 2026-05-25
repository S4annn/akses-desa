-- Tambah kolom koordinat di tabel villages (kalau belum ada)
-- Jalankan di Supabase SQL Editor

alter table villages
  add column if not exists latitude numeric,
  add column if not exists longitude numeric;

-- Optional: set default koordinat untuk village yang sudah ada
update villages
set
  latitude = coalesce(latitude, -7.7956),
  longitude = coalesce(longitude, 110.3695)
where latitude is null or longitude is null;
