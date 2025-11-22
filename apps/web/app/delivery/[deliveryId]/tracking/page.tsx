// Lokasi file: apps/web/app/(delivery)/[deliveryId]/tracking/page.tsx

"use client";

// Import lucide-react (Package, Truck, etc.) SUDAH DIHAPUS
import React from "react"; // Penting untuk file .tsx

// Ganti nama fungsinya menjadi "Page"
export default function Page() { 

  // ======================================================
  // ||     PERUBAHAN: Ikon diubah menjadi <img>         ||
  // ======================================================
  const steps = [
    { 
      icon: <img src="/img/icon-proses-1.png" alt="Pesanan dibuat" className="w-8 h-8" />, 
      label: "Pesanan dibuat", 
      active: true 
    },
    { 
      icon: <img src="/img/icon-proses-2.png" alt="Sedang dikirim" className="w-8 h-8" />, 
      label: "Sedang dikirim", 
      active: true 
    },
    { 
      icon: <img src="/img/icon-proses-3.png" alt="Kurir menerima" className="w-8 h-8" />, 
      label: "Kurir menerima", 
      active: true // <-- Diubah jadi true
    },
    { 
      icon: <img src="/img/icon-proses-4.png" alt="Tiba di tujuan" className="w-8 h-8" />, 
      label: "Tiba di tujuan", 
      active: true // <-- Diubah jadi true
    },
  ];
  // ======================================================
  // ||                AKHIR PERUBAHAN                   ||
  // ======================================================

  // Data untuk Status Box (BARU)
  const statusUpdates = [
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan"
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan"
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan"
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan"
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan"
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan"
    }
    // Tambahkan status lain di sini
  ];

  // ======================================================
  // ||         PERUBAHAN: Menghitung Garis Aktif        ||
  // ======================================================
  // Cari index terakhir yang aktif
  const lastActiveIndex = steps.findLastIndex(step => step.active);
  // Hitung jumlah segmen garis (3 segmen di antara 4 ikon)
  const totalSegments = steps.length - 1;
  
  // Menghitung persentase lebar garis aktif.
  // Garisnya sendiri memiliki lebar total 80% (karena left-[10%] dan right-[10%]).
  // Jadi, kita hitung (indexAktif / totalSegmen) * 80%
  let progressPercentage = 0;
  if (lastActiveIndex > 0 && totalSegments > 0) {
    // Jika semua aktif (lastActiveIndex == 3), kita buat 100% dari 80% = 80%
    if(lastActiveIndex === totalSegments) {
      progressPercentage = 80;
    } else {
      progressPercentage = (lastActiveIndex / totalSegments) * 80;
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Perubahan hanya ada di bagian "Logo Utama".
        Warna Anda (#1B8150) dan logo Anda (/img/logo2.png) tetap saya gunakan.
      */}
      <header className="bg-[#1B8150] text-white p-4 flex items-center justify-between">
        
        {/* --- BAGIAN KIRI --- */}
        <div className="flex items-center gap-6">
          
          {/* Logo Utama (Sudah Diubah) */}
          <div className="flex flex-col items-center">
            <img 
              src="/img/logo2.png"
              alt="pasjajan" 
              className="h-8"
            />
            {/* INI YANG SAYA TAMBAHKAN */}
            <span className="text-xs font-semibold -mt-0.5">pasjajan</span>
          </div>


          {/* Tombol Kategori */}
          <a href="#" className="flex items-center gap-2 border border-white rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-white hover:text-[#0A6B3C] transition-all">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-5 h-5" // Ukuran sama
            >
              <rect x="3" y="3" width="6" height="6" rx="1.5" />
              <rect x="11" y="3" width="6" height="6" rx="1.5" />
              <rect x="3" y="11" width="6" height="6" rx="1.5" />
              <rect x="11" y="11" width="6" height="6" rx="1.5" />
            </svg>
            <span>Kategori</span>
          </a>



          <div className="flex items-center bg-white rounded-lg px-4 py-2 w-[450px] shadow">
            <input
              type="text"
              placeholder="Cari produk yang anda inginkan"
              className="flex-grow bg-transparent outline-none text-base text-gray-800 placeholder-gray-500"
            />
            {/* Ikon <img> diganti dengan <svg> di bawah */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-5 h-5 ml-3 cursor-pointer text-gray-500" // Ukuran sama, warna abu-abu
            >
              <path 
                fillRule="evenodd" 
                d="M9 3.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>

          <a href="#" className="flex items-center gap-10 font-semibold text-white">
            <span>Promo</span>
            <img 
              src="/img/icon-promo.png" // GANTI DENGAN NAMA FILE IKON PROMO ANDA
              alt="Promo" 
              className="h-8"
            />
          </a>
          {/* ====================================================== */}

        </div>

        {/* --- BAGIAN KANAN --- */}

        <nav className="flex items-center gap-6 text-base">
          
          {/* Garis Pemisah Vertikal BARU (Ditebalkan) */}
          <div className="h-6 w-[2px] bg-white/50"></div> {/* <-- PERUBAHAN DI SINI */}

          {/* Link Daftar (Tidak berubah) */}
          <a href="#" className="font-semibold text-white">Daftar</a>

          {/* Tombol Masuk (Diubah jadi Teks) */}
          <a href="#" className="font-semibold text-white">
            Masuk
          </a>
        </nav>
        {/* ====================================================== */}
        {/* ||                AKHIR PERUBAHAN                   || */}
        {/* ====================================================== */}
      </header>
      {/* ========================================== */}
      {/* ||         AKHIR DARI HEADER          || */}
      {/* ========================================== */}


      {/* ====================================================== */}
      {/* ||         PERUBAHAN PADA TRACKING SECTION        || */}
      {/* ====================================================== */}
      <section className="mx-12 mt-8 bg-[#EEF7F0] border border-[#CDE6D5] rounded-2xl p-10 pb-16"> {/* Padding bawah ditambah */}

        {/* Wrapper wajib relative agar absolute bekerja */}
        <div className="relative flex justify-between items-start"> {/* Diubah ke items-start */}
        
          {/* ====================================================== */}
          {/* ||       PERUBAHAN: Posisi top diubah ke top-12     || */}
          {/* ====================================================== */}
          <div className="absolute left-[10%] right-[10%] top-12 h-[4px] bg-[#8AC79E] z-10"></div>

          {/* Garis Aktif ditambahkan */}
          <div 
            className="absolute left-[10%] top-12 h-[4px] bg-[#0A6B3C] z-11" // top-12
            style={{ width: `${progressPercentage}%` }}
          ></div>
          {/* ====================================================== */}


          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center w-1/4 text-center"> {/* Hapus gap-3 */}
              
              {/* Bulatan icon w-16 h-16 SUDAH DIHAPUS */}
              
              {/* Ikon img ditampilkan langsung */}
              {step.icon} 
              
              {/* ====================================================== */}
              {/* || PERUBAHAN: border-4 DIHAPUS, top diubah ke 48px || */}
              {/* ====================================================== */}
              <div
                className={`absolute w-5 h-5 rounded-full z-20
                  ${step.active ? "bg-[#0A6B3C]" : "bg-[#8AC79E]"}
                `}
                style={{
                  top: "48px", // Diubah dari 40px ke 48px
                  transform: "translateY(-50%)", 
                }}
              ></div>
              {/* ====================================================== */}

              {/* Text - margin atas disesuaikan */}
              <p className={`text-sm font-semibold mt-16 ${ // Diubah dari mt-14 ke mt-16
                step.active ? "text-[#0A6B3C]" : "text-[#8AC79E]"
              }`}>
                {step.label}
              </p>
            </div>
          ))}

        </div>

        {/* ====================================================== */}
        {/* ||         PERUBAHAN: Judul Status diubah           || */}
        {/* ====================================================== */}
        <p className="text-[#0A6B3C] text-xl font-bold text-center mt-8">
          Pesanan Selesai
        </p>
        {/* ====================================================== */}

      </section>
      {/* ====================================================== */}
      {/* ||              AKHIR TRACKING SECTION              || */}
      {/* ====================================================== */}


      {/* ====================================================== */}
      {/* ||         PERUBAHAN: STATUS BOX Diubah Total       || */}
      {/* ====================================================== */}
      <section className="mx-12 mt-6 border border-[#CDE6D5] rounded-xl p-8 min-h-52">
        <h2 className="text-xl font-bold text-black">
          Status Pengiriman Barang
        </h2>

        {/* Garis Pemisah (Sudah ditebalkan) */}
        <hr className="my-4 border-t-2 border-gray-400" />

        {/* Konten Status Timeline */}
        <div className="flex flex-col gap-4"> {/* Wrapper untuk semua status */}

          {statusUpdates.map((status, index) => (
            <div key={index} className="flex items-start">
              {/* Kolom Kiri: Titik dan Garis */}
              <div className="flex flex-col items-center mr-4">
                {/* Titik */}
                <div className={`w-5 h-5 rounded-full flex-shrink-0 ${
                  status.active ? "bg-[#1E6A46]" : "bg-[#CDE6D5]"
                }`}></div>
                
                {/* ====================================================== */}
                {/* ||    PERUBAHAN: Garis diubah jadi lebih hijau      || */}
                {/* ====================================================== */}
                {index < statusUpdates.length - 1 && (
                  <div className="w-0.5 h-16 bg-[#8AC79E] mt-1"></div>
                )}
                {/* ====================================================== */}
              </div>

              {/* Kolom Kanan: Teks */}
              <div className="flex-1 -mt-1">
                <p className={`font-semibold ${
                  status.active ? "text-[#1E6A46]" : "text-[#B0CFC0]"
                }`}>
                  {status.title}
                </p>
                <p className={`mt-1 leading-relaxed ${
                  status.active ? "text-gray-700" : "text-gray-400"
                }`}>
                  {status.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>
      {/* ====================================================== */}
      {/* ||             AKHIR DARI STATUS BOX                || */}
      {/* ====================================================== */}


      {/* ====================================================== */}
      {/* ||          PERUBAHAN: Tombol Selesai DITAMBAHKAN     || */}
      {/* ====================================================== */}
      <section className="mx-12 mt-8 flex justify-end items-center gap-4">
        {/* Tombol "asdfasdfa" (sesuai gambar) */}
        <button 
          type="button"
          className="px-8 py-3 bg-white text-[#1E6A46] font-semibold rounded-lg border-2 border-[#1E6A46] hover:bg-[#F0F7F3] transition-all"
        >
          Terima Pesanan
        </button>

        {/* Tombol "Pesanan Selesai" */}
        <button 
          type="button"
          className="px-8 py-3 bg-[#1E6A46] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all"
        >
          Pesanan Selesai
        </button>
      </section>
      {/* ====================================================== */}


      {/* FOOTER */}
      <footer className="bg-[#1B8150] text-white p-10 mt-12">
        <div className="grid grid-cols-4 gap-8 text-sm">
          
          <div>
            {/* Logo (Bukan Button) & Teks "pasjajan" (Lebih presisi) */}
            <div className="flex flex-col items-center"> 
              <img src="/img/logo2.png" className="w-36" alt="PasJajan" />
              {/* Teks "pasjajan" dibuat lebih presisi & centered */}
              <span className="text-xl font-semibold mt-1">pasjajan</span> 
            </div>
          </div>


          {/* ====================================================== */}
          {/* ||       PERUBAHAN: "Hubungi kami" ditambahkan      || */}
          {/* ====================================================== */}
          <div>
            <p className="font-semibold mb-2">Ikuti kami</p>
            <div className="flex gap-3">
              {/* Ikon Sosmed */}
              <a href="#" className="transition-opacity hover:opacity-80">
                <img 
                  src="/img/ig.png" // GANTI DENGAN NAMA FILE IKON IG ANDA
                  alt="Instagram" 
                  className="w-6 h-6" // Atur ukuran ikon
                />
              </a>
              <a href="#" className="transition-opacity hover:opacity-80">
                <img 
                  src="/img/tiktok.png" // GANTI DENGAN NAMA FILE IKON TIKTOK ANDA
                  alt="TikTok" 
                  className="w-6 h-6" // Atur ukuran ikon
                />
              </a>
            </div>

            {/* Hubungi Kami (BARU DITAMBAHKAN) */}
            <div className="mt-4"> {/* Jarak dari ikon sosmed */}
              <p className="font-semibold mb-2">Hubungi kami</p>
              <a href="mailto:Pasjajan@gmail.com" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                {/* Ikon Email SVG */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-5 h-5"
                >
                  <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                </svg>
                <span className="underline">Pasjajan@gmail.com</span>
              </a>
            </div>
          </div>
          {/* ====================================================== */}


          {/* ====================================================== */}
          {/* ||     PERUBAHAN: Metode Pembayaran diubah ke <img>   || */}
          {/* ====================================================== */}
          <div>
            <p className="font-semibold mb-2">Metode Pembayaran</p>
            <div className="flex gap-2 flex-wrap"> {/* flex-wrap agar rapi jika tidak muat */}
              {/* Ganti <span> dengan <img> */}
              <img 
                src="/img/qris.png" // GANTI DENGAN NAMA FILE ANDA
                alt="QRIS" 
                className="h-6" // Atur tinggi ikon
              />
              <img 
                src="/img/shopeepay.png" // GANTI DENGAN NAMA FILE ANDA
                alt="ShopeePay" 
                className="h-6" // Atur tinggi ikon
              />
              <img 
                src="/img/dana.png" // GANTI DENGAN NAMA FILE ANDA
                alt="DANA" 
                className="h-6" // Atur tinggi ikon
              />
              <img 
                src="/img/gopay.png" // GANTI DENGAN NAMA FILE ANDA
                alt="Gopay" 
                className="h-6" // Atur tinggi ikon
              />
              <img 
                src="/img/dana.png" // GANTI DENGAN NAMA FILE ANDA
                alt="OVO" 
                className="h-6" // Atur tinggi ikon
              />
            </div>
          </div>
          {/* ====================================================== */}


          {/* Pengaduan */}
          <div>
            <p className="font-semibold mb-2">Layanan Pengaduan Konsumen</p>
            <p className="text-xs leading-relaxed">
              Direktorat Jenderal Perlindungan Konsumen dan tertib Niaga
              kementerian perdagangan Republik Indonesia
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-10">©2025, PT.PasJajan</p>
      </footer>
    </div>
  );
}