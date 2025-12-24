"use client";

import { Button } from "@workspace/ui/components/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { getAdminDeliveries, updateDeliveryStatus } from "@/services/delivery";

// Imports from Extracted Files
import { statusOptions, getStatusDisplay, formatDate, formatTime, formatCurrency } from "./_constants";
import { CourierInputModal } from "./_components/courier-input-modal";
import { ProofUploadModal } from "./_components/proof-upload-modal";
import { StatusUpdateModal } from "./_components/status-update-modal";

// Page Content Component
function DeliveryPageContent() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Modal Visibility States
    const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
    const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);

    // Active Selection State
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [targetStatus, setTargetStatus] = useState("");
    const [previousStatusLabel, setPreviousStatusLabel] = useState("");

    // Fetch Data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getAdminDeliveries({
                search: searchInput,
                status: statusFilter === "ALL" ? undefined : statusFilter
            });
            setOrders(result.data);
        } catch (error) {
            console.error("Gagal ambil data delivery", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [statusFilter]);

    // Handle status change click from Dropdown
    const handleStatusClick = async (orderId: number, newStatus: string, currentStatus: string) => {
        setSelectedOrderId(orderId);
        setTargetStatus(newStatus);
        setPreviousStatusLabel(getStatusDisplay(currentStatus).label);

        if (newStatus === "GAGAL") {
            setIsFailureModalOpen(true);
        } else if (newStatus === "DIKIRIM") {
            setIsCourierModalOpen(true);
        } else if (newStatus === "SAMPAI_TUJUAN") {
            setIsProofModalOpen(true);
        } else {
            // Direct update
            if (confirm(`Ubah status ke ${getStatusDisplay(newStatus).label}?`)) {
                await executeStatusUpdate(orderId, newStatus);
            }
        }
    };

    // Central Update Logic
    const executeStatusUpdate = async (orderId: number, status: string, note?: string, cName?: string, cPhone?: string, pFile?: File) => {
        try {
            await updateDeliveryStatus(orderId, status, note, cName, cPhone, pFile);

            // Optimistic Update
            setOrders(prevOrders => prevOrders.map(o => {
                if (o.order_id === orderId) {
                    return {
                        ...o,
                        status: status,
                        last_updated: new Date().toISOString()
                    };
                }
                return o;
            }));

            fetchData(); // Background refresh
            closeAllModals();
        } catch (error) {
            alert("Gagal update status. Pastikan data terisi.");
        }
    }

    const closeAllModals = () => {
        setIsFailureModalOpen(false);
        setIsCourierModalOpen(false);
        setIsProofModalOpen(false);
        setSelectedOrderId(null);
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        if (!searchInput) return true;
        const search = searchInput.toLowerCase();
        return (
            order.customer_name?.toLowerCase().includes(search) ||
            order.tracking_no?.toLowerCase().includes(search) ||
            order.order_code?.toLowerCase().includes(search)
        );
    });

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Status Pesanan (Delivery Monitoring)</h1>

            {/* Header / Filter Section */}
            <div className="flex flex-col gap-4 rounded-2xl bg-[#F7FFFB] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-1/3">
                    <Icon icon="lucide:search" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search nama / resi..."
                        className="h-12 w-full rounded-2xl border-none bg-white pl-10 shadow-sm focus-visible:ring-1 focus-visible:ring-[#1E8F59]"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchData} variant="outline" className="h-10 rounded-xl bg-white text-gray-700 border border-gray-200">
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto rounded-2xl bg-[#F7FFFB] shadow-sm">
                <Table className="min-w-[1200px]">
                    <TableHeader>
                        <TableRow className="bg-[#B9DCCC] hover:bg-[#B9DCCC]/90">
                            <TableHead className="py-4 pl-6 font-semibold text-gray-800">Tracking No</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Update Terakhir</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Nama Pelanggan</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Toko</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Kurir</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Biaya</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Metode Bayar</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Bukti</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Rating</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Status</TableHead>
                            <TableHead className="py-4 pr-6 font-semibold text-gray-800">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-8">Memuat Data...</TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-8">Tidak ada data pengiriman.</TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => {
                                const statusInfo = getStatusDisplay(order.status);
                                return (
                                    <TableRow key={order.id} className="border-b-0 hover:bg-gray-50/50">
                                        <TableCell className="py-4 pl-6 font-medium">
                                            <Link href={`/delivery/${order.order_id}/tracking`} target="_blank" className="text-blue-600 hover:underline">
                                                {order.tracking_no}
                                            </Link>
                                            <br /><span className="text-xs text-gray-500">{order.order_code}</span>
                                        </TableCell>
                                        <TableCell className="py-4">{formatDate(order.last_updated)}<br /><span className="text-xs text-gray-500">{formatTime(order.last_updated)}</span></TableCell>
                                        <TableCell className="py-4 font-medium">{order.customer_name}</TableCell>
                                        <TableCell className="py-4">{order.store_name}</TableCell>
                                        <TableCell className="py-4">{order.courier_name}<br /><span className="text-xs text-gray-500">{order.courier_phone}</span></TableCell>
                                        <TableCell className="py-4">{formatCurrency(order.cost)}</TableCell>
                                        <TableCell className="py-4 font-medium text-gray-700">{order.payment_method}</TableCell>
                                        <TableCell className="py-4">
                                            {order.proof_image ? (
                                                <a href={order.proof_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-semibold bg-blue-50 px-2 py-1 rounded-md w-fit border border-blue-100 transition-colors">
                                                    <Icon icon="lucide:image" className="h-4 w-4" />
                                                    Lihat
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {order.rating ? (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <button className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors">
                                                            <Icon icon="lucide:star" className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                            <span className="font-semibold text-gray-700">{order.rating}</span>
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-64 p-4 text-sm bg-white border border-gray-200 shadow-md rounded-xl">
                                                        <p className="font-semibold mb-1 text-gray-800">Ulasan Pengguna:</p>
                                                        <p className="text-gray-600 italic">"{order.review_comment || '-'}"</p>
                                                    </PopoverContent>
                                                </Popover>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className={cn("flex items-center gap-1 font-medium", statusInfo.color)}>
                                                {statusInfo.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" className="h-10 w-10 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black">
                                                        <Icon icon="lucide:edit" className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-200 bg-white p-0 shadow-lg overflow-hidden">
                                                    {statusOptions.map((option) => {
                                                        const isActive = order.status === option.key;
                                                        return (
                                                            <DropdownMenuItem
                                                                key={option.key}
                                                                onClick={() => handleStatusClick(order.order_id, option.key, order.status)}
                                                                className={cn(
                                                                    "flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-0",
                                                                    option.key === "GAGAL" ? "text-red-600" : "text-blue-600"
                                                                )}
                                                            >
                                                                {option.label}
                                                                <div
                                                                    className={cn(
                                                                        "flex h-5 w-5 items-center justify-center rounded-full border",
                                                                        isActive ? "border-green-500 bg-green-500" : "border-gray-300 bg-transparent"
                                                                    )}
                                                                />
                                                            </DropdownMenuItem>
                                                        );
                                                    })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modals - Clean Implementation */}
            {selectedOrderId && (
                <>
                    <StatusUpdateModal
                        isOpen={isFailureModalOpen}
                        onClose={closeAllModals}
                        onConfirm={(note) => executeStatusUpdate(selectedOrderId, targetStatus, note)}
                        previousStatus={previousStatusLabel}
                        targetStatus="Gagal Kirim"
                    />

                    <CourierInputModal
                        isOpen={isCourierModalOpen}
                        onClose={closeAllModals}
                        onConfirm={(name, phone) => executeStatusUpdate(selectedOrderId, targetStatus, undefined, name, phone)}
                    />

                    <ProofUploadModal
                        isOpen={isProofModalOpen}
                        onClose={closeAllModals}
                        onConfirm={(file) => executeStatusUpdate(selectedOrderId, targetStatus, undefined, undefined, undefined, file)}
                    />
                </>
            )}
        </section>
    );
}

// Main Page with Suspense
export default function DeliveryPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat...</div>}>
            <DeliveryPageContent />
        </Suspense>
    );
}
