"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Icon } from "@workspace/ui/components/icon";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cookies from "js-cookie";
import { useNavigate } from "@/hooks/useNavigate";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";

interface OrderData {
  order_code: string;
  customer_name: string;
  grand_total: string;
  payment_method?: {
    name: string;
    category: string;
  };
  payment_status: string;
  created_at: string;
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
  const searchParams = useSearchParams();
  // Sanitize order code - hapus suffix :1 atau :digit jika ada
  const rawOrderCode = searchParams.get("order");
  const orderCode = rawOrderCode ? rawOrderCode.replace(/:\d+$/, "") : null;

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Get logged-in user from auth store
  const { user } = useUserStore();

  useEffect(() => {
    const validateAndFetchOrder = async () => {
      if (!orderCode) {
        navigate.push("/");
        return;
      }

      try {
        // Get auth token
        const token = Cookies.get("token");

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
          alert("Order tidak ditemukan!");
          navigate.push("/");
          return;
        }

        const order = result.data.order;
        const paymentStatus = order.payment_status;

        // Validate: only show success page if status is actually paid
        if (paymentStatus === "pending") {
          // Check if expired
          const expiredAt = order.expired_at
            ? new Date(order.expired_at).getTime()
            : null;
          const now = Date.now();

          if (expiredAt && now > expiredAt) {
            // Expired, redirect to failed
            setIsRedirecting(true);
            navigate.replace(`/payment/failed?order=${orderCode}`);
            return;
          } else {
            // Still pending, redirect to waiting
            setIsRedirecting(true);
            navigate.replace(`/payment/waiting?order=${orderCode}`);
            return;
          }
        }

        if (
          paymentStatus === "expired" ||
          paymentStatus === "failed" ||
          paymentStatus === "cancelled"
        ) {
          // Redirect to failed page
          setIsRedirecting(true);
          navigate.replace(`/payment/failed?order=${orderCode}`);
          return;
        }

        // Status is paid/settlement/capture - show success page
        const paymentDataStr = localStorage.getItem("payment_data");
        const paymentData = paymentDataStr ? JSON.parse(paymentDataStr) : null;

        const mergedData = {
          ...order,
          order_code: order.order_code || orderCode,
          payment_method: order.payment_method || paymentData?.payment_method,
          va_number: order.va_number || paymentData?.va_number,
          payment_code: order.payment_code || paymentData?.payment_code,
        };
        setOrderData(mergedData);
      } catch (error) {
        console.error("Error fetching order:", error);
        alert("Gagal memuat data order!");
        navigate.push("/");
      } finally {
        setLoading(false);
      }
    };

    validateAndFetchOrder();
  }, [orderCode, navigate]);

  // Show loading while redirecting or loading
  if (loading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Mengalihkan...</p>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

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
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-600 bg-emerald-600">
              <Icon
                icon="lucide:check"
                width={65}
                height={65}
                className="text-white"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Pembayaran Berhasil!
          </h1>

          {/* Detail Card */}
          <div className="mb-6 rounded-xl bg-emerald-50 p-5">
            {/* Amount Header with bottom border */}
            <div className="mb-4 flex items-center justify-between border-b border-emerald-200 pb-3">
              <span className="font-semibold text-gray-700">
                Jumlah Pembayaran
              </span>
              <span className="text-xl font-bold text-emerald-600">
                {currency(orderData.grand_total).replace("Rp", "Rp.")}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-1">
              {orderData.va_number && (
                <DetailRow
                  label="No. VA"
                  value={orderData.va_number}
                  isCopyable
                />
              )}
              {orderData.payment_code && (
                <DetailRow
                  label="Kode Pembayaran"
                  value={orderData.payment_code}
                  isCopyable
                />
              )}
              {orderData.payment_method && (
                <DetailRow
                  label="Metode Pembayaran"
                  value={orderData.payment_method.name}
                />
              )}
              <DetailRow label="ID Pesanan" value={orderData.order_code} />
              <DetailRow label="Status" value="Lunas" isStatus />
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-blue-50 p-4">
            <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
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
