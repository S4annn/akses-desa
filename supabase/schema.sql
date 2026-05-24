-- AksesDesa schema
-- Run after creating a fresh Supabase project.

create extension if not exists "pgcrypto";

-- 1. profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text check (role in ('admin','head','staff')) default 'staff',
  village_id uuid,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- 2. villages
create table if not exists villages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  district text,
  regency text,
  province text,
  address text,
  phone text,
  email text,
  description text,
  history text,
  vision text,
  mission text,
  map_url text,
  hero_image_url text,
  logo_url text,
  created_at timestamp with time zone default now()
);

alter table profiles
  add constraint profiles_village_fk
  foreign key (village_id) references villages(id) on delete set null;

-- 3. village_officials
create table if not exists village_officials (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  name text not null,
  position text not null,
  photo_url text,
  phone text,
  order_index int default 0,
  created_at timestamp with time zone default now()
);

-- 4. service_types
create table if not exists service_types (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  name text not null,
  category text,
  description text,
  requirements jsonb,
  processing_time text,
  fee text default 'Gratis',
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 5. service_requests
create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  service_type_id uuid references service_types(id) on delete set null,
  tracking_code text unique not null,
  citizen_name text not null,
  nik text,
  kk_number text,
  birth_place text,
  birth_date date,
  gender text,
  address text,
  hamlet text,
  rt text,
  rw text,
  phone text,
  email text,
  purpose text,
  notes text,
  form_data jsonb,
  status text default 'Diajukan',
  admin_note text,
  final_document_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 6. request_documents
create table if not exists request_documents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references service_requests(id) on delete cascade,
  file_url text not null,
  file_name text,
  file_type text,
  document_type text,
  uploaded_at timestamp with time zone default now()
);

-- 7. complaints
create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  tracking_code text unique not null,
  citizen_name text,
  phone text,
  is_anonymous boolean default false,
  category text,
  location text,
  latitude numeric,
  longitude numeric,
  description text not null,
  photo_url text,
  citizen_urgency text,
  ai_category text,
  ai_urgency text,
  ai_summary text,
  ai_recommended_action text,
  status text default 'Masuk',
  admin_response text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 8. social_aids
create table if not exists social_aids (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  name text not null,
  description text,
  requirements jsonb,
  required_documents jsonb,
  period text,
  status text default 'Aktif',
  created_at timestamp with time zone default now()
);

-- 9. aid_applications
create table if not exists aid_applications (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  social_aid_id uuid references social_aids(id) on delete set null,
  tracking_code text unique not null,
  citizen_name text not null,
  nik text,
  kk_number text,
  address text,
  phone text,
  family_condition text,
  estimated_income numeric,
  dependents_count int,
  status text default 'Diajukan',
  admin_note text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 10. msmes
create table if not exists msmes (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  owner_name text,
  business_name text not null,
  category text,
  description text,
  phone text,
  address text,
  image_url text,
  latitude numeric,
  longitude numeric,
  opening_hours text,
  is_verified boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 11. posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  type text check (type in ('berita','pengumuman','kegiatan','layanan')),
  image_url text,
  author_id uuid references profiles(id) on delete set null,
  is_published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 12. agendas
create table if not exists agendas (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  title text not null,
  description text,
  location text,
  category text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- 13. budget_items
create table if not exists budget_items (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  year int,
  category text,
  title text,
  allocated_amount numeric,
  realized_amount numeric,
  description text,
  created_at timestamp with time zone default now()
);

-- 14. gallery_items
create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  title text,
  image_url text,
  category text,
  description text,
  created_at timestamp with time zone default now()
);

-- 15. chatbot_knowledge
create table if not exists chatbot_knowledge (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  question text,
  answer text,
  category text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 16. activity_logs
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  action text,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Helpful indexes
create index if not exists idx_requests_village on service_requests(village_id);
create index if not exists idx_complaints_village on complaints(village_id);
create index if not exists idx_posts_village_pub on posts(village_id, is_published);
create index if not exists idx_msmes_village_active on msmes(village_id, is_active);
