"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Icon } from "@workspace/ui/components/icon";
import { useState } from "react";

interface VoucherFormData {
    code: string;
    name: string;
    description: string;
    discount_value: number;
    required_points: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

interface VoucherFormProps {
    initialData?: Partial<VoucherFormData>;
    onSubmit: (data: VoucherFormData) => void;
    isLoading: boolean;
}

export function VoucherForm({ initialData, onSubmit, isLoading }: VoucherFormProps) {
    const [formData, setFormData] = useState<VoucherFormData>({
        code: initialData?.code || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        discount_value: initialData?.discount_value || 0,
        required_points: initialData?.required_points || 0,
        start_date: initialData?.start_date || "",
        end_date: initialData?.end_date || "",
        is_active: initialData?.is_active ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Code */}
                <div className="space-y-2">
                    <Label htmlFor="code">Kode Voucher *</Label>
                    <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="DISC10K"
                        required
                        minLength={6}
                        maxLength={9}
                        className="uppercase"
                    />
                    <p className="text-xs text-muted-foreground">6-9 karakter</p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Voucher *</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Diskon Rp10.000"
                        required
                    />
                </div>

                {/* Discount Value */}
                <div className="space-y-2">
                    <Label htmlFor="discount_value">Nilai Diskon (Rp) *</Label>
                    <Input
                        id="discount_value"
                        name="discount_value"
                        type="number"
                        value={formData.discount_value || ""}
                        onChange={handleChange}
                        min={0}
                        required
                        placeholder="10000"
                    />
                </div>

                {/* Required Points */}
                <div className="space-y-2">
                    <Label htmlFor="required_points">Poin yang Dibutuhkan *</Label>
                    <Input
                        id="required_points"
                        name="required_points"
                        type="number"
                        value={formData.required_points || ""}
                        onChange={handleChange}
                        min={1}
                        required
                        placeholder="100"
                    />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                    <Label htmlFor="start_date">Tanggal Mulai *</Label>
                    <Input
                        id="start_date"
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                    <Label htmlFor="end_date">Tanggal Berakhir *</Label>
                    <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select
                        value={formData.is_active ? "active" : "inactive"}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, is_active: value === "active" }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Deskripsi voucher..."
                    rows={3}
                />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isLoading} className="bg-[#1E8F59] hover:bg-[#166E45] text-white">
                    {isLoading ? (
                        <>
                            <Icon icon={"lucide:loader"} className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Icon icon={"lucide:save"} className="mr-2 h-4 w-4" />
                            Save Voucher
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

