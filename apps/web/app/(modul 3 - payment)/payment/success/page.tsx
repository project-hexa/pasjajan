"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Icon } from "@workspace/ui/components/icon";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "@/hooks/useNavigate";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { orderService } from "@/app/(modul 3 - payment)/_services/order.service";
import { Order } from "@/types/order.types";

const currency = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  isCopyable?: boolean;
  isStatus?: boolean;
}> = ({ label, value, isCopyable, isStatus }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        {isStatus ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <Icon icon="lucide:check-circle" width={14} height={14} />
            Lunas
          </span>
        ) : (
          <>
            {isCopyable && (
              <button
                title={copied ? "Tersalin!" : "Salin"}
                onClick={handleCopy}
                className="p-1 text-gray-400 hover:text-emerald-700"
              >
                <Icon icon="lucide:copy" width={14} height={14} />
              </button>
            )}
            <span className="text-sm font-medium text-gray-800">{value}</span>
          </>
        )}
      </div>
    </div>
  );
};

function SuccessPageContent() {
  const navigate = useNavigate();
  const navigateRef = React.useRef(navigate);
  navigateRef.current = navigate;

  const searchParams = useSearchParams();
  const rawOrderCode = searchParams.get("order");
  const orderCode = rawOrderCode ? rawOrderCode.replace(/:\d+$/, "") : null;

  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const validateAndFetchOrder = async () => {
      if (!orderCode) {
        navigateRef.current.push("/");
        return;
      }

      try {
        const result = await orderService.getOrder(orderCode);
        if (!result.ok || !result.data?.order) {
          alert("Order tidak ditemukan!");
          navigateRef.current.push("/");
          return;
        }

        const order = result.data.order;
        const paymentStatus = order.payment_status;

        if (paymentStatus === "pending") {
          const expiredAt = order.expired_at
            ? new Date(order.expired_at).getTime()
            : null;
          if (expiredAt && Date.now() > expiredAt) {
            setIsRedirecting(true);
            navigateRef.current.replace(`/payment/failed?order=${orderCode}`);
            return;
          } else {
            setIsRedirecting(true);
            navigateRef.current.replace(`/payment/waiting?order=${orderCode}`);
            return;
          }
        }

        if (
          paymentStatus === "expired" ||
          paymentStatus === "failed" ||
          paymentStatus === "cancelled"
        ) {
          setIsRedirecting(true);
          navigateRef.current.replace(`/payment/failed?order=${orderCode}`);
          return;
        }

        const paymentDataStr = localStorage.getItem("payment_data");
        const paymentData = paymentDataStr ? JSON.parse(paymentDataStr) : null;
        setOrderData({
          ...order,
          payment_method: order.payment_method || paymentData?.payment_method,
        });
      } catch (error) {
        console.error("Error fetching order:", error);
        alert("Gagal memuat data order!");
        navigateRef.current.push("/");
      } finally {
        setLoading(false);
      }
    };

    validateAndFetchOrder();
  }, [orderCode]); // Removed navigate - using ref instead

  if (loading || isRedirecting)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Mengalihkan...</p>
      </div>
    );
  if (!orderData) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        logoSrc="/img/pasjajan2.png"
        logoAlt="PasJajan Logo"
        userName={user?.full_name}
        userInitials={user?.full_name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)}
        userAvatar={user?.avatar}
      />
      <main className="flex grow items-center justify-center bg-emerald-50/50 px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-600 bg-emerald-600">
              <Icon
                icon="lucide:check"
                width={65}
                height={65}
                className="text-white"
              />
            </div>
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Pembayaran Berhasil!
          </h1>
          <div className="mb-6 rounded-xl bg-emerald-50 p-5">
            <div className="mb-4 flex items-center justify-between border-b border-emerald-200 pb-3">
              <span className="font-semibold text-gray-700">
                Jumlah Pembayaran
              </span>
              <span className="text-xl font-bold text-emerald-600">
                {currency(orderData.grand_total).replace("Rp", "Rp.")}
              </span>
            </div>
            <div className="space-y-1">
              {orderData.payment_method && (
                <DetailRow
                  label="Metode Pembayaran"
                  value={orderData.payment_method.name}
                />
              )}
              <DetailRow label="ID Pesanan" value={orderData.code} />
              <DetailRow label="Status" value="Lunas" isStatus />
            </div>
          </div>
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-blue-50 p-4">
            <div className="shrink-0 rounded-full bg-blue-100 p-2">
              <Icon
                icon="lucide:package"
                width={20}
                height={20}
                className="text-blue-600"
              />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-blue-900">
                Pesanan Anda Sedang Diproses
              </p>
              <p className="text-xs text-blue-700">
                Kami akan segera memproses pesanan Anda. Detail pemesanan telah
                dikirim ke email Anda
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate.push("/cart")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-800"
            >
              <Icon icon="lucide:shopping-cart" width={18} height={18} />
              Belanja Lagi
            </button>
            <button
              onClick={() => navigate.push("/orders")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-4 py-3 font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <Icon icon="lucide:package" width={18} height={18} />
              Lihat Pesanan
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Mengalihkan...</p>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
