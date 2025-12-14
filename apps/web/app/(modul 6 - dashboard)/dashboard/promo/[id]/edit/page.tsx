"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { PromoForm } from "../../_components/promo-form";

export default function EditPromoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/promos/${id}`, {
                    headers: {
                        "Accept": "application/json",
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setInitialData(data.data);
                } else {
                    alert("Failed to fetch promo details");
                    router.push("/dashboard/promo");
                }
            } catch (error) {
                console.error(error);
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
                values.store_ids.forEach((id: string) => formData.append("store_ids[]", id));
            }
            if (values.product_ids && values.product_ids.length > 0) {
                values.product_ids.forEach((id: string) => formData.append("product_ids[]", id));
            }

            const response = await fetch(`http://localhost:8000/api/admin/promos/${id}`, {
                method: "POST", // Using POST for FormData with _method override
                headers: {
                    "Accept": "application/json",
                },
                body: formData,
            });

            if (response.ok) {
                router.push("/dashboard/promo");
                router.refresh(); // Refresh list
            } else {
                const errorData = await response.json();
                alert(`Failed to update promo: ${errorData.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
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