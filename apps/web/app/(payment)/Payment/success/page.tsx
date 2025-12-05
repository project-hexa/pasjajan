"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle, User, DollarSign, Package, Home, Receipt } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderData {
    order_code: string;
    customer_name: string;
    grand_total: string;
    payment_method?: {
        name: string;
    };
    payment_status: string;
    created_at: string;
}

const currency = (n: number | string) => {
    const num = typeof n === 'string' ? parseFloat(n) : n;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(num);
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" }> = 
    ({ children, variant = "primary", className = "", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors px-6 py-3";
    const variantStyles = variant === "primary" 
        ? "bg-[#14532D] text-white hover:bg-emerald-700 shadow-md" 
        : "border-2 border-[#14532D] text-[#14532D] bg-white hover:bg-emerald-50";
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

export default function SuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("order");
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderCode) {
                router.push("/");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/orders/${orderCode}`);
                const result = await res.json();
                
                if (result.success && result.data.order) {
                    setOrderData(result.data.order);
                } else {
                    alert("Order tidak ditemukan!");
                    router.push("/");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                alert("Gagal memuat data order!");
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderCode, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50/50">
                <p className="text-lg">Memuat...</p>
            </div>
        );
    }

    if (!orderData) {
        return null;
    }

    const primaryColor = '#14532D';

    return (
        <div className="min-h-screen flex flex-col bg-emerald-50/50">
            <Header username="John Doe" />
            
            <main className="flex-grow flex items-center justify-center py-10 px-4">
                <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-xl shadow-2xl">
                    
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-green-100 p-6">
                            <CheckCircle className="w-20 h-20 text-green-600" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">
                        Pembayaran Berhasil!
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Terima kasih telah berbelanja di PasJajan
                    </p>

                    {/* Order Details */}
                    <div className="bg-emerald-50 rounded-lg p-6 mb-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-emerald-200">
                                <span className="text-gray-600 text-sm">Total Pembayaran</span>
                                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                    {currency(orderData.grand_total)}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">No. Order</span>
                                <span className="font-semibold text-gray-800">{orderData.order_code}</span>
                            </div>
                            
                            {orderData.payment_method && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Metode Pembayaran</span>
                                    <span className="font-semibold text-gray-800">{orderData.payment_method.name}</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">Status</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Lunas
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <div className="flex items-start">
                            <Receipt className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-blue-900 font-medium mb-1">
                                    Pesanan Anda Sedang Diproses
                                </p>
                                <p className="text-xs text-blue-700">
                                    Kami akan segera memproses pesanan Anda. Detail pemesanan telah dikirim ke email Anda.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => router.push('/')}
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Kembali ke Beranda
                        </Button>
                        <Button 
                            variant="primary" 
                            className="flex-1"
                            onClick={() => router.push('/orders')}
                        >
                            <Package className="w-5 h-5 mr-2" />
                            Lihat Pesanan
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
