"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Icon } from "@workspace/ui/components/icon";
import { useSearchParams } from "next/navigation";
import { useNavigate } from "@/hooks/useNavigate";
import { toast } from "@workspace/ui/components/sonner";
import { PaymentInstructionsModal } from "@/components/PaymentInstructionsModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { orderService } from "@/app/(modul 3 - payment)/_services/order.service";
import { paymentService } from "@/app/(modul 3 - payment)/_services/payment.service";
import { PaymentData } from "@/types/payment.types";
import Image from "next/image";

const currency = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

const CountdownTimer: React.FC<{
  expiredAt: string;
  onExpired: () => void;
}> = ({ expiredAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expireTime = new Date(expiredAt).getTime();
      const now = Date.now();
      const diff = expireTime - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("00:00");
        onExpired();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiredAt, onExpired]);

  if (isExpired) return null;

  return (
    <div className="flex items-center justify-center gap-2 rounded-full bg-amber-100 px-6 py-2 text-amber-700">
      <Icon icon="lucide:alert-triangle" width={18} height={18} />
      <span className="text-sm font-semibold">Bayar Dalam {timeLeft}</span>
    </div>
  );
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  isCopyable?: boolean;
}> = ({ label, value, isCopyable }) => {
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
      </div>
    </div>
  );
};

