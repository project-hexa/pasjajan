"use client";

import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/sonner";
import Link from "next/link";
import { api } from "@/lib/utils/axios";

interface Customer {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone: string;
    point: number;
    formatted_point: string;
    member_since: string;
}

interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export default function CustomerPointsPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"highest" | "lowest" | "newest" | "oldest">("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCustomers = async (page: number = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("per_page", "15");
            if (search) params.append("search", search);
            if (sort) params.append("sort", sort);

            const response = await api.get(`/admin/customers/points?${params.toString()}`);
            const data = response.data.data;
            setCustomers(data.customers || []);
            setPagination(data.pagination || null);
        } catch (error) {
            console.error("Failed to fetch customers", error);
            toast.error("Gagal memuat daftar pelanggan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage, sort]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchCustomers(1);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">Daftar Pelanggan & Poin</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Search & Sort */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex flex-1 gap-2">
                        <Input
                            placeholder="Cari nama, email, atau telepon..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="max-w-md"
                        />
                        <Button onClick={handleSearch} variant="outline">
                            <Icon icon="lucide:search" className="h-4 w-4" />
                        </Button>
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as any)}
                        className="rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="newest">Terbaru</option>
                        <option value="oldest">Terlama</option>
                        <option value="highest">Poin Tertinggi</option>
                        <option value="lowest">Poin Terendah</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#B9DCCC]">
                            <tr>
                                <th className="px-4 py-3 font-semibold">No</th>
                                <th className="px-4 py-3 font-semibold">Nama</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Telepon</th>
                                <th className="px-4 py-3 font-semibold text-right">Total Poin</th>
                                <th className="px-4 py-3 font-semibold">Member Sejak</th>
                                <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-8 w-20 mx-auto" /></td>
                                    </tr>
                                ))
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        Tidak ada data pelanggan
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer, index) => (
                                    <tr key={customer.id} className="border-b hover:bg-green-50">
                                        <td className="px-4 py-3">
                                            {((currentPage - 1) * 15) + index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{customer.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{customer.phone || "-"}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                                                <Icon icon="lucide:coins" className="h-4 w-4" />
                                                {customer.formatted_point}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{customer.member_since}</td>
                                        <td className="px-4 py-3 text-center">
                                            <Link href={`/dashboard/customer-points/${customer.id}`}>
                                                <Button size="sm" variant="outline">
                                                    <Icon icon="lucide:history" className="mr-1 h-4 w-4" />
                                                    History
                                                </Button>
                                            </Link>
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
                            Menampilkan {customers.length} dari {pagination.total} pelanggan
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
    );
}
