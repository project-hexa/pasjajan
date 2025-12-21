"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Icon } from "@workspace/ui/components/icon";
import { useSearchParams } from 'next/navigation';
import { useNavigate } from "@/hooks/useNavigate";
import { PaymentInstructionsModal } from '@/components/PaymentInstructionsModal';
import Image from 'next/image';

interface PaymentData {
    order_code: string;
    payment_method: {
        code: string;
        name: string;
        category: string;
    };
    payment_status: string;
    grand_total: string;
    created_at?: string;
    expired_at?: string;
    qr_code_url?: string;
    deeplink?: string;
    va_number?: string;
    bank?: string;
    payment_code?: string;
    company_code?: string;
}

const currency = (n: number | string) => {
    const num = typeof n === 'string' ? parseFloat(n) : n;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(num);
};

// Countdown Timer Component
const CountdownTimer: React.FC<{ expiredAt: string; onExpired: () => void }> = ({ expiredAt, onExpired }) => {
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
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [expiredAt, onExpired]);

    if (isExpired) return null;

    return (
        <div className="flex items-center justify-center gap-2 bg-amber-100 text-amber-700 py-2 px-6 rounded-full">
            <Icon icon="lucide:alert-triangle" width={18} height={18} />
            <span className="font-semibold text-sm">Bayar Dalam {timeLeft}</span>
        </div>
    );
};

// Detail Row Component
const DetailRow: React.FC<{ label: string; value: string; isCopyable?: boolean }> = 
    ({ label, value, isCopyable }) => {
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
            </div>
        </div>
    );
};

