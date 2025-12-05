"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Copy, User, Info, DollarSign, CheckCircle, Package, ExternalLink, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaymentInstructionsModal } from '@/components/PaymentInstructionsModal';

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

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "danger" }> = 
    ({ children, variant = "primary", className = "", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors px-6 py-3";
    const variantStyles = variant === "primary" 
        ? "bg-[#14532D] text-white hover:bg-emerald-700" 
        : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "border border-[#14532D] text-[#14532D] bg-white hover:bg-emerald-50";
    return <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>{children}</button>;
};

const Header: React.FC<{ username: string }> = ({ username }) => (
    <nav className="sticky top-0 z-10 w-full bg-[#14532D] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                    <span className="text-xl font-bold text-white flex items-center">
                        <DollarSign className="w-6 h-6 mr-2" />PasJajan
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-white text-sm hidden sm:block">{username}</span>
                    <div className="p-2 rounded-full bg-emerald-700 text-white">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    </nav>
);

const Footer: React.FC = () => (
    <footer className="w-full py-4 text-center text-xs text-gray-500 border-t bg-white">
        &copy; {new Date().getFullYear()} PasJajan - All Right Reserved
    </footer>
);

const DetailItem: React.FC<{ label: string; value: string; isCopyable?: boolean }> = ({ label, value, isCopyable }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">{label}</span>
            <div className="flex items-center font-semibold text-gray-800 space-x-2">
                <span>{value}</span>
                {isCopyable && (
                    <button title={copied ? "Tersalin!" : "Salin"} onClick={handleCopy}
                        className="text-gray-400 hover:text-[#14532D] p-1 rounded-full hover:bg-gray-100">
                        <Copy className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
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

    return (
        <div className={`text-center py-2 px-4 rounded-lg ${isExpired ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
            <div className="flex items-center justify-center gap-2">
                {isExpired ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <span className="font-semibold">
                    {isExpired ? 'Pembayaran Kadaluarsa' : `Bayar dalam ${timeLeft}`}
                </span>
            </div>
        </div>
    );
};

// Expired Page Component
const ExpiredView: React.FC<{ orderCode: string; grandTotal: string; onBackHome: () => void }> = 
    ({ orderCode, grandTotal, onBackHome }) => (
    <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl text-center">
        <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 p-6">
                <XCircle className="w-20 h-20 text-red-600" />
            </div>
        </div>
        <h1 className="text-3xl font-bold mb-3 text-gray-800">Pembayaran Gagal</h1>
        <p className="text-gray-600 mb-6">Waktu pembayaran telah habis</p>
        
        <div className="bg-red-50 rounded-lg p-4 mb-6 text-left space-y-2">
            <DetailItem label="No. Order" value={orderCode} />
            <DetailItem label="Total" value={currency(grandTotal)} />
            <DetailItem label="Status" value="Kadaluarsa" />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
                Silakan buat pesanan baru jika Anda masih ingin melanjutkan pembelian.
            </p>
        </div>

        <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={onBackHome}>
                <CheckCircle className="w-5 h-5 mr-2" />Kembali ke Beranda
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/cart'}>
                <Package className="w-5 h-5 mr-2" />Belanja Lagi
            </Button>
        </div>
    </div>
);

export default function WaitingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("order");
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<string>('pending');
    const [isExpired, setIsExpired] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [pollingProgress, setPollingProgress] = useState(0);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("payment_data");
        if (data) {
            const parsed = JSON.parse(data);
            setPaymentData(parsed);
            
            // Check if already expired from localStorage
            if (parsed.payment_status === 'expired') {
                setIsExpired(true);
                setPaymentStatus('expired');
            }
        } else {
            alert("Data pembayaran tidak ditemukan!");
            router.push("/");
        }
        setLoading(false);
    }, [router]);

    // Auto-check payment status
    useEffect(() => {
        if (!orderCode || isExpired) return;

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
                    
                    // Handle paid status - complete progress bar first
                    if (status === 'paid' || status === 'settlement' || status === 'capture') {
                        // Stop progress animation and complete to 100%
                        if (progressIntervalRef.current) {
                            clearInterval(progressIntervalRef.current);
                        }
                        setPollingProgress(100);
                        
                        // Wait for progress bar to complete, then redirect
                        setTimeout(() => {
                            localStorage.removeItem("payment_data");
                            router.push(`/payment/success?order=${orderCode}`);
                        }, 800);
                        return;
                    }
                    
                    // Handle expired status - complete progress bar first
                    if (status === 'expired') {
                        // Stop progress animation and complete to 100%
                        if (progressIntervalRef.current) {
                            clearInterval(progressIntervalRef.current);
                        }
                        setPollingProgress(100);
                        
                        // Wait for progress bar to complete, then show expired view
                        setTimeout(() => {
                            setIsExpired(true);
                            localStorage.removeItem("payment_data");
                        }, 800);
                        return;
                    }
                }
            } catch (err) {
                console.error("Error checking status:", err);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 5000);
        
        // Progress bar animation - updates every 50ms for smooth animation
        const startProgressAnimation = () => {
            setPollingProgress(0);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            progressIntervalRef.current = setInterval(() => {
                setPollingProgress(prev => {
                    if (prev >= 100) return 0;
                    return prev + 1; // 100 steps over 5 seconds = 50ms per step
                });
            }, 50);
        };
        
        startProgressAnimation();
        
        return () => {
            clearInterval(interval);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [orderCode, router, isExpired]);

    const handleExpired = () => {
        setIsExpired(true);
        setPaymentStatus('expired');
        localStorage.removeItem("payment_data");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Memuat...</p></div>;
    }

    if (!paymentData) {
        return null;
    }

    const { payment_method, grand_total, expired_at, created_at } = paymentData;
    const primaryColor = '#14532D';

    // Show expired view
    if (isExpired || paymentStatus === 'expired') {
        return (
            <div className="min-h-screen flex flex-col bg-red-50/50">
                <Header username="John Doe" />
                <main className="flex-grow flex items-center justify-center py-10 px-4">
                    <ExpiredView 
                        orderCode={orderCode || paymentData.order_code} 
                        grandTotal={grand_total}
                        onBackHome={() => router.push('/')}
                    />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-emerald-50/50">
            <Header username="John Doe" />
            <main className="flex-grow flex items-center justify-center py-10 px-4">
                <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
                    <h1 className="text-3xl font-bold text-center mb-6">Menunggu Pembayaran</h1>
                    
                    {/* Countdown Timer */}
                    {expired_at && (
                        <div className="mb-6">
                            <CountdownTimer expiredAt={expired_at} onExpired={handleExpired} />
                        </div>
                    )}

                    <div className="flex justify-center mb-6">
                        <Clock className="w-16 h-16 text-white p-3 rounded-full"
                            style={{ backgroundColor: primaryColor }} />
                    </div>
                    
                    <div className="flex justify-between items-center mb-6 py-2 border-b">
                        <span className="font-medium text-lg">Jumlah Pembayaran</span>
                        <span className="font-bold text-2xl" style={{ color: primaryColor }}>
                            {currency(grand_total)}
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        {payment_method.category === 'qris' && paymentData.qr_code_url && (
                            <div className="text-center py-4">
                                <p className="text-sm font-semibold mb-4">Scan QR Code untuk membayar</p>
                                <div className="bg-white p-4 rounded-lg border-2 inline-block">
                                    <img src={paymentData.qr_code_url} alt="QR Code" className="w-64 h-64 object-contain" />
                                </div>
                            </div>
                        )}
                        {payment_method.category === 'e_wallet' && paymentData.deeplink && (
                            <div className="text-center py-4">
                                <p className="text-sm font-semibold mb-4">
                                    Klik tombol untuk membayar di aplikasi {payment_method.name}
                                </p>
                                <a href={paymentData.deeplink} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800">
                                    <ExternalLink className="w-5 h-5 mr-2" />
                                    Buka {payment_method.name}
                                </a>
                                {paymentData.qr_code_url && (
                                    <div className="mt-6">
                                        <p className="text-sm text-gray-600 mb-2">Atau scan QR Code:</p>
                                        <div className="bg-white p-4 rounded-lg border-2 inline-block">
                                            <img src={paymentData.qr_code_url} alt="QR Code" className="w-48 h-48 object-contain" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {payment_method.category === 'bank_transfer' && paymentData.va_number && (
                            <>
                                <DetailItem label="No. Virtual Account" value={paymentData.va_number} isCopyable={true} />
                                <DetailItem label="Bank" value={paymentData.bank?.toUpperCase() || payment_method.name} />
                            </>
                        )}
                        {payment_method.category === 'bank_transfer' && paymentData.payment_code && (
                            <>
                                <DetailItem label="Kode Perusahaan" value={paymentData.company_code || "-"} isCopyable={true} />
                                <DetailItem label="Kode Pembayaran" value={paymentData.payment_code} isCopyable={true} />
                            </>
                        )}
                        <DetailItem label="Metode Pembayaran" value={payment_method.name} />
                        <DetailItem label="No. Order" value={paymentData.order_code} />
                        {created_at && (
                            <DetailItem label="Waktu Pesanan" value={formatDateTime(created_at)} />
                        )}
                        {expired_at && (
                            <DetailItem label="Batas Pembayaran" value={formatDateTime(expired_at)} />
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-10">
                        <Button variant="primary" onClick={() => router.push('/')}>
                            <CheckCircle className="w-5 h-5 mr-2" />Beranda
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/orders')}>
                            <Package className="w-5 h-5 mr-2" />Lihat Pesanan
                        </Button>
                    </div>
                    <div className="text-center mt-6">
                        <button 
                            onClick={() => setShowInstructions(true)}
                            className="inline-flex items-center text-sm font-medium hover:underline transition-colors" 
                            style={{ color: primaryColor }}
                        >
                            <Info className="w-4 h-4 mr-1" />Cara Pembayaran
                        </button>
                    </div>
                    
                    {/* Polling Progress Bar */}
                    <div className="mt-8 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
                            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                            <span>Status akan diperbarui otomatis</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-emerald-500 transition-all duration-100 ease-linear rounded-full"
                                style={{ width: `${pollingProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            
            {/* Payment Instructions Modal */}
            <PaymentInstructionsModal 
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                paymentMethod={payment_method}
            />
        </div>
    );
}