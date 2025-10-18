# Pasjajan-Mart — Panduan Setup & Onboarding (Ringkas)

Dokumentasi untuk menjalankan dan mengembangkan proyek monorepo ini secara lokal.

## ini adalah testing
oke

## Isi singkat
- [Quick start (install & run)](#quick-start)
- [Struktur proyek](#struktur-proyek)
- [Environment & konfigurasi (.env)](#environment-variables)
- [Development](#development)
- [Build & produksi](#build--produksi)
- [Lint / format / test](#lint--format--test)
- [Troubleshooting](#troubleshooting)

## Quick start
1. Pastikan prasyarat terpasang (lihat bagian selanjutnya).
2. Dari root repository jalankan:

```bash
pnpm install

cd apps/api
composer install

cd ..\..
```

3. Jalankan frontend dan backend (lihat bagian "Development").

## Struktur proyek
- `apps/web` — Next.js frontend (TypeScript)
- `apps/api` — Backend (Laravel/PHP)
- `packages/ui` — Shared React UI components
- `packages/*` — konfigurasi bersama (eslint, typescript, dll.)
- Root berisi `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.json` dan skrip workspace

Lihat folder masing-masing untuk README/petunjuk tambahan.

## Prasyarat
- Node.js (LTS direkomendasikan, 22+)
- pnpm (direkomendasikan) — https://pnpm.io/
- PHP (untuk `apps/api`, versi sesuai `composer.json`)
- Composer (untuk dependency PHP)

## Environment variables
Setiap aplikasi mungkin memerlukan file `.env`.
- Buat salinan `.env.example` pada masing-masing paket: `apps/web/.env.local`, `apps/api/.env`.
- Contoh:

```bash
cd apps/api
cp .env.example .env
```

## Development
Berikut beberapa pendekatan — pilih yang sesuai role (FE/BE).

1) Menjalankan per-paket (direkomendasikan saat debugging)

Frontend (Next.js):

```bash
cd apps/web
pnpm dev
```

Backend (Laravel):

```bash
cd apps/api
php artisan serve --host=127.0.0.1 --port=8000
# atau
pnpm dev
# atau
composer dev
```

2) Menjalankan dari root

```bash
# jalankan dev untuk web (menggunakan filter pnpm/turbo)
pnpm dev --filter=web

# jalankan dev untuk api
pnpm dev --filter=api

# jalankan semua service
pnpm dev
```

## Build & produksi
- Build frontend (Next.js):

```bash
cd apps/web
pnpm build
pnpm start
```

- Backend: ikuti prosedur deploy Laravel (migrate, config:cache, queue:restart sesuai kebutuhan)

## Lint / format / test
- Lint (root atau paket):

```bash
pnpm lint
# atau per paket
#web
pnpm lint --filter=web
#api
pnpm lint --filter=api
```

- Format (prettier/eslint --fix):

```bash
pnpm format
```

- Test:

```bash
pnpm test
# atau per paket
#web
pnpm test --filter=web
#api
pnpm test --filter=api
```

Periksa `package.json` masing-masing paket untuk detail skrip.

## Troubleshooting umum
- Masalah pnpm: hapus `node_modules`, jalankan `pnpm store prune` lalu `pnpm install`.

```bash
# dari root
pnpm store prune
pnpm install
```

- Masalah Laravel: jalankan `php artisan key:generate`, cek `storage/` permission, jalankan migrasi `php artisan migrate`.
- Cache Turbo: hapus direktori `.turbo` di root jika build/CI aneh.