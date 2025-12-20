"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { toast } from "@workspace/ui/components/sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PromoForm } from "../_components/promo-form";
import { api } from "@/lib/utils/axios";

export default function CreatePromoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            if (values.description) formData.append("description", values.description);
            formData.append("discount_percentage", values.discount_percentage.toString());
            formData.append("min_order_value", values.min_order_value.toString());
            formData.append("start_date", values.start_date);
            formData.append("end_date", values.end_date);
            formData.append("status", values.status);
            formData.append("applies_to", values.applies_to);
            formData.append("applies_to_product", values.applies_to_product);

            // Handle Banner
            if (values.banner && values.banner.length > 0) {
                formData.append("banner", values.banner[0]);
            }

            // Handle Arrays
            if (values.store_ids && values.store_ids.length > 0) {
                values.store_ids.forEach((id: string) => formData.append("store_ids[]", id));
            }
            if (values.product_ids && values.product_ids.length > 0) {
                values.product_ids.forEach((id: string) => formData.append("product_ids[]", id));
            }

            await api.post("/admin/promos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Promo berhasil dibuat!");
            router.push("/dashboard/promo");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Terjadi kesalahan";
            toast.error(`Gagal membuat promo: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/promo">
                    <Button variant="ghost" size="icon">
                        <Icon icon={"lucide:arrow-left"} className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Create Promo</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Promo Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PromoForm onSubmit={onSubmit} isLoading={loading} />
                </CardContent>
            </Card>
        </div>
    );
}
