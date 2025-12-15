"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const branchSchema = z.object({
  name: z.string().min(2, "Nama cabang minimal 2 karakter"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  contact: z.string().min(10, "Kontak minimal 10 karakter"),
  status: z.enum(["Active", "Inactive"], {
    required_error: "Status harus dipilih",
    invalid_type_error: "Status harus berupa 'Active' atau 'Inactive'"
  }),
});

type BranchFormValues = {
  name: string;
  address: string;
  contact: string;
  status: "Active" | "Inactive";
};

interface BranchFormProps {
  initialData?: Partial<BranchFormValues>;
  onSubmit: (data: BranchFormValues) => void;
  isLoading: boolean;
}

export function BranchForm({ initialData, onSubmit, isLoading }: BranchFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      address: "",
      contact: "",
      status: "Active",
    },
  });

  const status = watch("status");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        address: initialData.address || "",
        contact: initialData.contact || "",
        status: initialData.status || "Active",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right pl-6">Status Cabang</Label>
                <div className="col-span-3 -ml-2 pr-6">
                    <Select
                    value={status}
                    onValueChange={(value) => setValue("status", value as "Active" | "Inactive")}
                    >
                    <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Pilih status cabang" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Aktif</SelectItem>
                        <SelectItem value="Inactive">Non-aktif</SelectItem>
                    </SelectContent>
                    </Select>
                    {errors.status && (
                    <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                    )}
                </div>
            </div>

            {/* Nama Cabang */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right pl-6">Nama Cabang</Label>
                <div className="col-span-3 -ml-2 pr-6">
                    <Input
                    id="name"
                    placeholder="Masukkan nama cabang"
                    {...register("name")}
                    className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                </div>
            </div>

            {/* Alamat Cabang */}
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right pl-6">Alamat Cabang</Label>
                <div className="col-span-3 -ml-2 pr-6">
                    <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap cabang"
                    rows={3}
                    {...register("address")}
                    className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                    )}
                </div>
            </div>

            {/* Detail Kontak */}
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right pl-6">Detail Kontak</Label>
                <div className="col-span-3 -ml-2 pr-6">
                    <Input
                    id="contact"
                    placeholder="Contoh: 081234567890"
                    {...register("contact")}
                    className={errors.contact ? 'border-red-500' : ''}
                    />
                    {errors.contact && (
                    <p className="text-sm text-red-500 mt-1">{errors.contact.message}</p>
                    )}
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 -ml-2 pr-6">
            <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isLoading}
            >
            Batal
            </Button>
            <Button 
            type="submit" 
            className="bg-[#1E8F59] hover:bg-[#166E45] text-white"
            disabled={isLoading}
            >
            {isLoading ? "Menyimpan..." : "Tambah Cabang"}
            </Button>
        </div>
    </form>
  );
}

export default BranchForm;
