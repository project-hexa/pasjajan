"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { toast } from "@workspace/ui/components/sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VoucherForm } from "../_components/voucher-form";
import { api } from "@/lib/utils/axios";

export default function CreateVoucherPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            await api.post("/admin/vouchers", {
                code: values.code.toUpperCase(),
                name: values.name,
                description: values.description || null,
                discount_value: values.discount_value,
                required_points: values.required_points,
                start_date: values.start_date,
                end_date: values.end_date,
                is_active: values.is_active,
            });

            toast.success("Voucher berhasil dibuat!", { toasterId: "global" });
            router.push("/dashboard/vouchers");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Terjadi kesalahan";
            toast.error(`Gagal membuat voucher: ${message}`, { toasterId: "global" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/vouchers">
                    <Button variant="ghost" size="icon">
                        <Icon icon={"lucide:arrow-left"} className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Create Voucher</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Voucher Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <VoucherForm onSubmit={onSubmit} isLoading={loading} />
                </CardContent>
            </Card>
        </div>
    );
}
