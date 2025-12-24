"use client";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { Icon } from "@workspace/ui/components/icon";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { orderService } from "@/app/(modul 3 - payment)/_services/order.service";
import { Order, OrderItem } from "@/types/order.types";

const currency = (val: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
};

function OrderDetailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order_code");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderCode) { router.push("/orders"); return; }

    const fetchOrder = async () => {
      try {
        const result = await orderService.getOrder(orderCode);
        if (result.ok && result.data?.order) { setOrder(result.data.order); }
        else { setError(result.message || "Gagal memuat detail pesanan"); }
      } catch (err) { console.error(err); setError("Terjadi kesalahan koneksi"); }
      finally { setLoading(false); }
    };

    fetchOrder();
  }, [orderCode, router]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-gray-50"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div></div>;
  if (error || !order) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <p className="font-medium text-red-500">{error || "Pesanan tidak ditemukan"}</p>
      <button onClick={() => router.back()} className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">Kembali</button>
    </div>
  );

  const isPaid = order.payment_status === "paid" || order.payment_status === "settlement" || order.payment_status === "capture";
  const expiredAt = order.expired_at ? new Date(order.expired_at).getTime() : null;
  const now = Date.now();
  const isExpiredUnpaid = (order.payment_status === "unpaid" || order.payment_status === "pending") && expiredAt !== null && now > expiredAt;
  const isFailed = order.payment_status === "expire" || order.payment_status === "cancel" || order.payment_status === "deny" || isExpiredUnpaid;

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="container mx-auto max-w-5xl flex-grow px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => router.back()} className="rounded-full p-2 transition-colors hover:bg-gray-100"><Icon icon="lucide:arrow-left" width={24} height={24} /></button>
          <h1 className="text-xl font-bold text-gray-900">Detail Pesanan</h1>
        </div>

        <div className="mb-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div><p className={`mb-1 text-lg font-bold ${isPaid ? "text-emerald-600" : isFailed ? "text-red-600" : "text-amber-600"}`}>{isPaid ? "Pembayaran Berhasil" : isFailed ? "Pembayaran Gagal" : "Menunggu Pembayaran"}</p></div>
            {isPaid && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100"><Icon icon="lucide:check" className="text-emerald-600" width={18} height={18} /></div>}
            {isFailed && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100"><Icon icon="lucide:x" className="text-red-600" width={18} height={18} /></div>}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="font-medium text-gray-600">ID Pesanan</span><span className="font-bold text-gray-900">{order.code}</span></div>
            <div className="flex items-center justify-between"><span className="font-medium text-gray-600">Tanggal Pembayaran</span><span className="font-bold text-gray-900">{order.paid_at ? formatDate(order.paid_at) : formatDate(order.created_at)}</span></div>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Info Pengiriman</h2>
            {isPaid && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">Sedang Disiapkan</span>}
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1"><Icon icon="lucide:map-pin" className="text-emerald-600" width={20} height={20} /></div>
            <div><p className="mb-1 font-medium text-gray-900">{order.shipping_recipient_name} - {order.shipping_recipient_phone}</p><p className="text-sm leading-relaxed text-gray-600">{order.shipping_address}</p></div>
          </div>
        </div>

        <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50 p-4"><h2 className="font-semibold text-gray-900">Daftar Produk</h2></div>
          <div className="divide-y divide-gray-100 p-4">
            {order.items.map((item: OrderItem, idx: number) => (
              <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  <Image src={item.product?.image_url || "/images/placeholder.png"} alt={item.product?.name || "Product"} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="line-clamp-2 font-medium text-gray-900">{item.product?.name || `Produk ${item.product_id}`}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">{item.quantity} x {currency(item.price)}</p>
                    <p className="font-medium text-gray-900">{currency(item.sub_total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Rincian Pembayaran</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600"><span>Total Harga ({order.items.length} Barang)</span><span>{currency(order.sub_total)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Biaya Pengiriman</span><span>{currency(order.shipping_fee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Total Diskon Barang</span><span>-{currency(order.discount)}</span></div>}
            {order.admin_fee > 0 && <div className="flex justify-between text-gray-600"><span>Biaya Layanan</span><span>{currency(order.admin_fee)}</span></div>}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3"><span className="font-bold text-gray-900">Total Pembayaran</span><span className="text-lg font-bold text-emerald-700">{currency(order.grand_total)}</span></div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 md:static md:border-0 md:bg-transparent md:p-0">
          <div className="mx-auto flex max-w-5xl justify-end gap-3">
            <button onClick={() => router.push("/cart")} className="rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-emerald-800">Beli Lagi</button>
            {isPaid && <button className="rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-emerald-800">Download Bukti Transaksi</button>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderDetailPage() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}><OrderDetailPageContent /></Suspense>;
}
