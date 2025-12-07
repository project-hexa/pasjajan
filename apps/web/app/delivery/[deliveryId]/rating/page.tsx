"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navigation-bar";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Data untuk Footer
  const supportLinks = ["Tentang Kami", "Keamanan dan Privasi"];

  const paymentMethods = [
    "BCA",
    "BNI",
    "BRI",
    "QRIS",
    "Mandiri",
    "Permata Bank",
    "Shopee Pay",
    "Gopay",
  ];
  const faqList = [
    "Apa itu PasJajan?",
    "Bagaimana cara berbelanja",
    "di PasJajan?",
    "Metode pembayaran apa",
    "saja yang",
    "tersedia di PasJajan?",
    "Bagaimana cara melacak",
    "status pesanan saya?",
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 4.16v1.972h3.618l-.298 3.667h-3.32v7.98h-5.018z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
  ];


  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  return (
    <div className="min-h-screen bg-[#EEF7F0] font-sans">
      <Navbar />

      {/* ========================================== */}
      {/* ||            KONTEN UTAMA              || */}
      {/* ========================================== */}
      <main className="max-w-6xl mx-auto py-10 px-4">
        
        {/* Judul Halaman */}
        <h1 className="text-3xl font-bold text-black mb-6">Ulasan</h1>

        {/* Baris Atas: Pengirim & Rating */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Kartu Pengirim */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-black">Pengirim</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <span className="font-semibold text-black">Sugeng</span>
              </div>
              {/* Ikon WhatsApp */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600 cursor-pointer">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.14 19.77 7.88 19.02L7.58 18.84L4.46 19.66L5.29 16.62L5.1 16.32C4.28 15.02 3.85 13.48 3.85 11.91C3.85 7.4 7.53 3.72 12.05 3.72C14.25 3.72 16.31 4.58 17.87 6.13C19.42 7.69 20.28 9.75 20.28 11.92C20.28 16.44 16.59 20.16 12.05 20.16ZM16.56 14.49C16.31 14.37 15.1 13.77 14.88 13.69C14.66 13.61 14.5 13.57 14.34 13.81C14.18 14.05 13.73 14.58 13.59 14.74C13.45 14.9 13.31 14.92 13.06 14.8C12.81 14.68 12.01 14.42 11.06 13.57C10.32 12.91 9.82 12.1 9.57 11.68C9.32 11.26 9.55 11.03 9.67 10.91C9.78 10.8 9.92 10.63 10.04 10.49C10.16 10.35 10.2 10.25 10.28 10.09C10.36 9.93 10.32 9.79 10.26 9.67C10.2 9.55 9.74 8.42 9.55 7.96C9.36 7.51 9.17 7.57 9.03 7.57C8.9 7.57 8.75 7.56 8.59 7.56C8.43 7.56 8.17 7.62 7.95 7.86C7.73 8.1 7.11 8.68 7.11 9.86C7.11 11.04 7.97 12.18 8.09 12.34C8.21 12.5 9.81 14.97 12.26 16.03C12.84 16.28 13.3 16.43 13.66 16.54C14.27 16.74 14.83 16.71 15.27 16.65C15.76 16.58 16.78 16.03 16.99 15.44C17.2 14.85 17.2 14.35 17.14 14.25C17.08 14.15 16.81 14.1 16.56 13.98V14.49Z" />
              </svg>
            </div>
          </div>

          {/* Kartu Rating (Lebih Lebar) */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <h3 className="font-bold text-lg mb-2 text-black">Seberapa Puas Anda?</h3>
            <div className="flex gap-4 mt-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  onClick={() => handleStarClick(index)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={index < rating ? "#FFD700" : "none"} // Kuning jika aktif, kosong jika tidak
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-10 h-10 cursor-pointer transition-colors ${index < rating ? "text-yellow-400" : "text-yellow-500"}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Input Ulasan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-lg mb-4 text-black">Berikan Ulasan</h3>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-black"
            placeholder="Masukkan ulasan"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
        </div>

        {/* Tombol Kirim */}
        <div className="flex justify-end">
          <button 
            className="px-10 py-3 bg-[#1E8150] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-md"
          >
            Kirim
          </button>
        </div>

      </main>


      {/* ========================================== */}
      {/* ||               FOOTER                 || */}
      {/* ========================================== */}
      <footer className="mt-16 w-full border-t border-white/20 bg-[#125635]">
        <div className="relative isolate mx-auto max-w-[1920px] overflow-hidden px-6 pb-16 pt-20 text-white sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="hidden h-full w-full lg:block">
              <div
                aria-hidden
                className="absolute"
                style={{
                  width: 2303, //
                  height: 839,
                  top: -484, //
                  left: -653,
                  borderRadius: 302,
                  background: "#FFFFFF",
                  zIndex: 1,
                }}
              />
              <div
                aria-hidden
                className="absolute"
                style={{
                  width: 1393, //
                  height: 957,
                  top: -642, //
                  left: -850,
                  borderRadius: 302,
                  background: "#125635",
                  zIndex: 3,
                }}
              />
              <div
                aria-hidden
                className="absolute"
                style={{
                  width: 1430, //
                  height: 540,
                  top: -305, //
                  left: -760,
                  borderRadius: 302,
                  background: "#FDDE13",
                  zIndex: 2,
                }}
              />
            </div>

            <div className="h-full w-full lg:hidden">
              <div
                aria-hidden
                className="absolute -left-2/3 inset-y-0 w-[160%] rounded-r-full bg-[#125635]"
                style={{ zIndex: 3 }}
              />
              <div
                aria-hidden
                className="absolute -top-24 right-[20%] h-64 w-64 rounded-full bg-[#FDDE13]"
                style={{ zIndex: 2 }}
              />
              <div
                aria-hidden
                className="absolute -right-[35%] bottom-[-35%] h-72 w-[120%] rounded-t-[240px] bg-[#125635]"
                style={{ zIndex: 2 }}
              />
              <div
                aria-hidden
                className="absolute -top-[18%] -left-[15%] h-[140%] w-[140%] rounded-[220px] bg-white"
                style={{ zIndex: 1 }}
              />
            </div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-full flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-6 text-white md:ml-12 md:max-w-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                  <Image
                    src="/img/logo3.png"
                    alt="PasJajan"
                    width={112}
                    height={112}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
              </div>
              <p className="text-lg font-semibold leading-relaxed md:text-xl">
                Solusi Belanja Kelontong
                <span className="block">dalam Genggaman.</span>
              </p>
            </div>

            <div className="flex flex-col gap-10 text-[#0A1F14] md:ml-auto md:flex-row md:gap-12 lg:gap-16">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-[#111827]">Bantuan</h3>
                <ul className="space-y-2 text-sm text-[#1F2937]">
                  {supportLinks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-5">
                <h3 className="text-lg font-semibold text-[#111827]">FAQ</h3>
                <ul className="space-y-2 text-sm text-[#1F2937]">
                  {faqList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-[#111827]">Ikuti kami</h3>
                <div className="flex items-center gap-4 md:justify-end">
                  {socialLinks.map(({ name, icon }) => (
                    <button
                      key={name}
                      type="button"
                      aria-label={name}
                      className="text-[#111827] transition-colors hover:text-[#125635]"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#125635] py-1">
          <p className="text-center text-xs font-medium text-white">© 2025 PasJajan – All Right Reserved</p>
        </div>
      </footer>
    </div>
  );
}