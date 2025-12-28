"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Icon } from "@workspace/ui/components/icon";
import { toast } from "@workspace/ui/components/sonner";
import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";
import { Order } from "@/types/order.types";
import Image from "next/image";

const currency = (val: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val);

export default function AdminOrderDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("order_code");

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderCode) {
            toast.error("Order code tidak ditemukan", { toasterId: "global" });
            router.push("/dashboard/orders");
            return;
        }

        const fetchOrder = async () => {
            try {
                const result = await handleApiResponse<{ order: Order }>(async () =>
                    await handleApiRequest.get<{ order: Order }>(
                        `/admin/orders/${orderCode}`,
                        { defaultErrorMessage: "Gagal memuat detail order" }
                    )
                );

                if (result.ok && result.data) {
                    setOrder(result.data.order);
                } else {
                    toast.error(result.message || "Gagal memuat detail order", { toasterId: "global" });
                    router.push("/dashboard/orders");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Terjadi kesalahan sistem", { toasterId: "global" });
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderCode, router]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
            case "settlement":
            case "capture":
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Success</Badge>;
            case "pending":
            case "unpaid":
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Waiting</Badge>;
            case "failed":
            case "cancel":
            case "deny":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
            case "expired":
            case "expire":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Icon icon="lucide:loader-2" className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <Icon icon="lucide:arrow-left" className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Detail Pesanan</h1>
                    <p className="text-sm text-gray-500">ID: {order.code}</p>
                </div>
                <div className="ml-auto">
                    {getStatusBadge(order.payment_status)}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Order Items & Payment Info */}
                <div className="space-y-6 md:col-span-2">

                    {/* Items Card */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="bg-white">
                            <CardTitle>Produk Dipesan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 border-b py-4 last:border-0 last:pb-0">
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50">
                                        {item.product?.image_url ? (
                                            <Image
                                                src={item.product?.image_url}
                                                alt={item.product?.name || "Product"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                <Icon icon="lucide:image" className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.product?.name || "Produk dihapus"}</p>
                                        <p className="text-sm text-gray-500">{item.quantity} x {currency(item.price)}</p>
                                    </div>
                                    <p className="font-medium text-gray-900">{currency(item.sub_total)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Payment Detail Card */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="bg-white">
                            <CardTitle>Rincian Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal Produk</span>
                                <span className="font-medium">{currency(order.sub_total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Biaya Pengiriman</span>
                                <span className="font-medium">{currency(order.shipping_fee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Biaya Admin</span>
                                <span className="font-medium">{currency(order.admin_fee)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Diskon Voucher</span>
                                    <span className="font-medium">- {currency(order.discount)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-base font-bold text-gray-900">
                                <span>Total Pembayaran</span>
                                <span>{currency(order.grand_total)}</span>
                            </div>
                            <div className="pt-2">
                                <div className="rounded-lg bg-gray-50 p-3">
                                    <p className="text-xs text-gray-500 mb-1">Metode Pembayaran</p>
                                    <div className="flex items-center gap-2">
                                        <Icon icon="lucide:credit-card" className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium text-gray-800">{order.payment_method?.name || order.payment_method?.code || "Manual"}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Customer & Shipping Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="bg-white">
                            <CardTitle>Info Pelanggan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0 text-sm">
                            <div className="flex items-start gap-3">
                                <Icon icon="lucide:user" className="mt-0.5 h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                                    <p className="text-gray-500">{order.customer_email}</p>
                                    <p className="text-gray-500">{order.customer_phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader className="bg-white">
                            <CardTitle>Pengiriman</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0 text-sm">
                            <div className="flex items-start gap-3">
                                <Icon icon="lucide:map-pin" className="mt-0.5 h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Alamat Penerima</p>
                                    <p className="text-gray-600 mt-1">{order.shipping_address}</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        <p>Penerima: {order.shipping_recipient_name}</p>
                                        <p>Telp: {order.shipping_recipient_phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Icon icon="lucide:store" className="mt-0.5 h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Cabang Toko</p>
                                    <p className="text-gray-600">{order.store_name || "-"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
