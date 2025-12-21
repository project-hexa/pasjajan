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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { Suspense, useState } from "react";

// Dummy Data
const dummyOrders = [
    { id: 1, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Miftahul Huda" }, payment_method: "Mandiri", total_amount: 50000, delivery_status: "MENUNGGU_KURIR" },
    { id: 2, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Miftahul Huda" }, payment_method: "QRIS", total_amount: 50000, delivery_status: "SAMPAI_TUJUAN" },
    { id: 3, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Sugeng" }, payment_method: "Gopay", total_amount: 40000, delivery_status: "MENUNGGU_KURIR" },
    { id: 4, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Miftahul Huda" }, payment_method: "Permata Bank", total_amount: 50000, delivery_status: "DIKIRIM" },
    { id: 5, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Miftahul Huda" }, payment_method: "BCA", total_amount: 50000, delivery_status: "MENUNGGU_KURIR" },
    { id: 6, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Miftahul Huda" }, payment_method: "QRIS", total_amount: 50000, delivery_status: "MENUNGGU_KURIR" },
    { id: 7, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Miftahul Huda" }, payment_method: "OVO", total_amount: 50000, delivery_status: "MENUNGGU_KURIR" },
    { id: 8, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Miftahul Huda" }, payment_method: "QRIS", total_amount: 50000, delivery_status: "DIKIRIM" },
    { id: 9, created_at: "2025-12-12T12:00:51Z", user: { full_name: "Miftahul Huda" }, payment_method: "QRIS", total_amount: 50000, delivery_status: "MENUNGGU_KURIR" },
];

// Status options matching mockup
const statusOptions = [
    { key: "MENUNGGU_KURIR", label: "Sedang Dikemas", color: "text-green-600" },
    { key: "DIKIRIM", label: "Sedang Dikirim", color: "text-blue-600" },
    { key: "SAMPAI_TUJUAN", label: "Telah Diterima", color: "text-green-700" },
    { key: "SELESAI", label: "Selesai", color: "text-gray-600" },
    { key: "TELAH_DIULAS", label: "Telah Diulas", color: "text-gray-600" },
    { key: "GAGAL", label: "Gagal Dikirim", color: "text-red-600" },
];

const failureTemplates = [
    "Alamat Tidak Valid....",
    "Alamat tidak ditemukan....",
    "Pesanan dibatalkan...",
];

const getStatusDisplay = (status: string) => {
    return statusOptions.find(s => s.key === status) || { label: status, color: "text-gray-600" };
};

// Format helpers
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
};

// Page Content Component
function DeliveryPageContent() {
    const [orders, setOrders] = useState(dummyOrders);
    const [searchInput, setSearchInput] = useState("");

    // Modal states
    const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<"reason" | "confirm">("reason");
    const [failureNote, setFailureNote] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [previousStatus, setPreviousStatus] = useState("");

    // Handle status change
    const handleStatusClick = (orderId: number, newStatus: string, currentStatus: string) => {
        if (newStatus === "GAGAL") {
            setSelectedOrderId(orderId);
            setPreviousStatus(getStatusDisplay(currentStatus).label);
            setModalStep("reason");
            setFailureNote("");
            setIsFailureModalOpen(true);
        } else {
            setOrders(orders.map(o => o.id === orderId ? { ...o, delivery_status: newStatus } : o));
        }
    };

    const handleProceedToConfirm = () => {
        setModalStep("confirm");
    };

    const handleConfirmFailure = () => {
        if (selectedOrderId) {
            setOrders(orders.map(o => o.id === selectedOrderId ? { ...o, delivery_status: "GAGAL" } : o));
        }
        setIsFailureModalOpen(false);
        setSelectedOrderId(null);
    };

    const handleTemplateClick = (template: string) => {
        setFailureNote(template.replace(/\.+$/, ''));
    };

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Status Pesanan</h1>

            {/* Search and Period Filters */}
            <div className="flex flex-col gap-4 rounded-2xl bg-[#F7FFFB] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-1/3">
                    <Icon icon="lucide:search" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="search"
                        className="h-12 w-full rounded-2xl border-none bg-white pl-10 shadow-sm focus-visible:ring-1 focus-visible:ring-[#1E8F59]"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
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

            {/* Filter and Sort */}
            <div className="flex gap-2">
                <Button variant="secondary" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl">
                    Filter
                </Button>
                <Button variant="secondary" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl flex gap-2">
                    Sort <Icon icon="lucide:arrow-up-down" className="h-4 w-4" />
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl bg-[#F7FFFB] shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#B9DCCC] hover:bg-[#B9DCCC]/90">
                            <TableHead className="py-4 pl-6 font-semibold text-gray-800">Id</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Tanggal</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Jam</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Nama Pelanggan</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Metode</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Biaya</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Status Kirim</TableHead>
                            <TableHead className="py-4 pr-6 font-semibold text-gray-800">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => {
                            const statusInfo = getStatusDisplay(order.delivery_status);
                            return (
                                <TableRow key={order.id} className="border-b-0 hover:bg-gray-50/50">
                                    <TableCell className="py-4 pl-6">{order.id}</TableCell>
                                    <TableCell className="py-4">{formatDate(order.created_at)}</TableCell>
                                    <TableCell className="py-4">{formatTime(order.created_at)}</TableCell>
                                    <TableCell className="py-4 font-medium">{order.user.full_name}</TableCell>
                                    <TableCell className="py-4">{order.payment_method}</TableCell>
                                    <TableCell className="py-4">{formatCurrency(order.total_amount)}</TableCell>
                                    <TableCell className="py-4">
                                        <span className={cn("flex items-center gap-1 font-medium", statusInfo.color)}>
                                            {statusInfo.label}
                                            <Icon icon="lucide:chevron-down" className="h-4 w-4" />
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" className="h-10 w-10 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black">
                                                    <Icon icon="lucide:eye" className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-200 bg-white p-0 shadow-lg overflow-hidden">
                                                {statusOptions.map((option) => {
                                                    const isActive = order.delivery_status === option.key;
                                                    return (
                                                        <DropdownMenuItem
                                                            key={option.key}
                                                            onClick={() => handleStatusClick(order.id, option.key, order.delivery_status)}
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
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
                <Button variant="secondary" className="bg-[#D1E9DD] hover:bg-[#B9DCCC] text-gray-700 gap-2 px-4 rounded-lg">
                    <Icon icon="lucide:chevron-left" className="h-4 w-4" /> Sebelumnya
                </Button>
                <Button variant="outline" className="h-10 w-10 border-2 border-[#1E8F59] text-[#1E8F59] font-bold rounded-lg">
                    1
                </Button>
                <Button variant="outline" className="h-10 w-10 border-none text-gray-600 bg-white font-medium rounded-lg hover:bg-gray-50">
                    2
                </Button>
                <span className="text-gray-400 px-2">...</span>
                <Button variant="secondary" className="bg-white hover:bg-gray-50 text-gray-700 gap-2 px-4 rounded-lg shadow-sm border border-gray-100">
                    Sesudahnya <Icon icon="lucide:chevron-right" className="h-4 w-4" />
                </Button>
            </div>

            {/* Failure Modal */}
            <Dialog open={isFailureModalOpen} onOpenChange={setIsFailureModalOpen}>
                <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden bg-white">
                    {modalStep === "reason" ? (
                        <>
                            <DialogHeader className="border-b p-4 relative flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-gray-100"
                                    onClick={() => setIsFailureModalOpen(false)}
                                >
                                    <Icon icon="lucide:arrow-left" className="h-5 w-5" />
                                </Button>
                                <DialogTitle className="text-lg font-bold">Status Kirim</DialogTitle>
                            </DialogHeader>

                            <div className="p-6 space-y-6">
                                <h2 className="text-xl font-bold text-red-600 text-center">Status Gagal Kirim</h2>

                                <div className="space-y-4">
                                    <p className="font-semibold text-sm">Berikan Deskripsi Status Pengiriman</p>

                                    <div className="space-y-2">
                                        <span className="text-xs text-gray-500">Templat deskripsi:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {failureTemplates.map(template => (
                                                <button
                                                    key={template}
                                                    onClick={() => handleTemplateClick(template)}
                                                    className="rounded-full border border-green-600 px-3 py-1 text-xs font-semibold text-green-700 bg-white hover:bg-green-50 transition-colors"
                                                >
                                                    {template}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Textarea
                                        placeholder="Masukkan Deskripsi"
                                        className="min-h-[120px] rounded-xl border-gray-300 resize-none focus-visible:ring-1 focus-visible:ring-green-600"
                                        value={failureNote}
                                        onChange={(e) => setFailureNote(e.target.value)}
                                    />
                                </div>

                                <Button
                                    onClick={handleProceedToConfirm}
                                    className="w-full bg-[#1E8F59] hover:bg-[#166E45] text-white rounded-xl py-6 text-base font-semibold"
                                >
                                    Ubah Status Pengiriman
                                </Button>
                            </div>
                        </>
                    ) : (
                        // Confirmation Step
                        <div className="p-8 flex flex-col items-center text-center space-y-6">
                            <h2 className="text-xl font-bold">Apakah anda yakin ingin mengubahnya?</h2>

                            <div className="w-full h-px bg-gray-200"></div>

                            <div className="w-full bg-yellow-100 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 border border-yellow-200">
                                <span className="text-yellow-700 font-medium">Perubahan:</span>
                                <div className="bg-white rounded-full px-4 py-2 border border-gray-300 shadow-sm flex items-center gap-2 text-sm font-semibold">
                                    <span className="text-blue-600">{previousStatus}</span>
                                    <Icon icon="lucide:arrow-right" className="h-4 w-4 text-gray-400" />
                                    <span className="text-red-600">Gagal Kirim</span>
                                </div>
                            </div>

                            <div className="flex w-full gap-4 pt-4">
                                <Button
                                    variant="destructive"
                                    className="flex-1 rounded-xl py-6 bg-[#D32F2F] hover:bg-[#B71C1C]"
                                    onClick={() => setModalStep("reason")}
                                >
                                    Tidak
                                </Button>
                                <Button
                                    className="flex-1 rounded-xl py-6 bg-[#1E8F59] hover:bg-[#166E45] text-white"
                                    onClick={handleConfirmFailure}
                                >
                                    Ya
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
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
