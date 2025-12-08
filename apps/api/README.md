# PasJajan-Mart API - Panduan Setup Ringkas

Dokumentasi untuk menjalankan dan mengembangkan API aplikasi ini

## Daftar isi
- [Konfigurasi environment (.env)](#konfigurasi-environment)
- [Referensi](#referensi)

## Konfigurasi environment
- Pastikan untuk membuat salinan `.env.example` di direktori API ini

```bash
cp .env.example .env

```

- Lalu agar fitur kirim email dan login google dapat berjalan lancar, harap jalankan command berikut:

```bash
# Command ini akan menghasilkan .env dari .env.encrypted,
# dengan isi dari file .env.example ditambah beberapa variabel konfigurasi
# yang berguna untuk keperluan kirim email & login google
php artisan env:decrypt
```

- Setelah itu masukkan kode berikut sebagai descryption key

```
base64:ReiRyVydk9y+xqy9P2MAY2VAQomxz3HL6KR7uKlastk=
```

- Untuk info lebih lanjut tentang enkripsi-deskripsi file environment, lihat: [Enkripsi file environtment](https://laravel.com/docs/12.x/configuration#encrypting-environment-files)

## Referensi
- [Dokumentasi laravel](https://laravel.com/docs/12.x)
