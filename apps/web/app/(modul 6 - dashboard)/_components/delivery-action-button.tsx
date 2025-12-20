"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
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
import { cn } from "@workspace/ui/lib/utils";
import { updateStatusAction } from "@/app/actions/order.actions";
import { Textarea } from "@workspace/ui/components/textarea";

interface DeliveryActionButtonProps {
    orderId: number;
    initialStatus: string;
    onStatusUpdate?: (newStatus: string) => void;
}

const statuses = [
    "Sedang Dikemas",
    "Sedang Dikirim",
    "Telah Diterima",
    "Selesai",
    "Telah Diulas",
    "Gagal Dikirim",
];

const failureTemplates = [
    "Alamat Tidak Valid....",
    "Alamat tidak ditemukan....",
    "Pesanan dibatalkan..."
];

export function DeliveryActionButton({
    orderId,
    initialStatus,
    onStatusUpdate,
}: DeliveryActionButtonProps) {
    const normalizeStatus = (status: string) => {
        if (status === "MENUNGGU_KURIR") return "Sedang Dikemas";
        if (status === "DIKIRIM") return "Sedang Dikirim";
        if (status === "SAMPAI_TUJUAN") return "Telah Diterima";
        return status;
    };

    const [currentStatus, setCurrentStatus] = useState(normalizeStatus(initialStatus));
    const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
    const [failureNote, setFailureNote] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [modalStep, setModalStep] = useState<"reason" | "confirm">("reason");

    const handleStatusClick = (status: string) => {
        if (status === "Gagal Dikirim") {
            setIsDropdownOpen(false);
            setModalStep("reason");
            setFailureNote("");
            setTimeout(() => setIsFailureModalOpen(true), 100);
            return;
        }

        handleStatusChange(status);
        setIsDropdownOpen(false);
    };

    const handleStatusChange = async (newStatus: string, note?: string) => {
        setCurrentStatus(newStatus); // Optimistic local

        let apiStatus = newStatus;
        if (newStatus === "Sedang Dikemas") apiStatus = "MENUNGGU_KURIR";
        else if (newStatus === "Sedang Dikirim") apiStatus = "DIKIRIM";
        else if (newStatus === "Telah Diterima") apiStatus = "SAMPAI_TUJUAN";

        await updateStatusAction(orderId, apiStatus, note);

        // Optimistic Update Callback to Parent
        if (onStatusUpdate) {
            onStatusUpdate(apiStatus);
        }
    };

    const handleProceedToConfirm = () => {
        setModalStep("confirm");
    };

    const handleSubmitFailure = async () => {
        await handleStatusChange("Gagal Dikirim", failureNote);
        setIsFailureModalOpen(false);
    };

    const handleTemplateClick = (template: string) => {
        setFailureNote(template.replace(/\.+$/, ''));
    };

    return (
        <>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                        <Icon icon="lucide:eye" className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-lg" align="end">
                    {statuses.map((status) => {
                        const isActive = currentStatus === status;
                        const isFailure = status === "Gagal Dikirim";

                        return (
                            <DropdownMenuItem
                                key={status}
                                onClick={() => handleStatusClick(status)}
                                className={cn(
                                    "flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-0",
                                    isFailure ? "text-red-600" : "text-blue-600"
                                )}
                            >
                                {status}
                                <div
                                    className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded-full border",
                                        isActive
                                            ? "border-green-500 bg-green-500"
                                            : "border-gray-200 bg-transparent"
                                    )}
                                />
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

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
                        // Confirmation Step UI
                        <div className="p-8 flex flex-col items-center text-center space-y-6">
                            <h2 className="text-xl font-bold">Apakah anda yakin ingin mengubahnya?</h2>

                            <div className="w-full h-px bg-gray-200"></div>

                            <div className="w-full bg-yellow-100 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 border border-yellow-200">
                                <span className="text-yellow-700 font-medium">Perubahan:</span>
                                <div className="bg-white rounded-full px-4 py-2 border border-gray-300 shadow-sm flex items-center gap-2 text-sm font-semibold">
                                    <span className="text-blue-600">{currentStatus}</span>
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
                                    onClick={handleSubmitFailure}
                                >
                                    Ya
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
