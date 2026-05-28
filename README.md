# Nikah Kilat

Starter project website undangan pernikahan online mobile-first dengan 20 template gratis, 20 template premium ultra exclusive, login/register Supabase, upload foto maksimal 8, dashboard user, admin dashboard, RSVP, musik, dan integrasi iPaymu Redirect Payment.

## Stack

- Next.js App Router
- Supabase Auth, Postgres, Storage
- iPaymu Redirect Payment
- Vercel deploy-ready
- CSS custom ultra exclusive tanpa UI library berat

## Cara jalan lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Setup Supabase

1. Buat project Supabase.
2. Buka SQL Editor.
3. Jalankan `supabase/schema.sql`.
4. Buka Authentication > Providers > Email.
5. Matikan `Confirm email` supaya user bisa daftar lalu langsung login tanpa konfirmasi email.
6. Isi env berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

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

Untuk production di Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://domain-kamu.vercel.app
IPAYMU_PRODUCTION=true
```

Callback URL yang dipakai aplikasi:

```txt
/api/payment/ipaymu/callback
```

## Deploy ke Vercel

1. Push folder ini ke GitHub.
2. Import repository ke Vercel.
3. Tambahkan semua environment variables.
4. Deploy.

## Fitur yang sudah ada

- Landing page modern, responsif, animasi CSS.
- Katalog 40 template: 20 standar/gratis dan 20 premium.
- Semua template bisa preview tanpa login.
- Template premium terkunci saat publish sampai pembayaran sukses.
- Register/login email, username, password.
- Dashboard user.
- Admin dashboard untuk monitoring undangan dan order.
- Form undangan lengkap.
- Upload 6–8 foto lewat Supabase Storage.
- Public invitation page `/u/[slug]`.
- Edit invitation `/edit/[id]`.
- Masa aktif undangan 30 hari.
- RSVP dan ucapan.
- Backsound aman berupa chime lokal, plus opsi custom URL.
- Watermark hanya untuk gratis.
- Premium no watermark.
- Premium automatic payment via iPaymu + custom manual via WhatsApp admin.

## Catatan produksi penting

- File audio bawaan adalah chime pendek buatan lokal, bukan lagu populer/copyright.
- Untuk musik komersial, pakai royalty-free atau minta user menjamin hak pakai.
- Endpoint callback iPaymu dibuat fleksibel, tapi tetap perlu diuji di sandbox iPaymu dengan akun kamu.
- Admin role disetel manual lewat SQL agar aman.
- Supabase Storage bucket dibuat public untuk foto undangan.
