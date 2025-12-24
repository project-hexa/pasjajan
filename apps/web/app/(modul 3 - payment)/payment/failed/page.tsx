"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Icon } from "@workspace/ui/components/icon";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cookies from "js-cookie";
import { useNavigate } from "@/hooks/useNavigate";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";

interface PaymentData {
  order_code: string;
  payment_method: {
    code: string;
    name: string;
    category: string;
  };
  grand_total: string;
  va_number?: string;
  payment_code?: string;
}

const currency = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

// Detail Row Component
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
  const searchParams = useSearchParams();
  // Sanitize order code - hapus suffix :1 atau :digit jika ada
  const rawOrderCode = searchParams.get("order");
  const orderCode = rawOrderCode ? rawOrderCode.replace(/:\d+$/, "") : null;

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);

  // Get logged-in user from auth store
  const { user } = useUserStore();

  useEffect(() => {
    const validateAndLoadData = async () => {
      if (!orderCode) {
        navigate.push("/cart");
        return;
      }

      try {
        // Get auth token
        const token = Cookies.get("token");

        // Always fetch from API to validate current status
        const res = await fetch(
          `http://localhost:8000/api/orders/${orderCode}`,
          {
            headers: {
              Accept: "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          },
        );
        const result = await res.json();

        if (!result.success || !result.data.order) {
          // Order not found
          setOrderNotFound(true);
          setLoading(false);
          return;
        }

        const order = result.data.order;
        const paymentStatus = order.payment_status;

        // Validate: only show failed page if status is actually failed/expired
        if (
          paymentStatus === "paid" ||
          paymentStatus === "settlement" ||
          paymentStatus === "capture"
        ) {
          // Order is paid, redirect to success
          setIsRedirecting(true);
          navigate.replace(`/payment/success?order=${orderCode}`);
          return;
        }

        if (paymentStatus === "pending") {
          // Check if order has actually expired based on expired_at timestamp
          const expiredAt = order.expired_at
            ? new Date(order.expired_at).getTime()
            : null;
          const now = Date.now();

          // If expired_at has passed, treat as expired (show failed page)
          if (expiredAt && now > expiredAt) {
            // Order is technically expired even if status hasn't updated
            // Show failed page instead of redirecting to waiting
          } else {
            // Order is still pending and not expired, redirect to waiting
            setIsRedirecting(true);
            navigate.replace(`/payment/waiting?order=${orderCode}`);
            return;
          }
        }

        // Status is failed/expired/cancelled - show this page
        setPaymentData({
          order_code: order.order_code || orderCode,
          payment_method: order.payment_method || {
            code: "",
            name: "Unknown",
            category: "",
          },
          grand_total: order.grand_total,
          va_number: order.va_number,
          payment_code: order.payment_code,
        });
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrderNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    validateAndLoadData();
  }, [orderCode, navigate]);

  // Show loading while redirecting or loading
  if (loading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Mengalihkan...</p>
      </div>
    );
  }

  // Order not found
  if (orderNotFound) {
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
  }

  if (!paymentData) {
    return null;
  }

  const { payment_method, grand_total, order_code } = paymentData;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        logoSrc="/images/pasjajan2.png"
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
      <main className="flex flex-grow items-center justify-center bg-emerald-50/50 px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          {/* Icon */}
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

          {/* Title */}
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Pembayaran Gagal
          </h1>

          {/* Detail Card */}
          <div className="mb-6 rounded-xl bg-red-50 p-5">
            {/* Amount */}
            <div className="mb-4 flex items-center justify-between border-b border-red-200 pb-3">
              <span className="font-semibold text-gray-700">
                Jumlah Pembayaran
              </span>
              <span className="text-xl font-bold text-red-500">
                {currency(grand_total).replace("Rp", "Rp.")}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <DetailRow
                label="Metode Pembayaran"
                value={payment_method.name}
              />
              <DetailRow label="ID Pesanan" value={order_code} />
              <DetailRow label="Status" value="Gagal" isStatus />
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-amber-50 p-4">
            <div>
              <p className="text-center text-xs text-amber-700">
                Silahkan buat pesanan baru jika Anda masih ingin melanjutkan
                pembelian
              </p>
            </div>
          </div>

          {/* Action Buttons */}
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
