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