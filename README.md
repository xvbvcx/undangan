# Nikah Kilat

Website undangan pernikahan online: 20 template gratis, 20 template premium ultra exclusive, login Supabase, builder multi-step, RSVP, guestbook, view counter, share QR, dan integrasi pembayaran iPaymu Redirect.

## Stack

- Next.js 14 App Router
- Supabase Auth, Postgres, Storage (`@supabase/ssr`)
- iPaymu Redirect Payment (signature-verified callback)
- `sharp` untuk kompresi & resize foto
- Custom CSS, tanpa UI library berat
- TypeScript strict mode

## Cara jalan lokal

```bash
npm install
cp .env.example .env.local
# isi env, lalu:
npm run dev
```

Buka `http://localhost:3000`.

## Setup Supabase

1. Buat project Supabase.
2. Buka SQL Editor.
3. Jalankan `supabase/schema.sql` (idempotent — aman dijalankan ulang setelah update).
4. Buka Authentication → Providers → Email.
   - Untuk demo cepat: matikan `Confirm email` agar user bisa langsung login.
   - Untuk production: biarkan menyala.
5. Set Authentication → URL Configuration → Site URL = `NEXT_PUBLIC_SITE_URL` kamu, dan tambahkan redirect URL untuk `/reset-password`.
6. Isi env (lihat `.env.example`).

Setelah daftar akun owner, jadikan admin:

```sql
update public.profiles set role = 'admin' where email = 'email-kamu@domain.com';
```

## Setup iPaymu

Isi env:

```env
IPAYMU_VA=
IPAYMU_API_KEY=
IPAYMU_PRODUCTION=false
PREMIUM_PRICE=299000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Callback URL yang dipakai aplikasi:

```
/api/payment/ipaymu/callback
```

Callback ini sudah:

- Verifikasi signature header (HMAC SHA256).
- Cross-check status & amount via `/api/v2/transaction` ke iPaymu.
- Idempotent (order yang sudah `paid` tidak diproses ulang).
- Rate-limited per IP.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Import ke Vercel.
3. Tambahkan environment variables (lihat `.env.example`).
4. Deploy.

## Fitur

- Landing page modern, responsif.
- Katalog 40 template dengan 10 palette warna berbeda untuk standar dan 10 untuk premium.
- Preview template tanpa login + slug history (link lama tetap hidup setelah ganti slug).
- Auth email/password Supabase + lupa password / reset password.
- Builder undangan 6 step (pengantin → foto → acara → cerita → kado → publish) + draft mode.
- Photo upload: format JPEG/PNG/WebP/HEIC, dikompres ke WebP 1920px otomatis.
- Public invitation `/u/[slug]` dengan:
  - Cover gate (state persist via sessionStorage).
  - "Kepada Yth: {nama tamu}" via `?to=Nama+Tamu`.
  - Countdown realtime (hari/jam/menit/detik).
  - Galeri pakai `next/image` (lazy load, sizes responsif).
  - Music toggle (no autoplay block).
  - RSVP + guestbook + share (native share / WhatsApp / QR / copy link).
  - View counter (1 view per IP per 6 jam).
  - Open Graph & Twitter card dinamis.
- Dashboard owner: stats (views, RSVP, ucapan), perpanjang masa aktif 30 hari, hapus / arsipkan, salin link, lanjut bayar.
- Admin dashboard: publish/unpublish/extend/hapus invitation, mark paid / mark failed / refund order, promote / demote user, audit log.
- Masa aktif default 30 hari, bisa diperpanjang.
- Watermark hanya untuk free + bukan preview.
- Premium otomatis publish setelah pembayaran iPaymu sukses (atau manual via WhatsApp admin).

## Catatan keamanan

- Storage RLS memakai `(storage.foldername(name))[1] = auth.uid()` agar user hanya bisa modifikasi foto di folder mereka.
- Service role hanya dipakai di endpoint server (upload, RSVP, guestbook, callback iPaymu, page-view, admin).
- Slug divalidasi `^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])?$` + blacklist reserved keyword.
- URL maps & QRIS ditolak kalau bukan `http(s):`.
- Rate limit in-memory untuk login/upload/RSVP/guestbook (swap ke Upstash kalau multi-region).
- Middleware me-refresh session Supabase + menambah security headers (`X-Frame-Options`, `X-Content-Type-Options`, dll).

## Catatan musik

File chime di `public/audio/*.wav` adalah audio pendek non-komersial. Untuk musik komersial, pastikan kamu pegang lisensi dan paste URL ke field "Custom backsound URL" di builder.
