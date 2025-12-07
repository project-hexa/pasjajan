"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import Image from "next/image";

const promoSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    discount_percentage: z.coerce.number().min(1, "1% minimum").max(100, "100% maximum"),
    min_order_value: z.coerce.number().min(0, "Minimum order must be positive"),
    start_date: z.string().refine((val) => val !== "", "Start date is required"),
    end_date: z.string().refine((val) => val !== "", "End date is required"),
    status: z.enum(["Active", "Non-active"]),
    applies_to: z.enum(["All", "Specific"]),
    applies_to_product: z.enum(["All", "Specific"]),
    store_ids: z.array(z.string()).optional(),
    product_ids: z.array(z.string()).optional(),
    banner: z.any().optional(), // File list
});

type PromoFormValues = z.infer<typeof promoSchema>;

interface PromoFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

export function PromoForm({ initialData, onSubmit, isLoading }: PromoFormProps) {
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [stores, setStores] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PromoFormValues>({
        resolver: zodResolver(promoSchema),
        defaultValues: {
            name: "",
            description: "",
            discount_percentage: 0,
            min_order_value: 0,
            status: "Active",
            applies_to: "All",
            applies_to_product: "All",
            start_date: "",
            end_date: "",
            store_ids: [],
            product_ids: [],
        },
    });

    const appliesTo = watch("applies_to");
    const appliesToProduct = watch("applies_to_product");
    const selectedStoreIds = watch("store_ids") || [];
    const selectedProductIds = watch("product_ids") || [];

    useEffect(() => {
        // Fetch stores and products for selection
        fetch("http://localhost:8000/api/admin/promos/list/stores").then(res => res.json()).then(setStores).catch(console.error);
        fetch("http://localhost:8000/api/admin/promos/list/products").then(res => res.json()).then(setProducts).catch(console.error);

        if (initialData) {
            const formData = {
                ...initialData,
                start_date: initialData.start_date ? initialData.start_date.split('T')[0] : "",
                end_date: initialData.end_date ? initialData.end_date.split('T')[0] : "",
                // Map relations to IDs if they exist
                store_ids: initialData.stores ? initialData.stores.map((s: any) => s.id.toString()) : [],
                product_ids: initialData.products ? initialData.products.map((p: any) => p.id.toString()) : [],
            };
            reset(formData);
            if (initialData.banner_url) {
                setBannerPreview(initialData.banner_url);
            }
        }
    }, [initialData, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setValue("banner", e.target.files);
        }
    };

    const handleCheckboxChange = (field: "store_ids" | "product_ids", value: string, checked: boolean) => {
        const current = field === "store_ids" ? selectedStoreIds : selectedProductIds;
        if (checked) {
            setValue(field, [...current, value]);
        } else {
            setValue(field, current.filter((id) => id !== value));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Banner Upload */}
            <div className="space-y-2">
                <Label htmlFor="banner">Promo Banner</Label>
                <div className="flex flex-col gap-4">
                    {bannerPreview && (
                        <div className="relative w-full h-40 md:h-60 rounded-lg overflow-hidden border">
                            <Image src={bannerPreview} alt="Banner Preview" fill className="object-cover" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6"
                                onClick={() => {
                                    setBannerPreview(null);
                                    setValue("banner", null);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <Input id="banner" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                {errors.banner && <p className="text-sm text-red-500">{errors.banner.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Promo Name</Label>
                    <Input id="name" placeholder="e.g. New Year Sale" {...register("name")} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <div className="relative">
                        <select
                            id="status"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register("status")}
                        >
                            <option value="Active">Active</option>
                            <option value="Non-active">Non-active</option>
                        </select>
                    </div>
                    {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Promo description..." {...register("description")} />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                    <Input id="discount_percentage" type="number" min="1" max="100" placeholder="10" {...register("discount_percentage")} />
                    {errors.discount_percentage && <p className="text-sm text-red-500">{errors.discount_percentage.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="min_order_value">Min. Order Value (IDR)</Label>
                    <Input id="min_order_value" type="number" placeholder="0" {...register("min_order_value")} />
                    {errors.min_order_value && <p className="text-sm text-red-500">{errors.min_order_value.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input id="start_date" type="date" {...register("start_date")} className="w-full" />
                    {errors.start_date && <p className="text-sm text-red-500">{errors.start_date.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input id="end_date" type="date" {...register("end_date")} className="w-full" />
                    {errors.end_date && <p className="text-sm text-red-500">{errors.end_date.message}</p>}
                </div>
            </div>

            {/* Targeting Logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="applies_to">Applies To Stores</Label>
                        <select
                            id="applies_to"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...register("applies_to")}
                        >
                            <option value="All">All Stores</option>
                            <option value="Specific">Specific Stores</option>
                        </select>
                    </div>
                    {appliesTo === "Specific" && (
                        <div className="h-40 overflow-y-auto border rounded bg-white p-2">
                            {stores.map(store => (
                                <div key={store.id} className="flex items-center space-x-2 py-1">
                                    <input
                                        type="checkbox"
                                        id={`store-${store.id}`}
                                        value={store.id}
                                        checked={selectedStoreIds.includes(store.id.toString())}
                                        onChange={(e) => handleCheckboxChange("store_ids", store.id.toString(), e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label htmlFor={`store-${store.id}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {store.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="applies_to_product">Applies To Products</Label>
                        <select
                            id="applies_to_product"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...register("applies_to_product")}
                        >
                            <option value="All">All Products</option>
                            <option value="Specific">Specific Products</option>
                        </select>
                    </div>
                    {appliesToProduct === "Specific" && (
                        <div className="h-40 overflow-y-auto border rounded bg-white p-2">
                            {products.map(product => (
                                <div key={product.id} className="flex items-center space-x-2 py-1">
                                    <input
                                        type="checkbox"
                                        id={`product-${product.id}`}
                                        value={product.id}
                                        checked={selectedProductIds.includes(product.id.toString())}
                                        onChange={(e) => handleCheckboxChange("product_ids", product.id.toString(), e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label htmlFor={`product-${product.id}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {product.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="bg-[#1E8F59] hover:bg-[#166E45] text-white w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Promo
            </Button>
        </form>
    );
}
