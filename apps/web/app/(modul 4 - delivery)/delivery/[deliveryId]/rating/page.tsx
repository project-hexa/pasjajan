"use client";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { api } from "@/lib/utils/axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@workspace/ui/components/icon";

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.deliveryId as string;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Silakan berikan rating terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post(`/delivery/${orderId}/review`, {
        rating: rating,
        review: reviewText,
      });

      alert("Ulasan berhasil dikirim! Terima kasih atas feedback Anda.");
      router.push(`/delivery/${orderId}/tracking?reviewed=true`);
    } catch (err: any) {
      console.error("Failed to submit review:", err);

      // Handle specific error messages from backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else if (err.response?.status === 404) {
        setError("Pesanan tidak ditemukan.");
      } else {
        setError("Gagal mengirim ulasan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
      {/* Yellow decorative circle - bottom left */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[#F7C948] opacity-80 pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 mx-12 py-8 relative z-10">
        {/* Header with back button */}
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
          {/* Left Content */}
          <div className="flex-1 space-y-4">
            {/* Row: Pengirim & Rating */}
            <div className="flex gap-4">
              {/* Pengirim Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm w-[180px]">
                <h3 className="mb-3 text-xs font-bold text-gray-800">Pengirim</h3>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                  <span className="font-medium text-black text-sm">Sugeng</span>
                  <button type="button" className="ml-auto p-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Icon icon="logos:whatsapp-icon" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Rating Card */}
              <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-xs font-bold text-gray-800">
                  Seberapa Puas Anda?
                </h3>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleStarClick(index)}
                      className="focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={index < rating ? "#facc15" : "none"}
                        stroke="#facc15"
                        strokeWidth={1.5}
                        className="h-7 w-7 cursor-pointer transition-colors"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Product Info Row */}
            <div className="flex items-center gap-4 py-2">
              <Image
                src="https://placehold.co/60x60?text=Produk"
                alt="Produk"
                width={50}
                height={50}
                className="rounded-lg object-cover flex-shrink-0"
                unoptimized
              />
              <div className="flex-1">
                <p className="font-medium text-black text-sm">
                  Teh Pucuk - 350 ML, Pop Mie - baso
                </p>
                <p className="text-gray-500 text-xs mt-0.5">Total: 2 Pesanan</p>
                <p className="font-bold text-black text-sm mt-0.5">
                  Total Belanja Rp.30.000
                </p>
              </div>
              <button type="button" className="text-[#1E8F59] font-medium text-sm hover:underline whitespace-nowrap">
                Lihat Detail Pesanan
              </button>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Review Input Card */}
            <div className="pt-2">
              <h3 className="mb-3 text-sm font-bold text-black">Berikan Ulasan</h3>
              <textarea
                className="w-full h-28 resize-none rounded-lg border border-gray-300 p-3 text-black text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                placeholder="Masukkan ulasan"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center py-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-full bg-[#1E8F59] px-12 py-2.5 font-semibold text-white text-sm shadow-md transition-all hover:bg-[#166E45] disabled:opacity-50"
              >
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>

          {/* Right Sidebar - Green Card */}
          <div className="w-[240px] flex-shrink-0">
            <div className="rounded-2xl bg-[#1E8F59] text-white relative overflow-hidden h-[420px]">
              {/* Character Image - positioned at bottom left */}
              <div className="absolute bottom-0 -left-4 pointer-events-none">
                <Image
                  src="/img/karakter.png"
                  alt="Character"
                  width={160}
                  height={220}
                  className="object-contain"
                  unoptimized
                />
              </div>

              {/* Union decoration - top left corner */}
              <div className="absolute top-4 left-4 z-30 pointer-events-none">
                <Image
                  src="/img/Union.png"
                  alt="Decoration"
                  width={32}
                  height={32}
                  className="opacity-100"
                  unoptimized
                />
              </div>

              {/* PasJajan Logo - top right */}
              <div className="absolute top-4 right-4 z-30 pointer-events-none">
                <Image
                  src="/logo-footer.png"
                  alt="PasJajan"
                  width={36}
                  height={36}
                  unoptimized
                />
              </div>

              {/* Text Content - positioned in upper-middle area */}
              <div className="absolute top-[70px] left-4 right-4 z-20 pointer-events-none">
                <p className="text-[13px] font-bold leading-snug drop-shadow-sm">
                  Kami harap kamu menyukainya! Ceritakan pengalamanmu agar kami bisa melayanimu lebih baik lagi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
