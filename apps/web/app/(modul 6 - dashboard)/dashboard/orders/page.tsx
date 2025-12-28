"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Icon } from "@workspace/ui/components/icon";
import { toast } from "@workspace/ui/components/sonner";
import { Order } from "@/types/order.types";
import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";

const currency = (val: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val);

interface AdminOrdersResponse {
    orders: Order[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function OrderManagementPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    // URL State Sync
    const currentPage = Number(searchParams.get("page")) || 1;
    const currentPaymentStatus = searchParams.get("payment_status") || "all";

    // Search state
    const urlSearchQuery = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(urlSearchQuery);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const dateFrom = searchParams.get("date_from") || "";
    const dateTo = searchParams.get("date_to") || "";

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("page", currentPage.toString());
            queryParams.append("per_page", "10");

            // Use debounced search term directly if available, or fallback to URL param
            // But since we sync debounced term to URL, usually URL param is enough.
            // However, to be reactive to the debounced value change immediately:
            if (debouncedSearchTerm) queryParams.append("search", debouncedSearchTerm);

            if (currentPaymentStatus !== "all") queryParams.append("payment_status", currentPaymentStatus);
            if (dateFrom) queryParams.append("date_from", dateFrom);
            if (dateTo) queryParams.append("date_to", dateTo);

            // Direct API Call using handleApiResponse and handleApiRequest
            const result = await handleApiResponse<AdminOrdersResponse>(async () =>
                await handleApiRequest.get<AdminOrdersResponse>(
                    `/admin/orders?${queryParams.toString()}`,
                    { defaultErrorMessage: "Gagal mengambil daftar order" }
                )
            );

            if (result.ok && result.data) {
                setOrders(result.data.orders);
                setPagination(result.data.pagination);
            } else {
                toast.error(result.message || "Gagal mengambil data order", { toasterId: "global" });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Terjadi kesalahan saat memuat data", { toasterId: "global" });
        } finally {
            setLoading(false);
        }
    };

    // Update URL when debounced search term changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedSearchTerm) {
            params.set("search", debouncedSearchTerm);
        } else {
            params.delete("search");
        }

        // Only push to router if the value actually changed from what's in URL
        if (debouncedSearchTerm !== urlSearchQuery) {
            params.set("page", "1"); // Reset pagination
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [debouncedSearchTerm]);

    // Initial sync from URL to local state (for back/forward navigation)
    useEffect(() => {
        setSearchTerm(urlSearchQuery);
    }, [urlSearchQuery]);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, currentPaymentStatus, debouncedSearchTerm, dateFrom, dateTo]);

    const updateUrl = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset to page 1 on filter change
        if (key !== "page") {
            params.set("page", "1");
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Daftar Order</h1>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="bg-white pb-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="relative w-full max-w-sm">
                                <Icon
                                    icon="lucide:search"
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                />
                                <Input
                                    placeholder="Cari ID Pesanan atau Pelanggan..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select
                                value={currentPaymentStatus}
                                onValueChange={(val) => updateUrl("payment_status", val)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status Pembayaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="paid">Success (Paid)</SelectItem>
                                    <SelectItem value="unpaid">Waiting (Unpaid)</SelectItem>
                                    <SelectItem value="expired">Failed (Expired)</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="date"
                                    className="w-[150px]"
                                    value={dateFrom}
                                    onChange={(e) => updateUrl("date_from", e.target.value)}
                                    placeholder="Dari Tanggal"
                                />
                                <span className="text-gray-400">-</span>
                                <Input
                                    type="date"
                                    className="w-[150px]"
                                    value={dateTo}
                                    onChange={(e) => updateUrl("date_to", e.target.value)}
                                    placeholder="Sampai Tanggal"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-[#D1E9E0]">
                            <TableRow className="hover:bg-[#D1E9E0]/80 border-b-0">
                                <TableHead className="text-center text-gray-800 font-semibold">ID Pesanan</TableHead>
                                <TableHead className="text-center text-gray-800 font-semibold">Nama Pelanggan</TableHead>
                                <TableHead className="text-center text-gray-800 font-semibold">Tanggal Pesanan</TableHead>
                                <TableHead className="text-center text-gray-800 font-semibold">Metode Pembayaran</TableHead>
                                <TableHead className="text-gray-800 font-semibold">Total Bayar</TableHead>
                                <TableHead className="text-center text-gray-800 font-semibold">Status Pembayaran</TableHead>
                                <TableHead className="text-center text-gray-800 font-semibold w-[50px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-500">
                                            <Icon icon="lucide:loader-2" className="h-5 w-5 animate-spin" />
                                            Memuat data...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                                        Tidak ada data order ditemukan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order, index) => (
                                    <TableRow key={order.id} className="hover:bg-gray-50 border-b border-gray-100">
                                        <TableCell className="text-center font-medium text-emerald-700">
                                            {order.code}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-gray-900">
                                            {order.customer_name || "-"}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-600">
                                            <div className="flex flex-col items-center">
                                                <span>
                                                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(order.created_at).toLocaleTimeString("id-ID", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-gray-600">
                                            {/* @ts-ignore - dynamic property check */}
                                            {order.payment_method?.method_name || order.payment_method?.name || order.payment_method?.code || "Manual"}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">
                                            {currency(order.grand_total)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {(() => {
                                                const status = order.payment_status;
                                                const successStatuses = ['paid', 'settlement', 'capture', 'success'];
                                                const waitingStatuses = ['pending', 'unpaid', 'waiting'];
                                                const failedStatuses = ['expired', 'expire', 'failed', 'deny', 'cancel'];

                                                if (successStatuses.includes(status)) {
                                                    return (
                                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                                                            Success
                                                        </Badge>
                                                    );
                                                }
                                                if (waitingStatuses.includes(status)) {
                                                    return (
                                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                                                            Waiting
                                                        </Badge>
                                                    );
                                                }
                                                if (failedStatuses.includes(status)) {
                                                    return (
                                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">
                                                            Failed
                                                        </Badge>
                                                    );
                                                }
                                                return <Badge variant="secondary">{status}</Badge>;
                                            })()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                size="icon"
                                                className="h-8 w-8 bg-yellow-400 hover:bg-yellow-500 text-black rounded shadow-sm"
                                                onClick={() => router.push(`/dashboard/orders/detail?order_code=${order.code}`)}
                                            >
                                                <Icon icon="lucide:eye" className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                {/* Pagination */}
                {!loading && pagination.last_page > 1 && (
                    <div className="flex items-center justify-between border-t p-4">
                        <p className="text-sm text-gray-500">
                            Menampilkan {orders.length} dari {pagination.total} data
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.current_page === 1}
                                onClick={() => updateUrl("page", (pagination.current_page - 1).toString())}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => updateUrl("page", (pagination.current_page + 1).toString())}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
