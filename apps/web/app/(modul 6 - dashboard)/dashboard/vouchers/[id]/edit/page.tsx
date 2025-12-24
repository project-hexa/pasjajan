"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VoucherForm } from "../../_components/voucher-form";
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

export default function EditVoucherPage() {
    const params = useParams();
    const router = useRouter();
    const voucherId = params.id as string;

    const [initialData, setInitialData] = useState<Voucher | null>(null);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await api.get(`/admin/vouchers/${voucherId}`);
                const voucher = response.data.data;
                setInitialData({
                    ...voucher,
                    start_date: voucher.start_date?.split("T")[0] || "",
                    end_date: voucher.end_date?.split("T")[0] || "",
                });
            } catch (error: any) {
                console.error(error);
                toast.error("Gagal memuat detail voucher", { toasterId: "global" });
                router.push("/dashboard/vouchers");
            } finally {
                setFetching(false);
            }
        };

        if (voucherId) {
            fetchVoucher();
        }
    }, [voucherId, router]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            await api.put(`/admin/vouchers/${voucherId}`, {
                code: values.code.toUpperCase(),
                name: values.name,
                description: values.description || null,
                discount_value: values.discount_value,
                required_points: values.required_points,
                start_date: values.start_date,
                end_date: values.end_date,
                is_active: values.is_active,
            });

            toast.success("Voucher berhasil diperbarui!", { toasterId: "global" });
            router.push("/dashboard/vouchers");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Terjadi kesalahan";
            toast.error(`Gagal memperbarui voucher: ${message}`, { toasterId: "global" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/vouchers">
                    <Button variant="ghost" size="icon">
                        <Icon icon={"lucide:arrow-left"} className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Voucher</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Voucher Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {initialData && (
                        <VoucherForm
                            initialData={{
                                code: initialData.code,
                                name: initialData.name,
                                description: initialData.description || "",
                                discount_value: Number(initialData.discount_value),
                                required_points: initialData.required_points,
                                start_date: initialData.start_date,
                                end_date: initialData.end_date,
                                is_active: initialData.is_active,
                            }}
                            onSubmit={onSubmit}
                            isLoading={loading}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
