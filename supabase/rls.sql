-- AksesDesa Row Level Security policies

-- Helper functions
create or replace function public.get_user_village_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select village_id from profiles where id = auth.uid();
$$;

create or replace function public.is_admin_or_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select role in ('admin','head','staff') from profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_village_member(target_village uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select village_id = target_village from profiles where id = auth.uid()),
    false
  );
$$;

-- Enable RLS
alter table profiles enable row level security;
alter table villages enable row level security;
alter table village_officials enable row level security;
alter table service_types enable row level security;
alter table service_requests enable row level security;
alter table request_documents enable row level security;
alter table complaints enable row level security;
alter table social_aids enable row level security;
alter table aid_applications enable row level security;
alter table msmes enable row level security;
alter table posts enable row level security;
alter table agendas enable row level security;
alter table budget_items enable row level security;
alter table gallery_items enable row level security;
alter table chatbot_knowledge enable row level security;
alter table activity_logs enable row level security;

-- profiles: user reads own; admin/staff reads members of same village
drop policy if exists "profiles self" on profiles;
create policy "profiles self" on profiles for select using (auth.uid() = id);

drop policy if exists "profiles village admin" on profiles;
create policy "profiles village admin" on profiles for select
  using (is_admin_or_staff() and village_id = get_user_village_id());

drop policy if exists "profiles update self" on profiles;
create policy "profiles update self" on profiles for update using (auth.uid() = id);

-- villages: public read; admin update own
drop policy if exists "villages public read" on villages;
create policy "villages public read" on villages for select using (true);

drop policy if exists "villages admin update" on villages;
create policy "villages admin update" on villages for update
  using (is_admin_or_staff() and id = get_user_village_id());

-- village_officials: public read; admin manage
drop policy if exists "officials public read" on village_officials;
create policy "officials public read" on village_officials for select using (true);

drop policy if exists "officials admin manage" on village_officials;
create policy "officials admin manage" on village_officials for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- service_types: public read active; admin manage
drop policy if exists "service_types public" on service_types;
create policy "service_types public" on service_types for select using (is_active);

drop policy if exists "service_types admin" on service_types;
create policy "service_types admin" on service_types for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- service_requests: public insert; admin read/update; citizen cannot read others
drop policy if exists "requests insert public" on service_requests;
create policy "requests insert public" on service_requests for insert
  with check (true);

drop policy if exists "requests admin read" on service_requests;
create policy "requests admin read" on service_requests for select
  using (is_admin_or_staff() and is_village_member(village_id));

drop policy if exists "requests admin update" on service_requests;
create policy "requests admin update" on service_requests for update
  using (is_admin_or_staff() and is_village_member(village_id));

-- request_documents: public insert linked to a request; admin read
drop policy if exists "documents insert" on request_documents;
create policy "documents insert" on request_documents for insert with check (true);

drop policy if exists "documents admin read" on request_documents;
create policy "documents admin read" on request_documents for select
  using (
    is_admin_or_staff() and exists (
      select 1 from service_requests sr
      where sr.id = request_id and is_village_member(sr.village_id)
    )
  );

-- complaints: public insert; admin read/update; public read only safe columns via view
drop policy if exists "complaints insert" on complaints;
create policy "complaints insert" on complaints for insert with check (true);

drop policy if exists "complaints admin" on complaints;
create policy "complaints admin" on complaints for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- Public read view (no PII)
create or replace view public_complaints as
  select id, village_id, tracking_code, category, location,
         latitude, longitude, status, created_at
  from complaints;
grant select on public_complaints to anon, authenticated;

-- social_aids: public read active; admin manage
drop policy if exists "aids public" on social_aids;
create policy "aids public" on social_aids for select using (status = 'Aktif');

drop policy if exists "aids admin" on social_aids;
create policy "aids admin" on social_aids for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- aid_applications: public insert; admin read/update
drop policy if exists "aid_apps insert" on aid_applications;
create policy "aid_apps insert" on aid_applications for insert with check (true);

drop policy if exists "aid_apps admin" on aid_applications;
create policy "aid_apps admin" on aid_applications for select
  using (is_admin_or_staff() and is_village_member(village_id));
drop policy if exists "aid_apps admin update" on aid_applications;
create policy "aid_apps admin update" on aid_applications for update
  using (is_admin_or_staff() and is_village_member(village_id));

-- msmes: public read verified+active; public insert as registration; admin manage
drop policy if exists "msmes public" on msmes;
create policy "msmes public" on msmes for select using (is_active);

drop policy if exists "msmes register" on msmes;
create policy "msmes register" on msmes for insert with check (true);

drop policy if exists "msmes admin" on msmes;
create policy "msmes admin" on msmes for update
  using (is_admin_or_staff() and is_village_member(village_id));

-- posts: public read published; admin manage
drop policy if exists "posts public" on posts;
create policy "posts public" on posts for select using (is_published);

drop policy if exists "posts admin" on posts;
create policy "posts admin" on posts for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- agendas: public read; admin manage
drop policy if exists "agendas public" on agendas;
create policy "agendas public" on agendas for select using (true);

drop policy if exists "agendas admin" on agendas;
create policy "agendas admin" on agendas for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- budget_items: public read; admin manage
drop policy if exists "budget public" on budget_items;
create policy "budget public" on budget_items for select using (true);

drop policy if exists "budget admin" on budget_items;
create policy "budget admin" on budget_items for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- gallery_items: public read; admin manage
drop policy if exists "gallery public" on gallery_items;
create policy "gallery public" on gallery_items for select using (true);

drop policy if exists "gallery admin" on gallery_items;
create policy "gallery admin" on gallery_items for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- chatbot_knowledge: public read active; admin manage
drop policy if exists "kb public" on chatbot_knowledge;
create policy "kb public" on chatbot_knowledge for select using (is_active);

drop policy if exists "kb admin" on chatbot_knowledge;
create policy "kb admin" on chatbot_knowledge for all
  using (is_admin_or_staff() and is_village_member(village_id))
  with check (is_admin_or_staff() and is_village_member(village_id));

-- activity_logs: admin only
drop policy if exists "logs admin" on activity_logs;
create policy "logs admin" on activity_logs for select
  using (is_admin_or_staff() and is_village_member(village_id));

-- Storage:
-- Buckets to create manually in Supabase Studio:
--   public-images  (public read, admin write)  -> for hero, posts, gallery, msme images
--   private-docs   (private)                   -> for KTP/KK/uploaded documents
--
-- Example storage policies (apply per bucket):
--   public-images: allow anon select; allow authenticated insert/update with role check
--   private-docs : allow only authenticated admin/staff with same village_id
