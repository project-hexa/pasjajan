# PasJajan-Mart API - Panduan Setup Ringkas

Dokumentasi untuk menjalankan dan mengembangkan API aplikasi ini

## Daftar isi

- [Konfigurasi environment (.env)](#konfigurasi-environment)
- [Referensi](#referensi)

## Konfigurasi environment

- agar fitur kirim email, login google, midtrans dapat berjalan lancar, harap jalankan command berikut:

```bash
# Command ini akan menghasilkan .env dari .env.encrypted jadi jika sudah ada .env tolong hapus terlebih dahulu,
# dengan isi dari file .env.example ditambah beberapa variabel konfigurasi
# yang berguna untuk keperluan kirim email ,login google dan
php artisan env:decrypt
```

- Setelah itu masukkan kode decryption key (kode ada di grup)

- Agar fitur **Midtrans**, **Kirim Email (OTP)**, dan **Login Google** dapat berjalan dengan baik, pastikan variabel-variabel berikut sudah ditambahkan ke file `.env` Anda (nilai credential bisa didapat dari file `.env.encrypted`):
    - **Midtrans**: `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`, `MIDTRANS_IS_SANITIZED`, `MIDTRANS_IS_3DS`
    - **Google OAuth**: `GOOGLE_CLIENT_ID`
    - **Email SMTP**: `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`
- Variabel lain seperti appkey, db bisa disesuaikan sendiri

- Untuk info lebih lanjut tentang enkripsi-deskripsi file environment, lihat: [Enkripsi file environtment](https://laravel.com/docs/12.x/configuration#encrypting-environment-files)

## Referensi

- [Dokumentasi Laravel](https://laravel.com/docs/12.x)