function WaitingPageContent() {
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("order");
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<string>('pending');
    const [isExpired, setIsExpired] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showQrPreview, setShowQrPreview] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Load payment data from localStorage or API
    useEffect(() => {
        const loadPaymentData = async () => {
            const data = localStorage.getItem("payment_data");
            if (data) {
                const parsed = JSON.parse(data);
                setPaymentData(parsed);
                
                if (parsed.payment_status === 'expired') {
                    setIsExpired(true);
                    setPaymentStatus('expired');
                }
                setLoading(false);
            } else if (orderCode) {
                // No localStorage data, try to fetch from API
                try {
                    const res = await fetch(`http://localhost:8000/api/orders/${orderCode}`);
                    const result = await res.json();
                    
                    if (result.success && result.data.order) {
                        const order = result.data.order;
                        const status = order.payment_status;
                        
                        // Check payment status FIRST before checking expired_at
                        if (status === 'paid' || status === 'settlement' || status === 'capture') {
                            setIsRedirecting(true);
                            navigate.replace(`/payment/success?order=${orderCode}`);
                            return;
                        }
                        
                        if (status === 'expired' || status === 'failed' || status === 'cancelled') {
                            setIsRedirecting(true);
                            navigate.replace(`/payment/failed?order=${orderCode}`);
                            return;
                        }
                        
                        // Check if order is expired based on timestamp (for pending orders)
                        const expiredAt = order.expired_at ? new Date(order.expired_at).getTime() : null;
                        const now = Date.now();
                        
                        if (expiredAt && now > expiredAt) {
                            // Order is expired, redirect to failed
                            setIsRedirecting(true);
                            navigate.replace(`/payment/failed?order=${orderCode}`);
                            return;
                        }
                        
                        // Order is still pending, set minimal payment data for display
                        setPaymentData({
                            order_code: order.order_code,
                            payment_method: order.payment_method || { code: '', name: 'Unknown', category: 'bank_transfer' },
                            payment_status: order.payment_status,
                            grand_total: order.grand_total,
                            expired_at: order.expired_at,
                            va_number: order.va_number,
                            payment_code: order.payment_code,
                        });
                    } else {
                        // Order not found
                        alert("Order tidak ditemukan!");
                        navigate.push("/");
                    }
                } catch (error) {
                    console.error("Error fetching order:", error);
                    alert("Gagal memuat data order!");
                    navigate.push("/");
                }
                setLoading(false);
            } else {
                // No localStorage and no orderCode
                alert("Data pembayaran tidak ditemukan!");
                navigate.push("/");
                setLoading(false);
            }
        };

        loadPaymentData();
    }, [router, orderCode]);

    // Auto-check payment status
    useEffect(() => {
        if (!orderCode || isExpired || isRedirecting) return;

        const checkStatus = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/payment/check-status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order_code: orderCode }),
                });
                const result = await res.json();
                
                if (result.success && result.data) {
                    const status = result.data.payment_status || result.data.transaction_status;
                    setPaymentStatus(status);
                    
                    if (status === 'paid' || status === 'settlement' || status === 'capture') {
                        setIsRedirecting(true);
                        localStorage.removeItem("payment_data");
                        navigate.replace(`/payment/success?order=${orderCode}`);
                        return;
                    }
                    
                    if (status === 'expired') {
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
        
        return () => {
            clearInterval(interval);
        };
    }, [orderCode, router, isExpired, isRedirecting]);

    // Redirect to failed page when expired
    useEffect(() => {
        if ((isExpired || paymentStatus === 'expired') && !isRedirecting) {
            setIsRedirecting(true);
            localStorage.removeItem("payment_data");
            navigate.replace(`/payment/failed?order=${orderCode}`);
        }
    }, [isExpired, paymentStatus, navigate, orderCode, isRedirecting]);

    const handleExpired = () => {
        setIsExpired(true);
        setPaymentStatus('expired');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Mengalihkan...</p></div>;
    }

    if (!paymentData) {
        return null;
    }

    const { payment_method, grand_total, expired_at, va_number, payment_code, company_code, qr_code_url, deeplink } = paymentData;

    // If redirecting, show loading and don't render content
    if (isRedirecting) {
        return <div className="min-h-screen flex items-center justify-center"><p>Mengalihkan...</p></div>;
    }

    const handleDownloadQr = () => {
        if (qr_code_url) {
            window.open(qr_code_url, '_blank');
        }
    };

    const getActionButtonText = () => {
        if (payment_method.category === 'e_wallet') {
            return `Buka ${payment_method.name}`;
        }
        return '';
    };

    return (
        <div className="min-h-screen flex flex-col bg-emerald-50/50">
            <main className="flex-grow flex flex-col items-center justify-center py-10 px-4">
                <div className={`w-full bg-white rounded-2xl shadow-xl p-8 ${
                    payment_method.category === 'bank_transfer' ? 'max-w-xl' : 'max-w-md'
                }`}>
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full border-4 border-emerald-600 flex items-center justify-center bg-emerald-600">
                            <Icon icon="lucide:clock" width={65} height={65} className="text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
                        Menunggu Pembayaran
                    </h1>

                    {/* Countdown Timer */}
                    {expired_at && (
                        <div className="flex justify-center mb-6">
                            <CountdownTimer expiredAt={expired_at} onExpired={handleExpired} />
                        </div>
                    )}

                    {/* E-Wallet Layout */}
                    {payment_method.category === 'e_wallet' && (
                        <>
                            {/* Amount */}
                            <div className="flex justify-between items-center pb-4 mb-4 border-b">
                                <span className="font-semibold text-gray-700">Jumlah Pembayaran</span>
                                <span className="text-xl font-bold text-emerald-600">
                                    {currency(grand_total).replace('Rp', 'Rp.')}
                                </span>
                            </div>

                            {/* Action Info */}
                            <p className="text-center text-sm text-gray-600 mb-4">
                                Klik tombol untuk membayar di aplikasi {payment_method.name} anda
                            </p>

                            {/* Open App Button */}
                            {deeplink && (
                                <div className="flex justify-center mb-6">
                                    <a 
                                        href={deeplink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 px-6 rounded-xl font-medium hover:bg-emerald-800 transition-colors"
                                    >
                                        <Icon icon="lucide:external-link" width={18} height={18} />
                                        {getActionButtonText()}
                                    </a>
                                </div>
                            )}

                            {/* QR Code Section */}
                            {qr_code_url && (
                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-500 mb-3">Atau Scan QR Code:</p>
                                    <div 
                                        className="inline-block border-2 border-gray-200 rounded-xl p-2 bg-white cursor-pointer hover:border-emerald-500 transition-colors"
                                        onClick={() => setShowQrPreview(true)}
                                    >
                                        <Image src={qr_code_url} alt="QR Code" className="w-48 h-48 object-contain" width={192} height={192} />
                                    </div>
                                    <button 
                                        onClick={handleDownloadQr}
                                        className="flex items-center justify-center gap-2 mx-auto mt-3 border border-emerald-600 text-emerald-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
                                    >
                                        <Icon icon="lucide:download" width={16} height={16} />
                                        Download
                                    </button>
                                </div>
                            )}

                            {/* Details */}
                            <div className="space-y-1 mb-6">
                                {va_number && <DetailRow label="No. VA" value={va_number} isCopyable />}
                                <DetailRow label="Metode Pembayaran" value={payment_method.name} />
                                <DetailRow label="ID Pesanan" value={paymentData.order_code} />
                                <DetailRow label="Status Pesanan" value="Menunggu Pembayaran" />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => router.push('/cart')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors"
                                >
                                    <Icon icon="lucide:shopping-cart" width={16} height={16} />
                                    Belanja Lagi
                                </button>
                                <button 
                                    onClick={() => router.push('/orders')}
                                    className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors"
                                >
                                    <Icon icon="lucide:package" width={16} height={16} />
                                    Lihat Pesanan
                                </button>
                            </div>
                        </>
                    )}

                    {/* QRIS Layout */}
                    {payment_method.category === 'qris' && (
                        <>
                            {/* Amount */}
                            <div className="flex justify-between items-center pb-4 mb-4 border-b">
                                <span className="font-semibold text-gray-700">Jumlah Pembayaran</span>
                                <span className="text-xl font-bold text-emerald-600">
                                    {currency(grand_total).replace('Rp', 'Rp.')}
                                </span>
                            </div>

                            {/* QR Code Section */}
                            {qr_code_url && (
                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-500 mb-3">Scan QR Code untuk Membayar:</p>
                                    <div 
                                        className="inline-block border-2 border-gray-200 rounded-xl p-2 bg-white cursor-pointer hover:border-emerald-500 transition-colors"
                                        onClick={() => setShowQrPreview(true)}
                                    >
                                        <Image src={qr_code_url} alt="QR Code" className="w-56 h-56 object-contain" width={224} height={224} />
                                    </div>
                                    <button 
                                        onClick={handleDownloadQr}
                                        className="flex items-center justify-center gap-2 mx-auto mt-3 border border-emerald-600 text-emerald-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
                                    >
                                        <Icon icon="lucide:download" width={16} height={16} />
                                        Download
                                    </button>
                                </div>
                            )}

                            {/* Details */}
                            <div className="space-y-1 mb-6">
                                <DetailRow label="Metode Pembayaran" value={payment_method.name} />
                                <DetailRow label="ID Pesanan" value={paymentData.order_code} />
                                <DetailRow label="Status Pesanan" value="Menunggu Pembayaran" />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => navigate.push('/cart')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors"
                                >
                                    <Icon icon="lucide:shopping-cart" width={16} height={16} />
                                    Belanja Lagi
                                </button>
                                <button 
                                    onClick={() => navigate.push('/orders')}
                                    className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors"
                                >
                                    <Icon icon="lucide:package" width={16} height={16} />
                                    Lihat Pesanan
                                </button>
                            </div>
                        </>
                    )}

                    {/* Bank Transfer Layout */}
                    {payment_method.category === 'bank_transfer' && (
                        <>
                            {/* Amount */}
                            <div className="flex justify-between items-center pt-4 mt-4 pb-4 mb-4 border-b">
                                <span className="font-semibold text-gray-700">Jumlah Pembayaran</span>
                                <span className="text-xl font-bold text-emerald-600">
                                    {currency(grand_total).replace('Rp', 'Rp.')}
                                </span>
                            </div>
                            {/* VA/Payment Code Display */}
                            {company_code && (
                                <DetailRow label="Kode Perusahaan" value={company_code} isCopyable />
                            )}
                            {payment_code && (
                                <DetailRow label="Kode Pembayaran" value={payment_code} isCopyable />
                            )}
                            {va_number && (
                                <DetailRow label="Nomor Virtual Account" value={va_number} isCopyable />
                            )}
                            <DetailRow label="Metode Pembayaran" value={payment_method.name} />
                            <DetailRow label="ID Pesanan" value={paymentData.order_code} />
                            <DetailRow label="Status Pesanan" value="Menunggu Pembayaran" />

                            {/* Action Buttons */}
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-3 w-full max-w-md">
                                    <button 
                                        onClick={() => navigate.push('/cart')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors"
                                    >
                                        <Icon icon="lucide:shopping-cart" width={16} height={16} />
                                        Belanja Lagi
                                    </button>
                                    <button 
                                        onClick={() => navigate.push('/orders')}
                                        className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors"
                                    >
                                        <Icon icon="lucide:package" width={16} height={16} />
                                        Lihat Pesanan
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Payment Instructions Link */}
                    <div className="text-center">
                        <button 
                            onClick={() => setShowInstructions(true)}
                            className="flex items-center justify-center gap-2 w-full mt-4 text-emerald-700 py-2 font-medium hover:underline"
                        >
                            <Icon icon="lucide:info" width={16} height={16} />
                            Cara Pembayaran
                        </button>
                    </div>
                </div>

                {/* Outside card - Status Bar */}
                <div className="w-full max-w-md mt-6 bg-emerald-100 text-emerald-700 py-3 px-4 rounded-full text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap">
                        <Icon icon="lucide:info" width={16} height={16} />
                        Halaman ini akan diperbarui ketika pembayaran selesai
                    </div>
                </div>

                {/* Terms Footer */}
                <p className="text-xs text-gray-500 text-center mt-4 max-w-md">
                    Dengan melanjutkan, artinya Anda setuju dengan{' '}
                    <a href="#" className="text-emerald-600 hover:underline">Syarat dan Ketentuan</a>
                    {' '}dan juga{' '}
                    <a href="#" className="text-emerald-600 hover:underline">Kebijakan Privasi</a>
                    {' '}Kami.
                </p>
            </main>
            
            {/* QR Preview Modal */}
            {showQrPreview && qr_code_url && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowQrPreview(false)} />
                    
                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl">
                        <button 
                            onClick={() => setShowQrPreview(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                        >
                            <Icon icon="lucide:x" width={24} height={24} />
                        </button>
                        
                        <h3 className="text-xl font-bold text-center mb-6">QR Code</h3>
                        
                        <div className="flex justify-center">
                            <Image src={qr_code_url} alt="QR Code Large" className="w-96 h-96 object-contain" width={384} height={384} />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Payment Instructions Modal */}
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
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p>Mengalihkan...</p>
            </div>
        }>
            <WaitingPageContent />
        </Suspense>
    );
}