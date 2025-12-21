"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/components/sonner";
import { Icon } from "@workspace/ui/components/icon";
import { EditBranchForm } from "../../_components/edit-branch-form";

interface BranchData {
  id: string;
  name: string;
  address: string;
  contact: string;
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
        setBranch({
          id: responseData.data.id,
          name: responseData.data.name,
          address: responseData.data.address,
          contact: responseData.data.phone_number,
          code: responseData.data.code,
          latitude: responseData.data.latitude,
          longitude: responseData.data.longitude,
          status: responseData.data.is_active ? "active" : "inactive",
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
  }, [params.id]);

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
            is_active: formData.status === "Active",
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui cabang");
      }

      toast.success("Data cabang berhasil diperbarui");
      router.push("/dashboard/branch-data");
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
                contact: branch.contact,
                status: branch.status === "active" ? "Active" : "Inactive",
              }}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
