"use client";

import { useEffect } from "react";
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
  code: z.string().min(3, "Kode cabang minimal 3 karakter"),
  name: z.string().min(2, "Nama cabang minimal 2 karakter"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  phone_number: z.string().min(10, "Nomor telepon minimal 10 karakter"),
  status: z.enum(["Active", "Inactive"], {
    required_error: "Status harus dipilih",
    invalid_type_error: "Status harus berupa 'Active' atau 'Inactive'"
  }),
});

type BranchFormValues = {
  code: string;
  name: string;
  address: string;
  phone_number: string;
  status: "Active" | "Inactive";
};

interface EditBranchFormProps {
  initialData?: Partial<BranchFormValues>;
  onSubmit: (data: BranchFormValues) => void;
  isLoading: boolean;
  onStatusChange?: (newStatus: "Active" | "Inactive") => Promise<boolean> | boolean;
}

export function EditBranchForm({ initialData, onSubmit, isLoading, onStatusChange }: EditBranchFormProps) {
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
      code: "",
      name: "",
      address: "",
      phone_number: "",
      status: "Active",
    },
  });

  const status = watch("status");

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code || "",
        name: initialData.name || "",
        address: initialData.address || "",
        phone_number: initialData.phone_number || "",
        status: initialData.status || "Active",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Status */}
        <input type="hidden" {...register('status')} />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right pl-6">Status</Label>
          <div className="col-span-3 -ml-2 pr-6">
            <Select
              value={status}
              onValueChange={async (val) => {
                const newStatus = val as "Active" | "Inactive";
                try {
                  if (typeof onStatusChange === 'function') {
                    const ok = await onStatusChange(newStatus);
                    if (!ok) return;
                  }
                  setValue('status', newStatus, { shouldDirty: true, shouldTouch: true });
                } catch {
                  // ignore
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Aktif</SelectItem>
                <SelectItem value="Inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Kode Cabang */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right pl-6">Kode Cabang</Label>
          <div className="col-span-3 -ml-2 pr-6">
            <Input
              id="code"
              placeholder="Contoh: JKT001"
              className={errors.code ? 'border-red-500' : ''}
              {...register('code')}
            />
            {errors.code && (
              <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
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

        {/* Nomor Telepon */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone_number" className="text-right pl-6">Nomor Telepon</Label>
          <div className="col-span-3 -ml-2 pr-6">
            <Input
              id="phone_number"
              placeholder="Contoh: 0211234567"
              className={errors.phone_number ? 'border-red-500' : ''}
              {...register('phone_number')}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500 mt-1">{errors.phone_number.message}</p>
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
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}

export default EditBranchForm;
