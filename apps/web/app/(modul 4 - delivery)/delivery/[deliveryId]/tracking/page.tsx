"use client";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { useNavigate } from "@/hooks/useNavigate";
import { api } from "@/lib/utils/axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// Status notification messages
const statusNotifications: Record<string, string> = {
  PESANAN_DIBUAT: "Pesanan Sedang Dikemas",
  SEDANG_DIKIRIM: "Pesanan Anda Sedang Dikirim",
  KURIR_MENERIMA: "Pesanan Telah Diterima",
  SAMPAI_TUJUAN: "Pesanan Selesai, Beri Penilaian",
  REVIEWED: "Terimakasih Telah Mengulas",
  GAGAL: "Pesanan Gagal",
};

// Toast notification component
function StatusToast({
  message,
  isVisible,
  onClose
}: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-8 z-50 animate-slide-in">
      <div className="flex items-center gap-3 bg-[#1E1E1E] text-white px-6 py-4 rounded-full shadow-lg min-w-[300px]">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F7FFFB] flex items-center justify-center">
          <Image
            src="/img/icon_notif.png"
            alt="Notification"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <span className="font-medium text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const navigate = useNavigate()
  const params = useParams();
  const orderId = params.deliveryId as string;

  const [currentStatus, setCurrentStatus] = useState("PESANAN_DIBUAT");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [failedAtStep, setFailedAtStep] = useState<number | null>(null);
  const [hasReceivedOrder, setHasReceivedOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const previousStatusRef = useRef<string | null>(null);

  // Fetch tracking status from API
  const fetchTrackingStatus = async () => {
    try {
      const response = await api.get(`/delivery/${orderId}/tracking`);
      const data = response.data?.data;
      const newStatus = data?.status || "PESANAN_DIBUAT";

      // Show notification only when status changes (not on first load)
      if (previousStatusRef.current !== null && previousStatusRef.current !== newStatus) {
        setNotificationMessage(statusNotifications[newStatus] || "Status diperbarui");
        setShowNotification(true);

        // Handle failed status
        if (newStatus === "GAGAL") {
          const failStep = data?.failed_at_step;
          setFailedAtStep(failStep !== undefined ? failStep : 2);
        } else {
          setFailedAtStep(null);
        }
      }

      setCurrentStatus(newStatus);
      previousStatusRef.current = newStatus;
      setIsLoading(false);
    } catch (error: any) {
      // Silent fail for 404 - API endpoint not ready yet
      if (error?.response?.status === 404) {
        // Use default status when API not available
        if (previousStatusRef.current === null) {
          previousStatusRef.current = currentStatus;
        }
      }
      setIsLoading(false);
    }
  };

  // Polling: Fetch status every 5 seconds
  useEffect(() => {
    fetchTrackingStatus(); // Initial fetch

    const interval = setInterval(() => {
      fetchTrackingStatus();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  const handleTerimaPesanan = () => {
    setHasReceivedOrder(true);
    // TODO: Call API to confirm order received
  };

  const handlePesananSelesai = () => {
    navigate.push(`/delivery/${orderId}/rating`);
  };

  // Determine step status based on current status and failed step
  const getStepStatus = (index: number): "completed" | "active" | "failed" | "pending" | "after-failed" => {
    if (failedAtStep !== null) {
      if (index < failedAtStep) return "completed";
      if (index === failedAtStep) return "failed";
      return "after-failed"; // Steps after the failed step
    }

    const activeSteps = {
      PESANAN_DIBUAT: [0],
      SEDANG_DIKIRIM: [0, 1],
      KURIR_MENERIMA: [0, 1, 2],
      SAMPAI_TUJUAN: [0, 1, 2, 3],
      REVIEWED: [0, 1, 2, 3],
    };

    const activeIndexes = activeSteps[currentStatus as keyof typeof activeSteps] || [0];
    if (activeIndexes.includes(index)) return "completed";
    return "pending";
  };

  const steps = [
    {
      icon: "/img/icon-proses-1.png",
      label: "Pesanan dibuat",
    },
    {
      icon: "/img/icon-proses-2.png",
      label: "Sedang dikirim",
    },
    {
      icon: "/img/icon-proses-3.png",
      label: "Kurir menerima",
    },
    {
      icon: "/img/icon-proses-4.png",
      label: "Tiba di tujuan",
    },
  ];

  // Get colors based on step status
  const getStepColors = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-[#0A6B3C]", text: "text-[#0A6B3C]", line: "bg-[#0A6B3C]" };
      case "failed":
        return { bg: "bg-red-500", text: "text-red-500", line: "bg-red-500" };
      case "after-failed":
        return { bg: "bg-red-300", text: "text-red-300", line: "bg-red-300" };
      default:
        return { bg: "bg-[#8AC79E]", text: "text-[#8AC79E]", line: "bg-[#8AC79E]" };
    }
  };

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

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      {/* Status Notification Toast */}
      <StatusToast
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />


      <section className="mx-12 mt-8 rounded-2xl border border-[#CDE6D5] bg-[#EEF7F0] p-10 pb-16">
        <div className="relative flex justify-between items-start">
          {/* Background line */}
          <div className="absolute top-12 right-[10%] left-[10%] z-10 h-[4px] bg-[#8AC79E]"></div>

          {/* Progress line segments */}
          {steps.map((_, index) => {
            if (index === steps.length - 1) return null;
            const status = getStepStatus(index);
            const nextStatus = getStepStatus(index + 1);
            const colors = getStepColors(status === "completed" || status === "failed" ? status : "pending");
            const segmentWidth = 80 / (steps.length - 1);
            const leftOffset = 10 + (index * segmentWidth);

            return (
              <div
                key={`line-${index}`}
                className={`absolute top-12 h-[4px] z-11 ${status === "completed" ? colors.line : status === "failed" ? "bg-red-500" : "bg-[#8AC79E]"}`}
                style={{
                  left: `${leftOffset}%`,
                  width: `${segmentWidth}%`,
                  background: nextStatus === "after-failed" ? "linear-gradient(to right, #ef4444, #fca5a5)" : undefined
                }}
              ></div>
            );
          })}

          {steps.map((step, index) => {
            const stepStatus = getStepStatus(index);
            const colors = getStepColors(stepStatus);

            return (
              <div key={index} className="relative flex flex-col items-center w-1/4 text-center">
                <Image
                  src={step.icon}
                  alt={step.label}
                  width={32}
                  height={32}
                  className={`h-8 w-8 ${stepStatus === "failed" || stepStatus === "after-failed" ? "opacity-50" : ""}`}
                  style={stepStatus === "failed" || stepStatus === "after-failed" ? { filter: "hue-rotate(140deg) saturate(1.5)" } : {}}
                />
                <div
                  className={`absolute z-20 h-5 w-5 rounded-full ${colors.bg} flex items-center justify-center`}
                  style={{ top: "48px", transform: "translateY(-50%)" }}
                >
                  {stepStatus === "failed" && (
                    <span className="text-white text-xs font-bold">×</span>
                  )}
                  {stepStatus === "completed" && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <p className={`text-sm font-semibold mt-16 ${colors.text}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
        <p className={`mt-8 text-center text-xl font-bold ${failedAtStep !== null ? "text-red-500" : "text-[#0A6B3C]"}`}>
          {statusNotifications[currentStatus] || "Pesanan Selesai"}
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
        {!hasReceivedOrder ? (
          // Step 1: Show "Terima Pesanan" button first
          <button
            type="button"
            onClick={handleTerimaPesanan}
            className="rounded-lg border-2 border-[#1E6A46] bg-white px-8 py-3 font-semibold text-[#1E6A46] transition-all hover:bg-[#F0F7F3]"
          >
            Terima Pesanan
          </button>
        ) : (
          // Step 2: After clicking "Terima Pesanan", show "Pesanan Selesai" button
          <button
            type="button"
            onClick={handlePesananSelesai}
            className="hover:bg-opacity-90 rounded-lg bg-[#1E6A46] px-8 py-3 font-semibold text-white transition-all"
          >
            Pesanan Selesai
          </button>
        )}
      </section>

      <Footer />

      {/* CSS for slide-in animation */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}