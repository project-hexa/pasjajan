"use client";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { api } from "@/lib/utils/axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Icon } from "@workspace/ui/components/icon";
import { useDeliveryStore } from "@/stores/useDeliveryStore";
import { ReviewSidebar } from "../../../_components/review-sidebar";
import { ReviewCourierCard } from "../../../_components/review-courier-card";
import { ReviewProductCard } from "../../../_components/review-product-card";
import { ReviewForm } from "../../../_components/review-form";
import { StarRatingInput } from "../../../_components/star-rating-input";

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.deliveryId as string;

  const { trackingData, fetchTracking, error: fetchError } = useDeliveryStore();

  useEffect(() => {
    if (orderId) {
      fetchTracking(orderId);
    }
  }, [orderId, fetchTracking]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

  // Initialize rating if available
  useEffect(() => {
    if (trackingData?.rating) {
      setRating(trackingData.rating);
    }
  }, [trackingData?.rating]);

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
          <p className="text-gray-800 font-medium mb-8 max-w-md">{fetchError}</p>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-[#1E8F59] text-white rounded-full font-semibold hover:bg-[#166E45] transition-colors"
          >
            Kembali
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (currentRating: number, reviewText: string) => {
    // Override local rating with argument if provided (though we use state mostly)
    // Actually, ReviewForm only passes reviewText now? No, we modified the call site to passed `rating` state.

    // Let's use the arguments passed from the form or state.
    // The previous callsite is: onSubmit={(r, review) => handleSubmit(rating, review)}
    // So currentRating comes from the state passed in.

    if (currentRating === 0) {
      setError("Silakan berikan rating terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post(`/delivery/${orderId}/review`, {
        rating: currentRating,
        review: reviewText,
      });

      alert("Ulasan berhasil dikirim! Terima kasih atas feedback Anda.");
      router.push(`/delivery/${orderId}/tracking?reviewed=true`);
    } catch (err: any) {
      console.error("Failed to submit review:", err);

      // Friendly error messages
      if (err.response?.status === 500) {
        setError("Terjadi kesalahan pada server. Silakan coba lagi nanti atau hubungi customer service.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else if (err.response?.status === 404) {
        setError("Pesanan tidak ditemukan.");
      } else if (err.message === "Network Error") {
        setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else {
        setError("Gagal mengirim ulasan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[#F7C948] opacity-80 pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 mx-12 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon icon="lucide:arrow-left" className="h-5 w-5 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-black">Ulasan</h1>
        </div>

        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-4">
            {/* Courier & Star Rating Row */}
            <div className="flex gap-2 items-stretch">
              <div className="w-[220px] shrink-0">
                <ReviewCourierCard
                  courierName={trackingData?.kurir || ""}
                  courierPhone={trackingData?.kurir_phone || undefined}
                />
              </div>
              <div className="flex-1">
                <StarRatingInput
                  rating={rating}
                  onChange={setRating}
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            <ReviewProductCard />

            <hr className="border-gray-200" />

            <ReviewForm
              initialRating={0} // Not used anymore for input
              initialReview={trackingData?.review_comment || ""}
              onSubmit={(r, review) => handleSubmit(rating, review)} // Pass local rating state
              isSubmitting={isSubmitting}
            />

            {error && (
              <div className="text-red-500 text-sm text-center py-2">
                {error}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <ReviewSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
