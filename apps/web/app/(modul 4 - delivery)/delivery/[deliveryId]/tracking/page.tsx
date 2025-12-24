"use client";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { useNavigate } from "@/hooks/useNavigate";
import { useDeliveryStore } from "@/stores/useDeliveryStore";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { checkShippingCost } from "@/services/delivery";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { statusNotifications } from "../../../_constants";
import { StatusToast } from "../../../_components/status-toast";
import { TrackingStepper } from "../../../_components/tracking-stepper";
import { TrackingEstimation } from "../../../_components/tracking-estimation";
import { TrackingTimeline } from "../../../_components/tracking-timeline";
import { TrackingActionButtons } from "../../../_components/tracking-action-buttons";

export default function TrackingPage() {
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.deliveryId as string;

  const { trackingData, isLoading, error, fetchTracking, confirmOrder } = useDeliveryStore();
  const { user } = useUserStore();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<any>(null);
  const previousStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchTracking(orderId);
      checkShippingCost(1).then(res => {
        if (res.success) setEstimatedCost(res.data);
      }).catch(err => console.error("Estimasi gagal", err));
    }
  }, [orderId, fetchTracking]);

  // Polling Logic
  useEffect(() => {
    if (!orderId || error) return;
    const interval = setInterval(() => fetchTracking(orderId), 5000);
    return () => clearInterval(interval);
  }, [orderId, fetchTracking, error]);

  // Handle Status Change Notification
  useEffect(() => {
    if (trackingData?.status_utama) {
      const newStatus = trackingData.status_utama;
      if (previousStatusRef.current !== null && previousStatusRef.current !== newStatus) {
        setNotificationMessage(statusNotifications[newStatus] || "Status diperbarui");
        setShowNotification(true);
      }
      previousStatusRef.current = newStatus;
    }
  }, [trackingData?.status_utama]);

  const handleTerimaPesanan = async () => {
    if (confirm("Apakah Anda yakin paket sudah diterima?")) {
      try {
        await confirmOrder(orderId);
        setNotificationMessage("Pesanan berhasil diterima!");
        setShowNotification(true);
      } catch (e) {
        alert("Gagal konfirmasi pesanan.");
      }
    }
  };

  const handlePesananSelesai = () => {
    navigate.push(`/delivery/${orderId}/rating`);
  };

  if (isLoading && !trackingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading Tracking...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <p className="text-gray-800 font-medium mb-6 max-w-md">{error}</p>
        <button
          onClick={() => navigate.back()}
          className="rounded-full bg-[#1E6A46] px-8 py-3 text-white font-semibold hover:bg-[#165a3b]"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <StatusToast
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <TrackingStepper currentStatus={trackingData?.status_utama || "PESANAN_DIBUAT"} />

      <TrackingEstimation
        estimatedCost={estimatedCost}
        kurir={trackingData?.kurir || ""}
        kurirPhone={trackingData?.kurir_phone || undefined}
      />

      <TrackingTimeline
        timeline={trackingData?.timeline || []}
        proofImage={trackingData?.proof_image}
      />

      <TrackingActionButtons
        status={trackingData?.status_utama || ""}
        rating={trackingData?.rating || undefined}
        reviewComment={trackingData?.review_comment || undefined}
        isOwner={Number(user?.id) === Number(trackingData?.customer_user_id)}
        onReceiveOrder={handleTerimaPesanan}
        onCompleteOrder={handlePesananSelesai}
      />

      <Footer />
    </div>
  );
}