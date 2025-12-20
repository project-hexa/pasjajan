"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { toast } from "@workspace/ui/components/sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { PromoForm } from "../../_components/promo-form";
import { api } from "@/lib/utils/axios";

export default function EditPromoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const response = await api.get(`/promos/${id}`);
                // ApiResponse format: { success, message, data: { ...promo } }
                setInitialData(response.data.data);
            } catch (error: any) {
                console.error(error);
                toast.error("Gagal memuat detail promo");
                router.push("/dashboard/promo");
            } finally {
                setFetching(false);
            }
        };

        fetchPromo();
    }, [id, router]);

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("_method", "PUT"); // Laravel requires POST with _method=PUT to handle parsing FormData with files
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
                values.store_ids.forEach((storeId: string) => formData.append("store_ids[]", storeId));
            }
            if (values.product_ids && values.product_ids.length > 0) {
                values.product_ids.forEach((productId: string) => formData.append("product_ids[]", productId));
            }

            await api.post(`/admin/promos/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Promo berhasil diperbarui!");
            router.push("/dashboard/promo");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Terjadi kesalahan";
            toast.error(`Gagal memperbarui promo: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/promo">
                    <Button variant="ghost" size="icon">
                        <Icon icon={"lucide:arrow-left"} className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Promo</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Promo Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PromoForm initialData={initialData} onSubmit={onSubmit} isLoading={loading} />
                </CardContent>
            </Card>
        </div>
    );
}
