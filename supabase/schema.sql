-- Nikah Kilat Supabase schema (v1.1)
-- Jalankan di Supabase SQL Editor setelah membuat project. Idempoten: aman dijalankan ulang.

create extension if not exists "pgcrypto";

-- =========================================================
-- PROFILES
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- INVITATIONS
-- =========================================================
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  template_slug text not null,
  template_tier text not null check (template_tier in ('free', 'premium')),
  package_type text not null default 'free' check (package_type in ('free', 'premium')),
  payment_status text not null default 'not_required' check (payment_status in ('not_required', 'pending', 'paid', 'failed', 'expired')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_published boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  gallery_urls text[] not null default '{}',
  music_url text,
  view_count integer not null default 0,
  active_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invitations_user_id_idx on public.invitations(user_id);
create index if not exists invitations_slug_idx on public.invitations(slug);
create index if not exists invitations_published_idx on public.invitations(is_published, active_until);

-- Track historical slugs so old links keep working after a slug change.
create table if not exists public.invitation_slug_history (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  slug text not null unique,
  created_at timestamptz not null default now()
);
create index if not exists slug_history_invitation_id_idx on public.invitation_slug_history(invitation_id);

-- =========================================================
-- ORDERS
-- =========================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired', 'refunded', 'cancelled')),
  payment_provider text not null default 'ipaymu',
  reference_id text not null unique,
  payment_url text,
  raw_response jsonb,
  paid_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_invitation_id_idx on public.orders(invitation_id);
create index if not exists orders_status_idx on public.orders(status);

-- =========================================================
-- RSVPs
-- =========================================================
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  guest_slug text,
  attendance text not null default 'hadir' check (attendance in ('hadir', 'tidak_hadir', 'ragu')),
  guest_count integer not null default 1 check (guest_count between 1 and 20),
  message text,
  is_approved boolean not null default true,
  client_ip text,
  created_at timestamptz not null default now()
);
create index if not exists rsvps_invitation_id_idx on public.rsvps(invitation_id);

-- =========================================================
-- GUESTBOOK (separate from RSVP — pure ucapan/doa)
-- =========================================================
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  name text not null,
  message text not null,
  is_approved boolean not null default true,
  client_ip text,
  created_at timestamptz not null default now()
);
create index if not exists guestbook_invitation_id_idx on public.guestbook(invitation_id);

-- =========================================================
-- PAGE VIEWS (lightweight stats)
-- =========================================================
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_slug text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists page_views_invitation_id_idx on public.page_views(invitation_id);

-- =========================================================
-- AUDIT LOG (admin actions)
-- =========================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- =========================================================
-- TRIGGERS / FUNCTIONS
-- =========================================================

-- Resilient new-user handler. Falls back to a unique-suffix username when there is
-- a collision so `auth.users` insert never fails because of profile creation.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  desired_username text;
  candidate text;
  attempt int := 0;
begin
  desired_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    '[^a-z0-9_-]+', '', 'g'
  ));
  if desired_username is null or length(desired_username) < 3 then
    desired_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  candidate := desired_username;
  while attempt < 5 loop
    begin
      insert into public.profiles (id, email, username)
      values (new.id, new.email, candidate)
      on conflict (id) do nothing;
      return new;
    exception when unique_violation then
      attempt := attempt + 1;
      candidate := desired_username || '_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 4);
    end;
  end loop;

  -- Ultimate fallback — never block signup.
  insert into public.profiles (id, email, username)
  values (new.id, new.email, null)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generic updated_at trigger
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists invitations_updated_at on public.invitations;
create trigger invitations_updated_at
  before update on public.invitations
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Atomic view counter. SECURITY DEFINER so anonymous visitors can bump it without
-- needing direct UPDATE rights on invitations.
create or replace function public.increment_invitation_view(invitation_uuid uuid)
returns void as $$
begin
  update public.invitations
     set view_count = view_count + 1
   where id = invitation_uuid
     and is_published = true
     and (active_until is null or active_until > now());
end;
$$ language plpgsql security definer;

revoke all on function public.increment_invitation_view(uuid) from public;
grant execute on function public.increment_invitation_view(uuid) to anon, authenticated;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.invitation_slug_history enable row level security;
alter table public.orders enable row level security;
alter table public.rsvps enable row level security;
alter table public.guestbook enable row level security;
alter table public.page_views enable row level security;
alter table public.audit_logs enable row level security;

-- Drop-and-recreate policies so this script stays idempotent.
drop policy if exists "profiles self read" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
drop policy if exists "users manage own invitations" on public.invitations;
drop policy if exists "public read published invitations" on public.invitations;
drop policy if exists "admins read all invitations" on public.invitations;
drop policy if exists "users read own slug history" on public.invitation_slug_history;
drop policy if exists "public read slug history" on public.invitation_slug_history;
drop policy if exists "users read own orders" on public.orders;
drop policy if exists "users create own orders" on public.orders;
drop policy if exists "users update own orders" on public.orders;
drop policy if exists "public create rsvp" on public.rsvps;
drop policy if exists "owner read rsvp" on public.rsvps;
drop policy if exists "owner update rsvp" on public.rsvps;
drop policy if exists "owner delete rsvp" on public.rsvps;
drop policy if exists "public create guestbook" on public.guestbook;
drop policy if exists "owner read guestbook" on public.guestbook;
drop policy if exists "owner update guestbook" on public.guestbook;
drop policy if exists "owner delete guestbook" on public.guestbook;
drop policy if exists "owner read page views" on public.page_views;
drop policy if exists "admins read audit" on public.audit_logs;

create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id);

create policy "users manage own invitations" on public.invitations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public read published invitations" on public.invitations
  for select using (is_published = true and (active_until is null or active_until > now()));
create policy "admins read all invitations" on public.invitations
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "public read slug history" on public.invitation_slug_history
  for select using (true);
create policy "users read own slug history" on public.invitation_slug_history
  for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));

create policy "users read own orders" on public.orders
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "users create own orders" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "users update own orders" on public.orders
  for update using (auth.uid() = user_id);

create policy "public create rsvp" on public.rsvps
  for insert with check (true);
create policy "owner read rsvp" on public.rsvps
  for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "owner update rsvp" on public.rsvps
  for update using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
create policy "owner delete rsvp" on public.rsvps
  for delete using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));

create policy "public create guestbook" on public.guestbook
  for insert with check (true);
create policy "owner read guestbook" on public.guestbook
  for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()) or is_approved = true or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "owner update guestbook" on public.guestbook
  for update using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
create policy "owner delete guestbook" on public.guestbook
  for delete using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));

create policy "owner read page views" on public.page_views
  for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admins read audit" on public.audit_logs
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =========================================================
-- STORAGE
-- =========================================================
insert into storage.buckets (id, name, public)
values ('invitation-photos', 'invitation-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "authenticated upload photos" on storage.objects;
drop policy if exists "public read photos" on storage.objects;
drop policy if exists "owner update photos" on storage.objects;
drop policy if exists "owner delete photos" on storage.objects;

-- Authenticated users may upload only into a folder named after their auth.uid()
-- so attackers cannot drop files into someone else's namespace.
create policy "authenticated upload photos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'invitation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'invitation-photos');

create policy "owner update photos" on storage.objects
  for update using (
    bucket_id = 'invitation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owner delete photos" on storage.objects
  for delete using (
    bucket_id = 'invitation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Bootstrap admin (jalankan manual dengan email kamu):
-- update public.profiles set role = 'admin' where email = 'email-kamu@domain.com';
