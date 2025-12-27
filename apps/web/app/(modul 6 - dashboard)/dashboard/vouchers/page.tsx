"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { toast } from "@workspace/ui/components/sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils/axios";

interface Voucher {
    id: number;
    code: string;
    name: string;
    description: string | null;
    discount_value: string;
    required_points: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export default function VoucherPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchVouchers = async () => {
        try {
            const response = await api.get("/admin/vouchers");
            const responseData = response.data.data;
            setVouchers(responseData.data || []);
        } catch (error) {
            console.error("Failed to fetch vouchers", error);
            toast.error("Gagal memuat daftar voucher", { toasterId: "global" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleDeleteClick = (voucher: Voucher) => {
        setVoucherToDelete(voucher);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!voucherToDelete) return;

        setIsDeleting(true);
        try {
            await api.delete(`/admin/vouchers/${voucherToDelete.id}`);
            toast.success("Voucher berhasil dihapus!", { toasterId: "global" });
            fetchVouchers();
        } catch (error: any) {
            console.error("Failed to delete voucher", error);
            const message = error.response?.data?.message || "Gagal menghapus voucher";
            toast.error(message, { toasterId: "global" });
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setVoucherToDelete(null);
        }
    };

    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Voucher Management</h1>
                    <p className="text-muted-foreground mt-1">Manage vouchers for point redemption.</p>
                </div>
                <Link href="/dashboard/vouchers/create">
                    <Button className="bg-[#1E8F59] hover:bg-[#166E45] text-white">
                        <Icon icon={"ic:outline-plus"} className="mr-2 h-4 w-4" /> Add Voucher
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Vouchers</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-10">Loading vouchers...</div>
                    ) : vouchers.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No vouchers found. Create a new one to get started.
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Voucher</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Discount</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Points</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Period</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {vouchers.map((voucher) => (
                                        <tr key={voucher.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-mono font-semibold">
                                                    {voucher.code}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-medium">{voucher.name}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-1">{voucher.description || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground gap-1">
                                                    {formatCurrency(voucher.discount_value)}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center gap-1 text-sm">
                                                    <Icon icon={"lucide:coins"} className="h-4 w-4 text-amber-500" />
                                                    {voucher.required_points.toLocaleString("id-ID")}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Icon icon={"lucide:calendar"} className="h-3 w-3 text-muted-foreground" />
                                                        {formatDate(voucher.start_date)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground pl-4">
                                                        to {formatDate(voucher.end_date)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent ${voucher.is_active ? 'bg-[#1E8F59] text-white' : 'bg-secondary text-secondary-foreground'}`}>
                                                    {voucher.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/dashboard/vouchers/${voucher.id}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Icon icon={"lucide:pencil"} className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteClick(voucher)}
                                                    >
                                                        <Icon icon={"lucide:trash"} className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus voucher <strong>&quot;{voucherToDelete?.name}&quot;</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Icon icon={"lucide:loader"} className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                "Hapus"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
