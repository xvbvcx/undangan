-- =========================================================
-- Template music overrides (admin-managed)
-- =========================================================
-- Allows admins to override the default backsound for a given template
-- without redeploying the application. Customer-side music input was
-- removed from the builder; the renderer now resolves audio in this order:
--   1. row in public.template_music for the active template_slug
--   2. template.music default in lib/templates.ts
--
-- Run idempotently — safe to re-execute on existing databases.

create table if not exists public.template_music (
  id uuid primary key default gen_random_uuid(),
  template_slug text not null unique,
  music_url text not null,
  label text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists template_music_slug_idx on public.template_music(template_slug);

alter table public.template_music enable row level security;

drop policy if exists "public read template music" on public.template_music;
drop policy if exists "admins manage template music" on public.template_music;

-- Anyone (including anon) can read so the public invitation page doesn't
-- need an admin client just to look up the right backsound.
create policy "public read template music" on public.template_music
  for select using (true);

create policy "admins manage template music" on public.template_music
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop trigger if exists template_music_updated_at on public.template_music;
create trigger template_music_updated_at
  before update on public.template_music
  for each row execute function public.touch_updated_at();

-- =========================================================
-- Audio storage bucket for admin-uploaded backsounds
-- =========================================================
insert into storage.buckets (id, name, public)
values ('invitation-audio', 'invitation-audio', true)
on conflict (id) do update set public = true;

drop policy if exists "admin upload audio" on storage.objects;
drop policy if exists "public read audio" on storage.objects;
drop policy if exists "admin update audio" on storage.objects;
drop policy if exists "admin delete audio" on storage.objects;

create policy "public read audio" on storage.objects
  for select using (bucket_id = 'invitation-audio');

create policy "admin upload audio" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'invitation-audio' and public.is_admin(auth.uid()));

create policy "admin update audio" on storage.objects
  for update using (bucket_id = 'invitation-audio' and public.is_admin(auth.uid()));

create policy "admin delete audio" on storage.objects
  for delete using (bucket_id = 'invitation-audio' and public.is_admin(auth.uid()));
