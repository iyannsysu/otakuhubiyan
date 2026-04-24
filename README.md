# OtakuHub Stream

Website anime streaming modern yang ringan di HP, dengan update harian, subtitle multi-bahasa dari sumber, watchlist & riwayat menonton yang tersinkron antar perangkat, serta PWA yang bisa di-install.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (OKLCH design tokens) + komponen custom shadcn-style
- **AniList GraphQL** untuk metadata, trending, seasonal, dan airing schedule
- **Consumet API** sebagai agregator streaming provider (Zoro / Gogoanime / AnimePahe)
- **Artplayer + hls.js** untuk video player dengan HLS & soft subtitle
- **Auth.js v5 (NextAuth)** + Google OAuth + Prisma Adapter
- **Prisma** + **PostgreSQL** untuk watchlist & history
- **PWA** via Next.js Metadata API (`manifest.ts`)

## Fitur

- Halaman Home dengan hero auto-play, row trending/seasonal/popular/update
- Detail anime: sinopsis, genre, karakter, rekomendasi, daftar episode
- Halaman Watch: player HLS dengan subtitle, next/prev episode, auto-save progress
- Search dengan filter genre / musim / tahun / format
- Jelajah: trending, populer, seasonal
- Jadwal rilis 7 hari ke depan (berdasarkan timezone user)
- Watchlist & Riwayat tonton (login Google)
- Dark mode (default gelap)
- PWA — bisa di-install di HP, start_url ke Home
- Bottom nav di mobile, top nav di desktop
- Image optimization (next/image), lazy rows (Suspense), reduced client JS

## Menjalankan secara lokal

```bash
pnpm install
cp .env.example .env.local
# Isi AUTH_SECRET, DATABASE_URL, dan (opsional) Google OAuth creds
pnpm prisma generate
pnpm prisma db push   # kalau DATABASE_URL sudah ada
pnpm dev
```

Tanpa `DATABASE_URL` dan Google creds, aplikasi tetap jalan (browse/search/watch berfungsi), fitur login & watchlist nonaktif.

## Environment variables

Lihat `.env.example`. Yang paling penting:

| Name | Deskripsi |
|---|---|
| `NEXT_PUBLIC_CONSUMET_URL` | Base URL instance Consumet self-hosted (default public demo bisa rate-limit) |
| `AUTH_SECRET` | Secret untuk Auth.js (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth client dari Google Cloud Console |
| `DATABASE_URL` | Postgres connection string |

## Deploy ke Vercel

1. Push repo ke GitHub
2. Import di [vercel.com/new](https://vercel.com/new)
3. Tambahkan env vars di project settings
4. Set build command default (`next build`). `prisma generate` jalan otomatis pre-build lewat `pnpm` hook.

Aktifkan **Vercel Cron** (opsional) untuk warm cache schedule harian:
```json
// vercel.json
{
  "crons": [{ "path": "/api/schedule", "schedule": "0 0 * * *" }]
}
```

## Catatan legal

Aplikasi ini **tidak meng-host konten video**. Semua stream berasal dari Consumet API yang meng-agregasi dari provider pihak ketiga. Metadata berasal dari AniList.co. Untuk penggunaan komersial, gunakan sumber lisensi resmi (Crunchyroll, Bstation, Bilibili) dan patuhi TOS masing-masing.
