"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from "@workspace/ui/components/icon";
import { useRouter, useSearchParams } from 'next/navigation';

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
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <Icon icon="lucide:x-circle" width={14} height={14} />
                        Gagal
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

export default function FailedPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("order");
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get payment data from localStorage
        const paymentDataStr = localStorage.getItem("payment_data");
        
        if (paymentDataStr) {
            try {
                const data = JSON.parse(paymentDataStr);
                setPaymentData(data);
            } catch (error) {
                console.error("Error parsing payment data:", error);
            }
        }
        
        // If no payment data, try to fetch from API
        if (!paymentDataStr && orderCode) {
            const fetchOrder = async () => {
                try {
                    const res = await fetch(`http://localhost:8000/api/orders/${orderCode}`);
                    const result = await res.json();
                    
                    if (result.success && result.data.order) {
                        setPaymentData({
                            order_code: result.data.order.order_code || orderCode,
                            payment_method: result.data.order.payment_method || { code: '', name: 'Unknown', category: '' },
                            grand_total: result.data.order.grand_total,
                            va_number: result.data.order.va_number,
                            payment_code: result.data.order.payment_code,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching order:", error);
                }
            };
            fetchOrder();
        }
        
        setLoading(false);
    }, [orderCode]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50/50">
                <p className="text-lg">Memuat...</p>
            </div>
        );
    }

    if (!paymentData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50/50 p-4">
                <p className="text-gray-600 mb-4">Data pembayaran tidak ditemukan</p>
                <button 
                    onClick={() => router.push('/cart')}
                    className="bg-emerald-700 text-white py-2 px-4 rounded-lg hover:bg-emerald-800"
                >
                    Kembali ke Keranjang
                </button>
            </div>
        );
    }

    const { payment_method, grand_total, va_number, payment_code, order_code } = paymentData;

    return (
        <div className="min-h-screen flex flex-col bg-emerald-50/50">
            <main className="flex-grow flex items-center justify-center py-10 px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full border-4 border-red-700 flex items-center justify-center bg-red-700">
                            <Icon icon="lucide:x" width={65} height={65} className="text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
                        Pembayaran Gagal
                    </h1>

                    {/* Detail Card */}
                    <div className="bg-red-50 rounded-xl p-5 mb-6">
                        {/* Amount */}
                        <div className="flex justify-between items-center pb-3 mb-4 border-b border-red-200">
                            <span className="font-semibold text-gray-700">Jumlah Pembayaran</span>
                            <span className="text-xl font-bold text-red-500">
                                {currency(grand_total).replace('Rp', 'Rp.')}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                            {/* {va_number && (
                                <DetailRow label="No. VA" value={va_number} isCopyable />
                            )}
                            {payment_code && (
                                <DetailRow label="Kode Pembayaran" value={payment_code} isCopyable />
                            )} */}
                            <DetailRow label="Metode Pembayaran" value={payment_method.name} />
                            <DetailRow label="ID Pesanan" value={order_code} />
                            <DetailRow label="Status" value="Gagal" isStatus />
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-amber-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <div>
                            <p className="text-xs text-amber-700 text-center">
                                Silahkan buat pesanan baru jika Anda masih ingin melanjutkan pembelian
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
