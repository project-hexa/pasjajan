"use client";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { api } from "@/lib/utils/axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "@workspace/ui/components/sonner";
import Image from "next/image";
import { getTrackingDataAction, getOrderDetailsAction } from "@/app/actions/order.actions";
import type { Order } from "../../../../../types/order";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [trackingData, setTrackingData] = useState<any>(null);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const deliveryId = Number(params.deliveryId);

  useEffect(() => {
    if (!deliveryId) return;

    const initData = async () => {
      try {
        setLoading(true);
        const [track, order] = await Promise.all([
          getTrackingDataAction(deliveryId),
          getOrderDetailsAction(deliveryId)
        ]);

        setTrackingData(track);
        setOrderData(order);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data pesanan.");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [deliveryId]);

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Harap berikan bintang terlebih dahulu!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post(`/delivery/${deliveryId}/review`, {
        rating: rating,
        comment: reviewText,
      });

      if (response.data.success) {
        toast.success("Ulasan berhasil dikirim! Terima kasih.");
        // Redirect to catalogue or order list after success
        setTimeout(() => {
          // Ideally redirect to history or home
          router.push("/catalogue");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Submit review error:", error);
      toast.error(error.response?.data?.message || "Gagal mengirim ulasan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Derived Data
  const driverName = trackingData?.kurir || "Kurir PasJajan";
  // If order items exist, map them. Otherwise fallback or empty.
  // Note: Backend might return items with nested product object or flattened.
  // Based on my edit to OrderController, using eager load it should be item.product.name.
  // But wait, getOrders (which getUserOrdersReal uses) returns serialized JSON.
  // If I added 'items.product', the 'items' array objects will have a 'product' property.

  const productNames = orderData?.items?.map(i => i.product?.name || i.product_name || "Produk").join(", ") || "Detail Produk";
  const totalItems = orderData?.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;

  // Format Currency
  const formatRp = (val: number) => "Rp." + val.toLocaleString("id-ID");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF7F0] flex items-center justify-center">
        <p className="font-bold text-gray-500 animate-pulse">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF7F0] font-sans flex flex-col">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 flex-1">
        {/* Judul Halaman */}
        <h1 className="mb-6 text-3xl font-bold text-black">Ulasan</h1>

        {/* Container Grid untuk Layout 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Konten Utama */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kartu Pengirim dan Rating dalam satu baris */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kartu Pengirim */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-black">Pengirim</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar Placeholder */}
                    <div className="h-12 w-12 rounded-full bg-gray-700"></div>
                    <span className="font-semibold text-black">{driverName}</span>
                  </div>
                  {/* Ikon WhatsApp */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 cursor-pointer text-green-600"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.14 19.77 7.88 19.02L7.58 18.84L4.46 19.66L5.29 16.62L5.1 16.32C4.28 15.02 3.85 13.48 3.85 11.91C3.85 7.4 7.53 3.72 12.05 3.72C14.25 3.72 16.31 4.58 17.87 6.13C19.42 7.69 20.28 9.75 20.28 11.92C20.28 16.44 16.59 20.16 12.05 20.16ZM16.56 14.49C16.31 14.37 15.1 13.77 14.88 13.69C14.66 13.61 14.5 13.57 14.34 13.81C14.18 14.05 13.73 14.58 13.59 14.74C13.45 14.9 13.31 14.92 13.06 14.8C12.81 14.68 12.01 14.42 11.06 13.57C10.32 12.91 9.82 12.1 9.57 11.68C9.32 11.26 9.55 11.03 9.67 10.91C9.78 10.8 9.92 10.63 10.04 10.49C10.16 10.35 10.2 10.25 10.28 10.09C10.36 9.93 10.32 9.79 10.26 9.67C10.2 9.55 9.74 8.42 9.55 7.96C9.36 7.51 9.17 7.57 9.03 7.57C8.9 7.57 8.75 7.56 8.59 7.56C8.43 7.56 8.17 7.62 7.95 7.86C7.73 8.1 7.11 8.68 7.11 9.86C7.11 11.04 7.97 12.18 8.09 12.34C8.21 12.5 9.81 14.97 12.26 16.03C12.84 16.28 13.3 16.43 13.66 16.54C14.27 16.74 14.83 16.71 15.27 16.65C15.76 16.58 16.78 16.03 16.99 15.44C17.2 14.85 17.2 14.35 17.14 14.25C17.08 14.15 16.81 14.1 16.56 13.98V14.49Z" />
                  </svg>
                </div>
              </div>

              {/* Kartu Rating */}
              <div className="md:col-span-2 flex flex-col justify-center rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-base font-bold text-black">
                  Seberapa Puas Anda?
                </h3>
                <div className="mt-2 flex gap-3">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      onClick={() => handleStarClick(index)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={index < rating ? "#FFD700" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`h-10 w-10 cursor-pointer transition-colors ${index < rating ? "text-yellow-400" : "text-yellow-500"}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Pesanan */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                {/* Icon Produk */}
                <div className="flex-shrink-0 w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder image logic, can update if product has image */}
                  <div className="text-orange-500 text-xs text-center font-bold px-1">
                    {orderData?.items?.[0]?.product_name?.substring(0, 10) || "Produk"}
                  </div>
                </div>

                {/* Detail Pesanan */}
                <div className="flex-1">
                  <h4 className="font-semibold text-black leading-snug">
                    {productNames}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">Total: {totalItems} Item</p>
                  <p className="text-sm font-semibold text-black mt-1">Total Belanja {formatRp(orderData?.grand_total || orderData?.total_amount || 0)}</p>
                </div>

                {/* Link Detail */}
                <button className="text-[#1E8150] text-sm font-medium hover:underline whitespace-nowrap">
                  Lihat Detail Pesanan
                </button>
              </div>
            </div>

            {/* Kolom Input Ulasan */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-black">Berikan Ulasan</h3>
              <textarea
                className="h-40 w-full resize-none rounded-lg border border-gray-300 p-4 text-black text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Masukkan ulasan"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>

            {/* Tombol Kirim */}
            <div className="flex justify-end pb-8">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="hover:bg-opacity-90 rounded-lg bg-[#1E8150] px-16 py-3 font-semibold text-white transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>

          {/* Kolom Kanan - Banner Promosi */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-[32px] bg-gradient-to-br from-[#1E8150] to-[#0F5C3A] overflow-hidden relative shadow-lg min-h-[550px]">
              {/* Union icons (atas, berdampingan) */}
              <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="/img/Union.png"
                    alt="Union 1"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="relative w-8 h-8 mt-4">
                  <Image
                    src="/img/Union.png"
                    alt="Union 2"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Logo PasJajan di pojok kanan atas */}
              <div className="absolute top-8 right-8 z-20 flex items-center gap-2">
                <Image
                  src="/img/logo2.png"
                  alt="PasJajan"
                  width={32}
                  height={32}
                />
                <span className="font-bold text-white text-sm">PasJajan</span>
              </div>

              {/* Text Content - Positioned in upper portion */}
              <div className="relative z-10 px-10 pt-32 max-w-[80%] ml-20">
                <p className="text-lg font-semibold leading-relaxed text-white">
                  Kami harap kamu menyukainya! Ceritakan pengalamanmu agar kami bisa melayanimu lebih baik lagi.
                </p>
              </div>

              {/* Ilustrasi bawah */}
              <div className="absolute bottom-0 left-0 z-10 w-full h-[60%]">
                {/* Bola kuning sempurna */}
                <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-[#FFD84D]" />

                {/* Karakter */}
                <div className="absolute bottom-0 left-0 w-[85%] h-full">
                  <Image
                    src="/img/karakter.png"
                    alt="Character"
                    fill
                    className="object-contain object-bottom-left"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}