function WaitingPageContent() {
  const navigate = useNavigate();
  const navigateRef = React.useRef(navigate);
  navigateRef.current = navigate; // Always keep ref updated

  const searchParams = useSearchParams();
  const rawOrderCode = searchParams.get("order");
  const orderCode = rawOrderCode ? rawOrderCode.replace(/:\d+$/, "") : null;

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [isExpired, setIsExpired] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showQrPreview, setShowQrPreview] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { user } = useUserStore();

  useEffect(() => {
    const loadPaymentData = async () => {
      const data = localStorage.getItem("payment_data");
      if (data) {
        const parsed = JSON.parse(data) as PaymentData;
        setPaymentData(parsed);

        if (parsed.payment_status === "expired") {
          setIsExpired(true);
          setPaymentStatus("expired");
        }

        if (
          parsed.payment_status === "paid" ||
          parsed.payment_status === "settlement"
        ) {
          setIsRedirecting(true);
          localStorage.removeItem("payment_data");
          navigateRef.current.replace(
            `/payment/success?order=${parsed.order_code}`,
          );
          return;
        }

        setLoading(false);
      } else if (orderCode) {
        try {
          const result = await orderService.getOrder(orderCode);

          if (result.ok && result.data?.order) {
            const order = result.data.order;
            const status = order.payment_status;

            if (
              status === "paid" ||
              status === "settlement" ||
              status === "capture"
            ) {
              setIsRedirecting(true);
              navigateRef.current.replace(
                `/payment/success?order=${orderCode}`,
              );
              return;
            }

            if (
              status === "expired" ||
              status === "failed" ||
              status === "cancelled"
            ) {
              setIsRedirecting(true);
              navigateRef.current.replace(`/payment/failed?order=${orderCode}`);
              return;
            }

            const expiredAt = order.expired_at
              ? new Date(order.expired_at).getTime()
              : null;
            const now = Date.now();

            if (expiredAt && now > expiredAt) {
              setIsRedirecting(true);
              navigateRef.current.replace(`/payment/failed?order=${orderCode}`);
              return;
            }

            // Extract payment instructions data
            const instructions = order.payment_instructions;
            let qrCodeUrl: string | undefined;
            let vaNumber: string | undefined;
            let paymentCode: string | undefined;
            let companyCode: string | undefined;
            let deeplink: string | undefined;

            if (typeof instructions === "object" && instructions !== null) {
              const instr = instructions as Record<string, unknown>;
              qrCodeUrl = instr.qr_code_url
                ? String(instr.qr_code_url)
                : undefined;
              vaNumber = instr.va_number ? String(instr.va_number) : undefined;
              paymentCode = instr.payment_code
                ? String(instr.payment_code)
                : undefined;
              companyCode = instr.company_code
                ? String(instr.company_code)
                : undefined;
              deeplink = instr.deeplink ? String(instr.deeplink) : undefined;
            }

            setPaymentData({
              order_code: order.code,
              payment_method: order.payment_method || {
                code: "",
                name: "Unknown",
                category: "bank_transfer",
              },
              payment_status: order.payment_status,
              grand_total: String(order.grand_total),
              expired_at: order.expired_at || undefined,
              qr_code_url: qrCodeUrl,
              va_number: vaNumber,
              payment_code: paymentCode,
              company_code: companyCode,
              deeplink: deeplink,
            });
          } else {
            toast.error("Order tidak ditemukan!", { toasterId: "global" });
            navigateRef.current.push("/");
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error("Gagal memuat data order!", { toasterId: "global" });
          navigateRef.current.push("/");
        }
        setLoading(false);
      } else {
        toast.error("Data pembayaran tidak ditemukan!", { toasterId: "global" });
        navigateRef.current.push("/");
        setLoading(false);
      }
    };

    loadPaymentData();
  }, [orderCode]); // Removed navigate from dependencies - using ref instead

  useEffect(() => {
    const effectiveOrderCode = paymentData?.order_code || orderCode;
    if (!effectiveOrderCode || isExpired || isRedirecting) return;

    const checkStatus = async () => {
      try {
        const result =
          await paymentService.checkPaymentStatus(effectiveOrderCode);

        if (result.ok && result.data) {
          const status =
            result.data.payment_status || result.data.transaction_status;
          if (status) setPaymentStatus(status);

          if (
            status === "paid" ||
            status === "settlement" ||
            status === "capture"
          ) {
            setIsRedirecting(true);
            localStorage.removeItem("payment_data");
            navigateRef.current.replace(
              `/payment/success?order=${effectiveOrderCode}`,
            );
            return;
          }

          if (status === "expired") {
            setIsExpired(true);
            setIsRedirecting(true);
            localStorage.removeItem("payment_data");
            return;
          }
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [orderCode, paymentData?.order_code, isExpired, isRedirecting]); // Removed navigate

  useEffect(() => {
    if ((isExpired || paymentStatus === "expired") && !isRedirecting) {
      setIsRedirecting(true);
      localStorage.removeItem("payment_data");
      navigateRef.current.replace(`/payment/failed?order=${orderCode}`);
    }
  }, [isExpired, paymentStatus, orderCode, isRedirecting]); // Removed navigate

  const handleExpired = () => {
    setIsExpired(true);
    setPaymentStatus("expired");
  };

  if (loading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Mengalihkan...</p>
      </div>
    );
  }

  if (!paymentData) return null;

  const {
    payment_method,
    grand_total,
    expired_at,
    va_number,
    payment_code,
    company_code,
    qr_code_url,
    deeplink,
  } = paymentData;

  const handleDownloadQr = () => {
    if (qr_code_url) window.open(qr_code_url, "_blank");
  };

  const getActionButtonText = () => {
    if (payment_method.category === "e_wallet")
      return `Buka ${payment_method.name}`;
    return "";
  };

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
      <main className="flex grow flex-col items-center justify-center bg-emerald-50/50 px-4 py-10">
        <div
          className={`w-full rounded-2xl bg-white p-8 shadow-xl ${payment_method.category === "bank_transfer" ? "max-w-xl" : "max-w-md"}`}
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-600 bg-emerald-600">
              <Icon
                icon="lucide:clock"
                width={65}
                height={65}
                className="text-white"
              />
            </div>
          </div>

          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Menunggu Pembayaran
          </h1>

          {expired_at && (
            <div className="mb-6 flex justify-center">
              <CountdownTimer
                expiredAt={expired_at}
                onExpired={handleExpired}
              />
            </div>
          )}

          {payment_method.category === "e_wallet" && (
            <>
              <div className="mb-4 flex items-center justify-between border-b pb-4">
                <span className="font-semibold text-gray-700">
                  Jumlah Pembayaran
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {currency(grand_total).replace("Rp", "Rp.")}
                </span>
              </div>
              <p className="mb-4 text-center text-sm text-gray-600">
                Klik tombol untuk membayar di aplikasi {payment_method.name}{" "}
                anda
              </p>
              {deeplink && (
                <div className="mb-6 flex justify-center">
                  <a
                    href={deeplink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 font-medium text-white transition-colors hover:bg-emerald-800"
                  >
                    <Icon icon="lucide:external-link" width={18} height={18} />
                    {getActionButtonText()}
                  </a>
                </div>
              )}
              {qr_code_url && (
                <div className="mb-6 text-center">
                  <p className="mb-3 text-sm text-gray-500">
                    Atau Scan QR Code:
                  </p>
                  <div
                    className="inline-block cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-2 transition-colors hover:border-emerald-500"
                    onClick={() => setShowQrPreview(true)}
                  >
                    <Image
                      src={qr_code_url}
                      alt="QR Code"
                      width={192}
                      height={192}
                      className="h-48 w-48 object-contain"
                    />
                  </div>
                  <button
                    onClick={handleDownloadQr}
                    className="mx-auto mt-3 flex items-center justify-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                  >
                    <Icon icon="lucide:download" width={16} height={16} />
                    Download
                  </button>
                </div>
              )}
              <div className="mb-6 space-y-1">
                {va_number && (
                  <DetailRow label="No. VA" value={va_number} isCopyable />
                )}
                <DetailRow
                  label="Metode Pembayaran"
                  value={payment_method.name}
                />
                <DetailRow label="ID Pesanan" value={paymentData.order_code} />
                <DetailRow label="Status Pesanan" value="Menunggu Pembayaran" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate.push("/cart")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                >
                  <Icon icon="lucide:shopping-cart" width={16} height={16} />
                  Belanja Lagi
                </button>
                <button
                  onClick={() =>
                    navigate.push(
                      `/payment/detail?order_code=${paymentData.order_code}`,
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  <Icon icon="lucide:package" width={16} height={16} />
                  Lihat Pesanan
                </button>
              </div>
            </>
          )}

          {payment_method.category === "qris" && (
            <>
              <div className="mb-4 flex items-center justify-between border-b pb-4">
                <span className="font-semibold text-gray-700">
                  Jumlah Pembayaran
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {currency(grand_total).replace("Rp", "Rp.")}
                </span>
              </div>
              {qr_code_url && (
                <div className="mb-6 text-center">
                  <p className="mb-3 text-sm text-gray-500">
                    Scan QR Code untuk Membayar:
                  </p>
                  <div
                    className="inline-block cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-2 transition-colors hover:border-emerald-500"
                    onClick={() => setShowQrPreview(true)}
                  >
                    <Image
                      src={qr_code_url}
                      alt="QR Code"
                      width={224}
                      height={224}
                      className="h-56 w-56 object-contain"
                    />
                  </div>
                  <button
                    onClick={handleDownloadQr}
                    className="mx-auto mt-3 flex items-center justify-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                  >
                    <Icon icon="lucide:download" width={16} height={16} />
                    Download
                  </button>
                </div>
              )}
              <div className="mb-6 space-y-1">
                <DetailRow
                  label="Metode Pembayaran"
                  value={payment_method.name}
                />
                <DetailRow label="ID Pesanan" value={paymentData.order_code} />
                <DetailRow label="Status Pesanan" value="Menunggu Pembayaran" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate.push("/cart")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                >
                  <Icon icon="lucide:shopping-cart" width={16} height={16} />
                  Belanja Lagi
                </button>
                <button
                  onClick={() =>
                    navigate.push(
                      `/payment/detail?order_code=${paymentData.order_code}`,
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  <Icon icon="lucide:package" width={16} height={16} />
                  Lihat Pesanan
                </button>
              </div>
            </>
          )}

          {payment_method.category === "bank_transfer" && (
            <>
              <div className="mt-4 mb-4 flex items-center justify-between border-b pt-4 pb-4">
                <span className="font-semibold text-gray-700">
                  Jumlah Pembayaran
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {currency(grand_total).replace("Rp", "Rp.")}
                </span>
              </div>
              {company_code && (
                <DetailRow
                  label="Kode Perusahaan"
                  value={company_code}
                  isCopyable
                />
              )}
              {payment_code && (
                <DetailRow
                  label="Kode Pembayaran"
                  value={payment_code}
                  isCopyable
                />
              )}
              {va_number && (
                <DetailRow
                  label="Nomor Virtual Account"
                  value={va_number}
                  isCopyable
                />
              )}
              <DetailRow
                label="Metode Pembayaran"
                value={payment_method.name}
              />
              <DetailRow label="ID Pesanan" value={paymentData.order_code} />
              <DetailRow label="Status Pesanan" value="Menunggu Pembayaran" />
              <div className="mt-6 flex justify-center">
                <div className="flex w-full max-w-md gap-3">
                  <button
                    onClick={() => navigate.push("/cart")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                  >
                    <Icon icon="lucide:shopping-cart" width={16} height={16} />
                    Belanja Lagi
                  </button>
                  <button
                    onClick={() =>
                      navigate.push(
                        `/payment/detail?order_code=${paymentData.order_code}`,
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    <Icon icon="lucide:package" width={16} height={16} />
                    Lihat Pesanan
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="text-center">
            <button
              onClick={() => setShowInstructions(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 py-2 font-medium text-emerald-700 hover:underline"
            >
              <Icon icon="lucide:info" width={16} height={16} />
              Cara Pembayaran
            </button>
          </div>
        </div>

        <div className="mt-6 w-full max-w-md rounded-full bg-emerald-100 px-4 py-3 text-center text-emerald-700">
          <div className="flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap">
            <Icon icon="lucide:info" width={16} height={16} />
            Halaman ini akan diperbarui ketika pembayaran selesai
          </div>
        </div>

        <p className="mt-4 max-w-md text-center text-xs text-gray-500">
          Dengan melanjutkan, artinya Anda setuju dengan{" "}
          <a href="#" className="text-emerald-600 hover:underline">
            Syarat dan Ketentuan
          </a>{" "}
          dan juga{" "}
          <a href="#" className="text-emerald-600 hover:underline">
            Kebijakan Privasi
          </a>{" "}
          Kami.
        </p>
      </main>
      <Footer />

      {showQrPreview && qr_code_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowQrPreview(false)}
          />
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => setShowQrPreview(false)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="lucide:x" width={24} height={24} />
            </button>
            <h3 className="mb-6 text-center text-xl font-bold">QR Code</h3>
            <div className="flex justify-center">
              <Image
                src={qr_code_url}
                alt="QR Code Large"
                width={384}
                height={384}
                className="h-96 w-96 object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <PaymentInstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        paymentMethod={payment_method}
      />
    </div>
  );
}

export default function WaitingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Mengalihkan...</p>
        </div>
      }
    >
      <WaitingPageContent />
    </Suspense>
  );
}
