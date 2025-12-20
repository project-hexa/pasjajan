"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Badge } from "@workspace/ui/components/badge";
import { toast } from "@workspace/ui/components/sonner";
import Link from "next/link";
import { api } from "@/lib/utils/axios";

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    current_point: number;
    formatted_point: string;
    member_since: string;
}

interface HistoryPoint {
    id: number;
    type: "Masuk" | "Keluar";
    notes: string;
    total_point: number;
    formatted_point: string;
    created_at: string;
}

interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export default function CustomerPointHistoryPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id as string;

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [history, setHistory] = useState<HistoryPoint[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCustomerHistory = async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/customers/${customerId}/point-history?page=${page}&per_page=15`);
            const data = response.data.data;
            setCustomer(data.customer || null);
            setHistory(data.history || []);
            setPagination(data.pagination || null);
        } catch (error: any) {
            console.error("Failed to fetch customer history", error);
            if (error.response?.status === 404) {
                toast.error("Pelanggan tidak ditemukan");
                router.push("/dashboard/customer-points");
            } else {
                toast.error("Gagal memuat data pelanggan");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchCustomerHistory(currentPage);
        }
    }, [customerId, currentPage]);

    if (loading && !customer) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Customer Info Card */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Link href="/dashboard/customer-points">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Icon icon="lucide:arrow-left" className="h-4 w-4" />
                        </Button>
                    </Link>
                    <CardTitle className="text-xl font-bold">Informasi Pelanggan</CardTitle>
                </CardHeader>
                <CardContent>
                    {customer && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-sm text-gray-500">Nama</p>
                                <p className="font-semibold">{customer.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold">{customer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Telepon</p>
                                <p className="font-semibold">{customer.phone || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Poin</p>
                                <p className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-lg font-bold text-amber-700">
                                        <Icon icon="lucide:coins" className="h-5 w-5" />
                                        {customer.formatted_point}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* History Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Riwayat Poin</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Tanggal</th>
                                    <th className="px-4 py-3 font-semibold">Tipe</th>
                                    <th className="px-4 py-3 font-semibold">Keterangan</th>
                                    <th className="px-4 py-3 font-semibold text-right">Poin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                                            <td className="px-4 py-3"><Skeleton className="h-6 w-16" /></td>
                                            <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                                            <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                                        </tr>
                                    ))
                                ) : history.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                            <Icon icon="lucide:history" className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                                            <p>Belum ada riwayat poin</p>
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-600">{item.created_at}</td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    className={
                                                        item.type === "Masuk"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }
                                                >
                                                    {item.type}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">{item.notes || "-"}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span
                                                    className={`font-semibold ${item.type === "Masuk" ? "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    {item.formatted_point}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Menampilkan {history.length} dari {pagination.total} riwayat
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    <Icon icon="lucide:chevron-left" className="h-4 w-4" />
                                    Prev
                                </Button>
                                <span className="flex items-center px-3 text-sm">
                                    {currentPage} / {pagination.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === pagination.last_page}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Next
                                    <Icon icon="lucide:chevron-right" className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
