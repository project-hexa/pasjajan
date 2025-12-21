"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/components/sonner";
import { Icon } from "@workspace/ui/components/icon";
import { EditBranchForm } from "../../_components/edit-branch-form";
import { getBranch as getBranchService, updateBranch as updateBranchService, toggleBranch as toggleBranchService } from "@/services/branches";
import { AxiosError } from "axios";

interface BranchData {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  code: string;
  latitude: number;
  longitude: number;
  status: "active" | "inactive";
}

type BranchFormValues = {
  code: string;
  name: string;
  address: string;
  phone_number: string;
  status: "Active" | "Inactive";
};

type ApiBranch = Partial<{
  id: string | number;
  name: string;
  address: string;
  phone_number: string;
  code: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}>;

export default function EditBranchPage() {
  const params = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState<BranchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const responseData = await getBranchService(String(params.id));
        // Normalisasi bentuk data: dukung data langsung, data.branch, atau data.branches (array)
        let raw: ApiBranch | null = null;
        const idParam = String(params.id);
        if (responseData?.data) {
          if (Array.isArray(responseData.data.branches)) {
            raw = (responseData.data.branches as ApiBranch[]).find((b) => String(b.id) === idParam) || null;
          } else if (responseData.data.branch) {
            raw = responseData.data.branch;
          } else {
            raw = responseData.data;
          }
        }

        if (!raw) {
          throw new Error('Data cabang tidak ditemukan');
        }

        setBranch({
          id: String(raw.id),
          name: (raw.name as string),
          address: (raw.address as string),
          phone_number: (raw.phone_number as string),
          code: (raw.code as string),
          latitude: (raw.latitude as number) ?? 0,
          longitude: (raw.longitude as number) ?? 0,
          status: raw.is_active ? 'active' : 'inactive',
        });
      } catch (error) {
        console.error("Error fetching branch:", error);
        toast.error("Gagal memuat data cabang", {
          toasterId: "global",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBranch();
    }
  }, [params.id]);

  const handleStatusChange = async (_newStatus: "Active" | "Inactive"): Promise<boolean> => {
    // Tidak memanggil API di sini; hanya update state lokal.
    // Perubahan status akan dipersist saat tombol "Simpan Perubahan" ditekan (PUT /branches/{id}).
    if (!branch) return false;
    // Gunakan parameter agar tidak dianggap unused oleh ESLint
    void _newStatus;
    return true;
  };

  const handleSubmit = async (formData: BranchFormValues) => {
    try {
      setIsLoading(true);
      const response = await updateBranchService(String(params.id), {
        name: formData.name,
        code: formData.code,
        address: formData.address,
        phone_number: formData.phone_number,
        // Beberapa backend mengabaikan is_active pada PUT. Tetap kirim jika didukung.
        is_active: formData.status === 'Active',
      });
      if (response.status < 200 || response.status >= 300) {
        const errorData = response.data as { message?: string } | undefined;
        throw new Error(errorData?.message || "Gagal memperbarui cabang");
      }
      // Setelah PUT sukses, panggil endpoint khusus activate/deactivate HANYA jika status berubah
      const desiredActive = formData.status === 'Active';
      const currentActive = branch?.status === 'active';
      if (desiredActive !== currentActive) {
        const toggleResp = await toggleBranchService(String(params.id), desiredActive);
        if (toggleResp.status < 200 || toggleResp.status >= 300) {
          const err = (toggleResp.data as { message?: string } | undefined) ?? {};
          throw new Error(err?.message || 'Gagal mengubah status cabang');
        }
      }

      toast.success("Data cabang berhasil diperbarui", {
        toasterId: "global",
      });
      router.push("/dashboard/branch-data");
    } catch (error: any) {
      console.error("Error updating branch:", error);
      toast.error(
        error.message || "Terjadi kesalahan saat memperbarui cabang",
        {
          toasterId: "global",
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Icon icon="lucide:loader-2" className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="py-8 text-center">
        <p>Data cabang tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Data Cabang</h2>
      </div>

      <div>
        <Card>
          <CardContent className="pt-6">
            <EditBranchForm
              initialData={{
                name: branch.name,
                address: branch.address,
                phone_number: branch.phone_number,
                code: branch.code,
                status: branch.status === 'active' ? 'Active' : 'Inactive' as 'Active' | 'Inactive'
              }}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onStatusChange={handleStatusChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
