"use client";

import { getAdminOrdersServer } from "@/services/admin.service";
import { Button } from "@workspace/ui/components/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { DeliveryActionButton } from "@/app/(modul 6 - dashboard)/_components/delivery-action-button";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Order, PaginationMeta } from "@/types/order";

const statusMap: Record<string, { label: string; color: string }> = {
    MENCARI_DRIVER: { label: "Mencari Driver", color: "text-orange-500" },
    MENUNGGU_KURIR: { label: "Sedang Dikemas", color: "text-blue-500" },
    DIKIRIM: { label: "Sedang Dikirim", color: "text-blue-500" },
    SAMPAI_TUJUAN: { label: "Telah Diterima", color: "text-green-500" },
    "Gagal Dikirim": { label: "Gagal Dikirim", color: "text-red-500" },
};

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";

    const [orders, setOrders] = useState<Order[] | null>(null);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // We use the mocked server function here as a client helper
                const { data, meta } = await getAdminOrdersServer({ page, search });
                setOrders(data);
                setMeta(meta);
            } catch (error) {
                console.error("Failed to fetch admin orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page, search]);

    if (loading || !orders) {
        return <div className="p-8 text-center text-gray-500">Memuat Data Pesanan...</div>;
    }

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Status Pesanan</h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col gap-4 rounded-2xl bg-[#F7FFFB] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-1/2 lg:w-1/3">
                    <Icon
                        icon="lucide:search"
                        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                        placeholder="search"
                        className="h-12 w-full rounded-2xl border-none bg-white pl-10 shadow-sm focus-visible:ring-1 focus-visible:ring-[#1E8F59]"
                        defaultValue={search}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-xl bg-[#A8D5BA] hover:bg-[#97C5AA] text-gray-700 border-none">
                        Last 3 months
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl bg-white text-gray-700 border border-gray-200">
                        Last 30 days
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl bg-white text-gray-700 border border-gray-200">
                        Last 7 months
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button variant="secondary" className="bg-white hover:bg-gray-50 text-gray-700 w-24">Filter</Button>
                <Button variant="secondary" className="bg-white hover:bg-gray-50 text-gray-700 w-24 flex gap-2">
                    Sort <Icon icon="lucide:arrow-up-down" className="h-4 w-4" />
                </Button>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-2xl bg-[#F7FFFB] shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#B9DCCC] hover:bg-[#B9DCCC]/90">
                            <TableHead className="py-4 pl-8 font-semibold text-gray-800">Id</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Tanggal</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Jam</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Nama Pelanggan</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Metode</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Biaya</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Status Kirim</TableHead>
                            <TableHead className="py-4 pr-8 font-semibold text-gray-800">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order, index) => (
                            <TableRow key={order.id} className="border-b-0 hover:bg-gray-50/50">
                                <TableCell className="py-4 pl-8">{order.id}</TableCell>
                                <TableCell className="py-4">
                                    {format(new Date(order.created_at), "dd/MM/yyyy")}
                                </TableCell>
                                <TableCell className="py-4">
                                    {format(new Date(order.created_at), "HH:mm:ss")}
                                </TableCell>
                                <TableCell className="py-4 font-medium">{order.user.full_name}</TableCell>
                                <TableCell className="py-4">{order.payment_method}</TableCell>
                                <TableCell className="py-4">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    }).format(order.total_amount)}
                                </TableCell>
                                <TableCell className={cn("py-4 font-medium", statusMap[order.delivery_status]?.color)}>
                                    <div className="flex items-center gap-1">
                                        {statusMap[order.delivery_status]?.label ?? order.delivery_status}
                                        <Icon icon="lucide:chevron-down" className="h-4 w-4" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 pr-8">
                                    <DeliveryActionButton
                                        orderId={order.id}
                                        initialStatus={order.delivery_status}
                                        onStatusUpdate={(newStatus) => {
                                            setOrders(orders.map(o =>
                                                o.id === order.id ? { ...o, delivery_status: newStatus } : o
                                            ));
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                <Button variant="secondary" className="bg-[#D1E9DD] hover:bg-[#B9DCCC] text-gray-700 gap-2 px-4 rounded-lg">
                    <Icon icon="lucide:chevron-left" className="h-4 w-4" /> Sebelumnya
                </Button>
                <Button variant="outline" className="h-10 w-10 border-2 border-[#1E8F59] text-[#1E8F59] font-bold rounded-lg hover:bg-gray-50">
                    {meta?.current_page || 1}
                </Button>
                <Button variant="outline" className="h-10 w-10 border-none text-gray-600 bg-white font-medium rounded-lg hover:bg-gray-50">
                    {(meta?.current_page || 1) + 1}
                </Button>
                <Button variant="ghost" className="h-10 w-10 text-gray-400" disabled>...</Button>
                <Button variant="secondary" className="bg-white hover:bg-gray-50 text-gray-700 gap-2 px-4 rounded-lg shadow-sm border border-gray-100">
                    Sesudahnya <Icon icon="lucide:chevron-right" className="h-4 w-4" />
                </Button>
            </div>
        </section>
    );
}
