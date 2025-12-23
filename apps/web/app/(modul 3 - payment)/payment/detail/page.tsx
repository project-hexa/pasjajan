"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { Icon } from "@workspace/ui/components/icon";
import { Navbar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/ui/footer";
import { useAuthStore } from "@/app/(modul 1 - user management)/_stores/useAuthStore";

interface OrderItem {
    product_id: number;
    product_name: string;
    product_image: string | null;
    price: number;
    quantity: number;
    sub_total: number;
}

interface OrderDetail {
    id: number;
    code: string;
    status: string;
    payment_status: string;
    customer_name: string;
    customer_phone: string;
    shipping_address: string;
    shipping_recipient_name: string;
    shipping_recipient_phone: string;
    payment_method: {
        name: string;
        code: string;
        category: string;
    } | null;
    grand_total: number;
    sub_total: number;
    shipping_fee: number;
    admin_fee: number;
    discount: number;
    created_at: string;
    expired_at: string | null;
    paid_at: string | null;
    va_number?: string;
    items: OrderItem[];
}

const currency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val);
};

function OrderDetailPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("order_code");
    const { user } = useAuthStore();

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderCode) {
            router.push("/orders");
            return;
        }

        const fetchOrder = async () => {
            try {
                const token = Cookies.get("token");
                const res = await fetch(`http://localhost:8000/api/orders/${orderCode}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const result = await res.json();

                if (result.success && result.data.order) {
                    const data = result.data.order;

                    setOrder(data);
                } else {
                    setError(result.message || "Gagal memuat detail pesanan");
                }
            } catch (err) {
                console.error(err);
                setError("Terjadi kesalahan koneksi");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderCode, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <p className="text-red-500 font-medium">{error || "Pesanan tidak ditemukan"}</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
                >
                    Kembali
                </button>
            </div>
        );
    }

    // Determine status color and text
    const isPaid = order.payment_status === "paid" || order.payment_status === "settlement" || order.payment_status === "capture";

    // Check for expiration
    const expiredAt = order.expired_at ? new Date(order.expired_at).getTime() : null;
    const now = Date.now();

    // Debugging logs
    console.log("Order Detail Debug:", {
        status: order.status,
        payment_status: order.payment_status,
        expired_at: order.expired_at,
        expiredAt_ts: expiredAt,
        now_ts: now,
        is_expired: expiredAt !== null && now > expiredAt
    });

    // Check if unpaid/pending AND expired
    const isExpiredUnpaid = (order.payment_status === 'unpaid' || order.payment_status === 'pending') && expiredAt !== null && now > expiredAt;

    const isFailed = order.payment_status === "expire" || order.payment_status === "cancel" || order.payment_status === "deny" || isExpiredUnpaid;



    // Format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow container mx-auto max-w-5xl px-4 py-8">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Icon icon="lucide:arrow-left" width={24} height={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Detail Pesanan</h1>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className={
                                `font-bold text-lg mb-1 ` +
                                (isPaid ? "text-emerald-600" : isFailed ? "text-red-600" : "text-amber-600")
                            }>
                                {isPaid ? "Pembayaran Berhasil" : isFailed ? "Pembayaran Gagal" : "Menunggu Pembayaran"}
                            </p>
                        </div>
                        {isPaid && (
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Icon icon="lucide:check" className="text-emerald-600" width={18} height={18} />
                            </div>
                        )}
                        {isFailed && (
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <Icon icon="lucide:x" className="text-red-600" width={18} height={18} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {order.va_number && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">No. VA</span>
                                <span className="text-gray-900 font-bold">{order.va_number}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">ID Pesanan</span>
                            <span className="text-gray-900 font-bold">{order.code}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Tanggal Pembayaran</span>
                            <span className="text-gray-900 font-bold">
                                {order.paid_at ? formatDate(order.paid_at) : formatDate(order.created_at)}
                            </span>
                        </div>

                        {/* Optional: if payment method name is important */}
                        {/* <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Metode Pembayaran</span>
                             <span className="text-gray-900 font-bold">{order.payment_method?.name || "-"}</span>
                        </div> */}
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-900">Info Pengiriman</h2>
                        {/* Simulated 'Sedang Disiapkan' badge if paid */}
                        {isPaid && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Sedang Disiapkan</span>}
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1">
                            <Icon icon="lucide:map-pin" className="text-emerald-600" width={20} height={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 mb-1">{order.shipping_recipient_name} - {order.shipping_recipient_phone}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{order.shipping_address}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Daftar Produk</h2>
                    </div>
                    <div className="p-4 divide-y divide-gray-100">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    <Image
                                        src={item.product_image || "/images/placeholder.png"}
                                        alt={item.product_name || "Product"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-900 line-clamp-2">{item.product_name}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm text-gray-500">{item.quantity} x {currency(item.price)}</p>
                                        <p className="font-medium text-gray-900">{currency(item.sub_total)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="font-semibold text-gray-900 mb-4">Rincian Pembayaran</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Total Harga ({order.items.length} Barang)</span>
                            <span>{currency(order.sub_total)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Biaya Pengiriman</span>
                            <span>{currency(order.shipping_fee)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600">
                                <span>Total Diskon Barang</span>
                                <span>-{currency(order.discount)}</span>
                            </div>
                        )}
                        {order.admin_fee > 0 && (
                            <div className="flex justify-between text-gray-600">
                                <span>Biaya Layanan</span>
                                <span>{currency(order.admin_fee)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-gray-900">Total Pembayaran</span>
                            <span className="font-bold text-lg text-emerald-700">{currency(order.grand_total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:static md:bg-transparent md:border-0 md:p-0">
                    <div className="flex justify-end gap-3 max-w-5xl mx-auto">
                        <button
                            onClick={() => router.push('/cart')}
                            className="bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
                        >
                            Beli Lagi
                        </button>
                        {isPaid && (
                            <button className="bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl hover:bg-emerald-800 transition-colors shadow-sm">
                                Download Bukti Transaksi
                            </button>
                        )}
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}

export default function OrderDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <OrderDetailPageContent />
        </Suspense>
    );
}
