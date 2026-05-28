-- Nikah Kilat Supabase schema
-- Jalankan di Supabase SQL Editor setelah membuat project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

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
  active_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired', 'refunded')),
  payment_provider text not null default 'ipaymu',
  reference_id text not null unique,
  payment_url text,
  raw_response jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  attendance text not null default 'hadir',
  guest_count integer not null default 1,
  message text,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  name text not null,
  message text not null,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.orders enable row level security;
alter table public.rsvps enable row level security;
alter table public.guestbook enable row level security;

create policy "profiles self read" on public.profiles for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

create policy "users manage own invitations" on public.invitations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public read published invitations" on public.invitations for select using (is_published = true and (active_until is null or active_until > now()));
create policy "admins read all invitations" on public.invitations for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "users read own orders" on public.orders for select using (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "users create own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "users update own orders" on public.orders for update using (auth.uid() = user_id);

create policy "public create rsvp" on public.rsvps for insert with check (true);
create policy "owner read rsvp" on public.rsvps for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "public create guestbook" on public.guestbook for insert with check (true);
create policy "owner read guestbook" on public.guestbook for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

insert into storage.buckets (id, name, public)
values ('invitation-photos', 'invitation-photos', true)
on conflict (id) do update set public = true;

create policy "authenticated upload photos" on storage.objects for insert to authenticated with check (bucket_id = 'invitation-photos');
create policy "public read photos" on storage.objects for select using (bucket_id = 'invitation-photos');
create policy "owner update photos" on storage.objects for update using (bucket_id = 'invitation-photos' and owner = auth.uid());
create policy "owner delete photos" on storage.objects for delete using (bucket_id = 'invitation-photos' and owner = auth.uid());

-- Jadikan akun pertama sebagai admin setelah daftar:
-- update public.profiles set role = 'admin' where email = 'email-kamu@domain.com';
