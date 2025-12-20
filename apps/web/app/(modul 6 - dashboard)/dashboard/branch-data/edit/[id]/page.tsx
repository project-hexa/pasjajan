"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { toast } from "sonner";
import { Icon } from "@workspace/ui/components/icon";
import { EditBranchForm } from "../../_components/edit-branch-form";

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

export default function EditBranchPage() {
  const params = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState<BranchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/branches/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data cabang");
        }

        const responseData = await response.json();
        // Normalisasi bentuk data: dukung data langsung, data.branch, atau data.branches (array)
        let raw: any = null;
        const idParam = String(params.id);
        if (responseData?.data) {
          if (Array.isArray(responseData.data.branches)) {
            raw = responseData.data.branches.find((b: any) => String(b.id) === idParam) || null;
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
          name: raw.name,
          address: raw.address,
          phone_number: raw.phone_number,
          code: raw.code,
          latitude: raw.latitude ?? 0,
          longitude: raw.longitude ?? 0,
          status: raw.is_active ? 'active' : 'inactive',
        });
      } catch (error) {
        console.error("Error fetching branch:", error);
        toast.error("Gagal memuat data cabang");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBranch();
    }
  }, [params.id, toast]);

  const handleStatusChange = async (newStatus: "Active" | "Inactive"): Promise<boolean> => {
    // Tidak memanggil API di sini; hanya update state lokal.
    // Perubahan status akan dipersist saat tombol "Simpan Perubahan" ditekan (PUT /branches/{id}).
    if (!branch) return false;
    return true;
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branches/${params.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            code: formData.code,
            address: formData.address,
            phone_number: formData.phone_number,
            latitude: parseFloat(formData.latitude) || 0,
            longitude: parseFloat(formData.longitude) || 0,
            // Beberapa backend mengabaikan is_active pada PUT. Tetap kirim jika didukung.
            is_active: formData.status === 'Active',
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui cabang");
      }
      // Setelah PUT sukses, panggil endpoint khusus activate/deactivate HANYA jika status berubah
      const desiredActive = formData.status === 'Active';
      const currentActive = branch?.status === 'active';
      if (desiredActive !== currentActive) {
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/branches/${params.id}/${desiredActive ? 'activate' : 'deactivate'}`;
        const toggleResp = await fetch(endpoint, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
          },
        });
        if (!toggleResp.ok) {
          const err = await toggleResp.json().catch(() => ({}));
          throw new Error(err.message || 'Gagal mengubah status cabang');
        }
      }

      toast.success('Data cabang berhasil diperbarui');
      router.push('/dashboard/branch-data');
    } catch (error: any) {
      console.error("Error updating branch:", error);
      toast.error(error.message || "Terjadi kesalahan saat memperbarui cabang");
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
              isLoading={isLoading || statusLoading}
              onStatusChange={handleStatusChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
