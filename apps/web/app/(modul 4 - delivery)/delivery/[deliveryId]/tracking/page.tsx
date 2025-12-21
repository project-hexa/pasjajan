"use client";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { TrackingNotificationListener } from "../../../_components/tracking-notification-listener";
import { useState, useEffect } from "react";
import { getTrackingDataAction } from "@/app/actions/order.actions";

export default function TrackingPage() {
  const router = useRouter();
  const params = useParams();
  const deliveryId = Number(params.deliveryId);

  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [accessState, setAccessState] = useState<'granted' | 'auth_required' | 'payment_required'>('granted');

  useEffect(() => {
    if (!deliveryId) return;

    // Fetch initial data
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTrackingDataAction(deliveryId);

        // Handle Redirects (Auth / Payment checks)
        if (data && 'redirect' in data) {
          const redirectUrl = (data as any).redirect;
          if (redirectUrl === '/login') setAccessState('auth_required');
          else if (redirectUrl === '/catalogue') setAccessState('payment_required');
          setLoading(false);
          return;
        }

        setTrackingData(data);
        setAccessState('granted');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 5 seconds to keep UI live
    const interval = setInterval(async () => {
      if (accessState !== 'granted') return; // Don't poll if no access

      const data = await getTrackingDataAction(deliveryId);

      if (data && 'redirect' in data) {
        // If status changes to invalid mid-session (e.g. token expired)
        const redirectUrl = (data as any).redirect;
        if (redirectUrl === '/login') setAccessState('auth_required');
        else if (redirectUrl === '/catalogue') setAccessState('payment_required');
        return;
      }

      if (data) setTrackingData(data);
    }, 5000);

    return () => clearInterval(interval);
  }, [deliveryId, accessState]); // Depend on accessState to stop polling loop logic if needed

  const handlePesananSelesai = () => {
    router.push("/delivery/1/rating");
  };

  const currentStatus = trackingData?.status_utama || "";

  // Logic Status:
  // 0: Pesanan dibuat (Always active)
  // 1: Sedang dikirim (DIKIRIM)
  // 2: Kurir menerima (MENCARI_DRIVER / MENUNGGU_KURIR passed?)
  // 3: Tiba di tujuan (SAMPAI_TUJUAN / SELESAI)

  // Mapping Status ke Progress Bar
  let activeStepIndex = 0;
  if (["MENCARI_DRIVER", "MENUNGGU_KURIR", "DIKIRIM", "SAMPAI_TUJUAN", "SELESAI"].includes(currentStatus)) activeStepIndex = 0; // Created
  if (["DIKIRIM", "SAMPAI_TUJUAN", "SELESAI"].includes(currentStatus)) activeStepIndex = 1; // Shipped
  if (["SAMPAI_TUJUAN", "SELESAI"].includes(currentStatus)) activeStepIndex = 2; // Courier Received? (Logic slightly ambiguous in mockup vs real world, assuming flow)
  // Note: Based on mockup icons:
  // 1. Box check (Dibuat)
  // 2. Truck (Sedang Dikirim)
  // 3. Hand receiving (Kurir Menerima / Sampai?) -> "Kurir Menerima" usually means "Courier picked up", which happens BEFORE "Sedang Dikirim" or same time.
  //    Let's adjust standard flow: Dibuat -> Menunggu Kurir -> Dikirim -> Sampai.

  // Re-mapping for standard flow:
  // 1. Pesanan Dibuat (Default)
  // 2. Sedang Dikirim (DIKIRIM)
  // 3. Kurir Menerima (This label is confusing, usually "Diterima Pembeli"). If it means "Buyer Received", then SAMPAI_TUJUAN.
  // 4. Tiba di Tujuan / Selesai (SELESAI)

  // Let's stick to the mockup labels but map logically:
  if (currentStatus === "DIKIRIM") activeStepIndex = 1;
  if (currentStatus === "SAMPAI_TUJUAN") activeStepIndex = 2; // Assuming "Kurir Menerima" means "Arrived/Handover"
  if (currentStatus === "SELESAI") activeStepIndex = 3;

  const steps = [
    {
      icon: <Image src="/img/icon-proses-1.png" alt="Pesanan dibuat" width={32} height={32} className="h-8 w-8" />,
      label: "Pesanan dibuat",
      active: true,
    },
    {
      icon: <Image src="/img/icon-proses-2.png" alt="Sedang dikirim" width={32} height={32} className="h-8 w-8" />,
      label: "Sedang dikirim",
      active: activeStepIndex >= 1,
    },
    {
      icon: <Image src="/img/icon-proses-3.png" alt="Kurir menerima" width={32} height={32} className="h-8 w-8" />,
      label: "Kurir menerima",
      active: activeStepIndex >= 2,
    },
    {
      icon: <Image src="/img/icon-proses-4.png" alt="Tiba di tujuan" width={32} height={32} className="h-8 w-8" />,
      label: "Tiba di tujuan",
      active: activeStepIndex >= 3,
    },
  ];

  const lastActiveIndex = steps.findLastIndex((step) => step.active);
  const totalSegments = steps.length - 1;

  // Progress Bar Width Calculation
  const progressPercentage = (lastActiveIndex / totalSegments) * 100;

  if (accessState === 'auth_required') {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 flex items-center justify-center rounded-full bg-[#1E6A46] p-8 shadow-lg">
            <Image src="/logo-footer.png" alt="Login Required" width={150} height={100} className="object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Anda Belum Login</h2>
          <p className="text-gray-600 mb-6 max-w-md">Silahkan login terlebih dahulu untuk melacak status pesanan Anda.</p>
          <button onClick={() => router.push('/login')} className="px-8 py-3 bg-[#1E6A46] text-white rounded-xl font-semibold hover:bg-[#155436] transition-all">
            Masuk Sekarang
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (accessState === 'payment_required') {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 flex items-center justify-center rounded-full bg-[#1E6A46] p-8 shadow-lg">
            <Image src="/logo-footer.png" alt="Payment Required" width={150} height={100} className="object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Menunggu Pembayaran</h2>
          <p className="text-gray-600 mb-6 max-w-md">Pesanan ini menunggu pembayaran. Silahkan selesaikan Checkout Anda di katalog.</p>
          <button onClick={() => router.push('/catalogue')} className="px-8 py-3 bg-[#1E6A46] text-white rounded-xl font-semibold hover:bg-[#155436] transition-all">
            Checkout Sekarang
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <TrackingNotificationListener orderId={Number(deliveryId)} />
      <Navbar />

      <section className="mx-12 mt-8 rounded-2xl border border-[#CDE6D5] bg-[#EEF7F0] p-10 pb-16">
        <div className="relative flex justify-between items-start">
          {/* Background Line */}
          <div className="absolute top-12 right-[10%] left-[10%] z-10 h-[4px] bg-[#8AC79E]"></div>

          {/* Active Progress Line */}
          <div className="absolute left-[10%] right-[10%] top-12 h-[4px] z-11 flex">
            <div
              className="h-full bg-[#0A6B3C] transition-all duration-700 ease-out"
              style={{ width: `${(lastActiveIndex / 3) * 100}%` }}
            ></div>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center w-1/4 text-center z-20">
              {step.icon}
              <div
                className={`absolute h-5 w-5 rounded-full transition-colors duration-500 ${step.active ? "bg-[#0A6B3C]" : "bg-[#8AC79E]"} `}
                style={{ top: "48px", transform: "translateY(-50%)" }}
              ></div>
              <p className={`text-sm font-semibold mt-16 transition-colors duration-500 ${step.active ? "text-[#0A6B3C]" : "text-[#8AC79E]"}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xl font-bold text-[#0A6B3C]">
          {currentStatus === "SAMPAI_TUJUAN" || currentStatus === "SELESAI" ? "Pesanan Selesai" : ""}
        </p>
      </section>

      <section className="mx-12 mt-6 min-h-52 rounded-xl border border-[#CDE6D5] p-8">
        <h2 className="text-xl font-bold text-black">Status Pengiriman Barang</h2>
        <hr className="my-4 border-t-2 border-gray-400" />
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            trackingData?.timeline?.map((log: any, index: number) => (
              <div key={index} className="flex items-start">
                <div className="mr-4 flex flex-col items-center">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 bg-[#1E6A46]`}></div>
                  {index < trackingData.timeline.length - 1 && (
                    <div className="mt-1 h-16 w-0.5 bg-[#8AC79E]"></div>
                  )}
                </div>
                <div className="flex-1 -mt-1">
                  <p className="font-semibold text-[#1E6A46]">
                    {log.status} – {log.tanggal}
                  </p>
                  <p className="mt-1 leading-relaxed text-gray-700">
                    {log.keterangan} <span className="text-gray-500 text-sm block">{log.jam}</span>
                  </p>
                </div>
              </div>
            ))
          )}
          {!loading && (!trackingData?.timeline || trackingData.timeline.length === 0) && (
            <p className="text-gray-500 italic">Belum ada riwayat pengiriman.</p>
          )}
        </div>
      </section>

      <section className="mx-12 mt-8 flex items-center justify-end gap-4">
        {/* Button Terima Pesanan: Visible ONLY if order is finished/Arrived */}
        {(currentStatus === "SAMPAI_TUJUAN" || currentStatus === "SELESAI") && (
          <button
            type="button"
            onClick={() => router.push(`/delivery/${deliveryId}/rating`)}
            className="rounded-lg border-2 border-[#1E6A46] bg-white px-8 py-3 font-semibold text-[#1E6A46] transition-all hover:bg-[#F0F7F3]"
          >
            Terima Pesanan
          </button>
        )}

        {/* Button Pesanan Selesai: Visible if NOT finished yet */}
        {currentStatus !== "SAMPAI_TUJUAN" && currentStatus !== "SELESAI" && (
          <button
            type="button"
            onClick={() => {
              // Optimistically update status to show the other button
              // In a real app, this should call an API to mark as delivered/received
              setTrackingData((prev: any) => ({ ...prev, status_utama: 'SAMPAI_TUJUAN' }));
            }}
            className="hover:bg-opacity-90 rounded-lg bg-[#1E6A46] px-8 py-3 font-semibold text-white transition-all"
          >
            Pesanan Selesai
          </button>
        )}
      </section>

      <Footer />
    </div>
  );
}