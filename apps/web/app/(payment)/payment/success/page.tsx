"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Icon } from "@workspace/ui/components/icon";
import { useRouter, useSearchParams } from 'next/navigation';

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
    const num = typeof n === 'string' ? parseFloat(n) : n;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(num);
};

// Detail Row Component
const DetailRow: React.FC<{ label: string; value: string; isCopyable?: boolean; isStatus?: boolean }> = 
    ({ label, value, isCopyable, isStatus }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 text-sm">{label}</span>
            <div className="flex items-center gap-2">
                {isStatus ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Icon icon="lucide:check-circle" width={14} height={14} />
                        Lunas
                    </span>
                ) : (
                    <>
                        {isCopyable && (
                            <button 
                                title={copied ? "Tersalin!" : "Salin"} 
                                onClick={handleCopy}
                                className="text-gray-400 hover:text-emerald-700 p-1"
                            >
                                <Icon icon="lucide:copy" width={14} height={14} />
                            </button>
                        )}
                        <span className="text-gray-800 font-medium text-sm">{value}</span>
                    </>
                )}
            </div>
        </div>
    );
};

function SuccessPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("order");
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const validateAndFetchOrder = async () => {
            if (!orderCode) {
                router.push("/");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/orders/${orderCode}`);
                const result = await res.json();
                
                if (!result.success || !result.data.order) {
                    alert("Order tidak ditemukan!");
                    router.push("/");
                    return;
                }

                const order = result.data.order;
                const paymentStatus = order.payment_status;

                // Validate: only show success page if status is actually paid
                if (paymentStatus === 'pending') {
                    // Check if expired
                    const expiredAt = order.expired_at ? new Date(order.expired_at).getTime() : null;
                    const now = Date.now();
                    
                    if (expiredAt && now > expiredAt) {
                        // Expired, redirect to failed
                        setIsRedirecting(true);
                        router.replace(`/payment/failed?order=${orderCode}`);
                        return;
                    } else {
                        // Still pending, redirect to waiting
                        setIsRedirecting(true);
                        router.replace(`/payment/waiting?order=${orderCode}`);
                        return;
                    }
                }

                if (paymentStatus === 'expired' || paymentStatus === 'failed' || paymentStatus === 'cancelled') {
                    // Redirect to failed page
                    setIsRedirecting(true);
                    router.replace(`/payment/failed?order=${orderCode}`);
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
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        validateAndFetchOrder();
    }, [orderCode, router]);

    // Show loading while redirecting or loading
    if (loading || isRedirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Mengalihkan...</p>
            </div>
        );
    }

    if (!orderData) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-emerald-50/50">
            <main className="flex-grow flex items-center justify-center py-10 px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full border-4 border-emerald-600 flex items-center justify-center bg-emerald-600">
                            <Icon icon="lucide:check" width={65} height={65} className="text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
                        Pembayaran Berhasil!
                    </h1>

                    {/* Detail Card */}
                    <div className="bg-emerald-50 rounded-xl p-5 mb-6">
                        {/* Amount Header with bottom border */}
                        <div className="flex justify-between items-center pb-3 mb-4 border-b border-emerald-200">
                            <span className="font-semibold text-gray-700">Jumlah Pembayaran</span>
                            <span className="text-xl font-bold text-emerald-600">
                                {currency(orderData.grand_total).replace('Rp', 'Rp.')}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                            {orderData.va_number && (
                                <DetailRow label="No. VA" value={orderData.va_number} isCopyable />
                            )}
                            {orderData.payment_code && (
                                <DetailRow label="Kode Pembayaran" value={orderData.payment_code} isCopyable />
                            )}
                            {orderData.payment_method && (
                                <DetailRow label="Metode Pembayaran" value={orderData.payment_method.name} />
                            )}
                            <DetailRow label="ID Pesanan" value={orderData.order_code} />
                            <DetailRow label="Status" value="Lunas" isStatus />
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                            <Icon icon="lucide:package" width={20} height={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                                Pesanan Anda Sedang Diproses
                            </p>
                            <p className="text-xs text-blue-700">
                                Kami akan segera memproses pesanan Anda. Detail pemesanan telah dikirim ke email Anda
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button 
                            onClick={() => router.push('/cart')}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 px-4 rounded-xl font-medium hover:bg-emerald-800 transition-colors"
                        >
                            <Icon icon="lucide:shopping-cart" width={18} height={18} />
                            Belanja Lagi
                        </button>
                        <button 
                            onClick={() => router.push('/orders')}
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 py-3 px-4 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
                        >
                            <Icon icon="lucide:package" width={18} height={18} />
                            Lihat Pesanan
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p>Mengalihkan...</p>
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}
