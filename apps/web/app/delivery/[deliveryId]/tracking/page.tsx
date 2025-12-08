"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navigation-bar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TrackingPage() {
  const router = useRouter();

  const handlePesananSelesai = () => {
    router.push("/delivery/1/rating");
  };

  const steps = [
    {
      icon: <Image src="/img/icon-proses-1.png" alt="Pesanan dibuat" width={32} height={32} className="h-8 w-8" />,
      label: "Pesanan dibuat",
      active: true,
    },
    {
      icon: <Image src="/img/icon-proses-2.png" alt="Sedang dikirim" width={32} height={32} className="h-8 w-8" />,
      label: "Sedang dikirim",
      active: true,
    },
    {
      icon: <Image src="/img/icon-proses-3.png" alt="Kurir menerima" width={32} height={32} className="h-8 w-8" />,
      label: "Kurir menerima",
      active: true,
    },
    {
      icon: <Image src="/img/icon-proses-4.png" alt="Tiba di tujuan" width={32} height={32} className="h-8 w-8" />,
      label: "Tiba di tujuan",
      active: true,
    },
  ];

  const statusUpdates = [
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan",
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan",
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan",
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan",
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan",
    },
    {
      active: true,
      title: "PasJajan – Senin, 7 November 2025",
      description: "Verifikasi Konfirmasi Pembayaran. Pembayaran telah diterima Pasjajan dan pesanan sedang disiapkan",
    },
  ];

  const lastActiveIndex = steps.findLastIndex((step) => step.active);
  const totalSegments = steps.length - 1;
  const progressPercentage = (lastActiveIndex / totalSegments) * 80;

  const supportLinks = ["Tentang Kami", "Keamanan dan Privasi"];
  const faqList = [
    "Apa itu PasJajan?", "Bagaimana cara berbelanja", "di PasJajan?",
    "Metode pembayaran apa", "saja yang", "tersedia di PasJajan?",
    "Bagaimana cara melacak", "status pesanan saya?",
  ];

  const socialLinks = [
    { name: "Instagram", icon: (<svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>) },
    { name: "Facebook", icon: (<svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 4.16v1.972h3.618l-.298 3.667h-3.32v7.98h-5.018z" /></svg>) },
    { name: "TikTok", icon: (<svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>) },
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <section className="mx-12 mt-8 rounded-2xl border border-[#CDE6D5] bg-[#EEF7F0] p-10 pb-16">
        <div className="relative flex justify-between items-start">
          <div className="absolute top-12 right-[10%] left-[10%] z-10 h-[4px] bg-[#8AC79E]"></div>
          <div
            className="absolute left-[10%] top-12 h-[4px] bg-[#0A6B3C] z-11"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center w-1/4 text-center">
              {step.icon}
              <div
                className={`absolute z-20 h-5 w-5 rounded-full ${step.active ? "bg-[#0A6B3C]" : "bg-[#8AC79E]"} `}
                style={{ top: "48px", transform: "translateY(-50%)" }}
              ></div>
              <p className={`text-sm font-semibold mt-16 ${step.active ? "text-[#0A6B3C]" : "text-[#8AC79E]"}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xl font-bold text-[#0A6B3C]">
          Pesanan Selesai
        </p>
      </section>

      <section className="mx-12 mt-6 min-h-52 rounded-xl border border-[#CDE6D5] p-8">
        <h2 className="text-xl font-bold text-black">Status Pengiriman Barang</h2>
        <hr className="my-4 border-t-2 border-gray-400" />
        <div className="flex flex-col gap-4">
          {statusUpdates.map((status, index) => (
            <div key={index} className="flex items-start">
              <div className="mr-4 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 ${status.active ? "bg-[#1E6A46]" : "bg-[#CDE6D5]"}`}></div>
                {index < statusUpdates.length - 1 && (
                  <div className="mt-1 h-16 w-0.5 bg-[#8AC79E]"></div>
                )}
              </div>
              <div className="flex-1 -mt-1">
                <p className={`font-semibold ${status.active ? "text-[#1E6A46]" : "text-[#B0CFC0]"}`}>
                  {status.title}
                </p>
                <p className={`mt-1 leading-relaxed ${status.active ? "text-gray-700" : "text-gray-400"}`}>
                  {status.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-12 mt-8 flex items-center justify-end gap-4">
        <button type="button" className="rounded-lg border-2 border-[#1E6A46] bg-white px-8 py-3 font-semibold text-[#1E6A46] transition-all hover:bg-[#F0F7F3]">
          Terima Pesanan
        </button>
        {/* --- TOMBOL YANG DIUPDATE --- */}
        <button 
          type="button" 
          onClick={handlePesananSelesai}
          className="hover:bg-opacity-90 rounded-lg bg-[#1E6A46] px-8 py-3 font-semibold text-white transition-all"
        >
          Pesanan Selesai
        </button>
      </section>

      <Footer />
    </div>
  );
}