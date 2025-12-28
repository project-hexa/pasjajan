"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Icon } from "@workspace/ui/components/icon";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "@/hooks/useNavigate";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { orderService } from "@/app/(modul 3 - payment)/_services/order.service";
import { PaymentData } from "@/types/payment.types";

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
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            <Icon icon="lucide:x-circle" width={14} height={14} />
            Gagal
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

function FailedPageContent() {
  const navigate = useNavigate();
  const navigateRef = React.useRef(navigate);
  navigateRef.current = navigate;

  const searchParams = useSearchParams();
  const rawOrderCode = searchParams.get("order");
  const orderCode = rawOrderCode ? rawOrderCode.replace(/:\d+$/, "") : null;

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const validateAndLoadData = async () => {
      if (!orderCode) {
        navigateRef.current.push("/cart");
        return;
      }

      try {
        const result = await orderService.getOrder(orderCode);
        if (!result.ok || !result.data?.order) {
          setOrderNotFound(true);
          setLoading(false);
          return;
        }

        const order = result.data.order;
        const paymentStatus = order.payment_status;

        if (
          paymentStatus === "paid" ||
          paymentStatus === "settlement" ||
          paymentStatus === "capture"
        ) {
          setIsRedirecting(true);
          navigateRef.current.replace(`/payment/success?order=${orderCode}`);
          return;
        }

        if (paymentStatus === "pending") {
          const expiredAt = order.expired_at
            ? new Date(order.expired_at).getTime()
            : null;
          if (expiredAt && Date.now() > expiredAt) {
            /* show failed page */
          } else {
            setIsRedirecting(true);
            navigateRef.current.replace(`/payment/waiting?order=${orderCode}`);
            return;
          }
        }

        setPaymentData({
          order_code: order.code || orderCode,
          payment_method: order.payment_method || {
            code: "",
            name: "Unknown",
            category: "",
          },
          payment_status: paymentStatus,
          grand_total: String(order.grand_total),
        });
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrderNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    validateAndLoadData();
  }, [orderCode]); // Removed navigate - using ref instead

  if (loading || isRedirecting)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Mengalihkan...</p>
      </div>
    );
  if (orderNotFound)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-emerald-50/50 p-4">
        <p className="mb-4 text-gray-600">Order tidak ditemukan</p>
        <button
          onClick={() => navigate.push("/cart")}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
        >
          Kembali ke Keranjang
        </button>
      </div>
    );
  if (!paymentData) return null;

  const { payment_method, grand_total, order_code } = paymentData;

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
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-700 bg-red-700">
              <Icon
                icon="lucide:x"
                width={65}
                height={65}
                className="text-white"
              />
            </div>
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Pembayaran Gagal
          </h1>
          <div className="mb-6 rounded-xl bg-red-50 p-5">
            <div className="mb-4 flex items-center justify-between border-b border-red-200 pb-3">
              <span className="font-semibold text-gray-700">
                Jumlah Pembayaran
              </span>
              <span className="text-xl font-bold text-red-500">
                {currency(grand_total).replace("Rp", "Rp.")}
              </span>
            </div>
            <div className="space-y-1">
              <DetailRow
                label="Metode Pembayaran"
                value={payment_method.name}
              />
              <DetailRow label="ID Pesanan" value={order_code} />
              <DetailRow label="Status" value="Gagal" isStatus />
            </div>
          </div>
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-amber-50 p-4">
            <div>
              <p className="text-center text-xs text-amber-700">
                Silahkan buat pesanan baru jika Anda masih ingin melanjutkan
                pembelian
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
            <button onClick={() => navigate.push(`/payment/detail?order_code=${orderCode}`)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-4 py-3 font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
              <Icon icon="lucide:package" width={18} height={18} />Lihat Pesanan
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function FailedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Mengalihkan...</p>
        </div>
      }
    >
      <FailedPageContent />
    </Suspense>
  );
}
