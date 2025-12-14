"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Promo {
    id: number;
    name: string;
    description: string;
    banner_url?: string;
    discount_percentage: string;
    min_order_value: string;
    start_date: string;
    end_date: string;
    status: "Active" | "Non-active";
    applies_to: "All" | "Specific";
    applies_to_product: "All" | "Specific";
}

export default function PromoPage() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPromos = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/admin/promos", {
                headers: {
                    "Accept": "application/json",

                }
            });
            if (response.ok) {
                const data = await response.json();
                setPromos(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch promos", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePromo = async (id: number) => {
        if (!confirm("Are you sure you want to delete this promo?")) return;

        try {
            const response = await fetch(`http://localhost:8000/api/admin/promos/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                }
            });

            if (response.ok) {
                fetchPromos();
            } else {
                alert("Failed to delete promo");
            }
        } catch (error) {
            console.error("Failed to delete promo", error);
        }
    }

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
                    <h1 className="text-3xl font-bold tracking-tight">Promo Management</h1>
                    <p className="text-muted-foreground mt-1">Manage discounts and promotions for your store.</p>
                </div>
                <Link href="/dashboard/promo/create">
                    <Button className="bg-[#1E8F59] hover:bg-[#166E45] text-white">
                        <Icon icon={"ic:outline-plus"} className="mr-2 h-4 w-4" /> Add Promo
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Promos</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-10">Loading promos...</div>
                    ) : promos.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No promos found. Create a new one to get started.
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Promo</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Discount</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Period</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {promos.map((promo) => (
                                        <tr key={promo.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    {promo.banner_url ? (
                                                        <div className="h-12 w-20 relative rounded overflow-hidden flex-shrink-0">
                                                            <Image src={promo.banner_url} alt={promo.name} fill className="object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="h-12 w-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                                            <Icon icon={"lucide:tag"} className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-medium">{promo.name}</span>
                                                        <span className="text-xs text-muted-foreground line-clamp-1">{promo.description}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-1">
                                                        <Icon icon={"lucide:percent"} className="h-3 w-3" />
                                                        {Math.round(Number(promo.discount_percentage))}%
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Min. {formatCurrency(promo.min_order_value)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Icon icon={"lucide:calendar"} className="h-3 w-3 text-muted-foreground" />
                                                        {formatDate(promo.start_date)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground pl-4">
                                                        to {formatDate(promo.end_date)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${promo.status === 'Active' ? 'bg-[#1E8F59] text-white hover:bg-[#166E45]' : 'bg-secondary text-secondary-foreground'}`}>
                                                    {promo.status}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/dashboard/promo/${promo.id}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Icon icon={"lucide:pencil"} className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deletePromo(promo.id)}>
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
        </div>
    );
}