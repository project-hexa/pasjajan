"use client";

import { useState } from "react";
import { useNavigate } from "@/hooks/useNavigate";
import { Card, CardContent } from "@workspace/ui/components/card";
import { BranchForm } from "../_components/branch-form";
import { createBranch as createBranchService } from "@/services/branches";
import { AxiosError } from "axios";

type BranchFormValues = {
  code: string;
  name: string;
  address: string;
  phone_number: string;
  status: "Active" | "Inactive";
};

export default function CreateBranchPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: BranchFormValues) => {
    setIsLoading(true);
    try {
      const response = await createBranchService({
        code: data.code,
        name: data.name,
        address: data.address,
        phone_number: data.phone_number,
        status: data.status,
        is_active: true,
      });
      if (response.status < 200 || response.status >= 300) {
        const responseData = response.data as { message?: string } | undefined;
        throw new Error(responseData?.message || 'Gagal menambahkan cabang');
      }

      navigate.push('/dashboard/branch-data');
    } catch (error: any) {
      console.error("Error creating branch:", error);
      const axiosErr = error as AxiosError<{ message?: string }>;
      const message = axiosErr?.response?.data?.message || (error instanceof Error ? error.message : "Terjadi kesalahan saat menambahkan cabang");
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Tambah Cabang Baru</h2>
      </div>

      <div>
        <Card>
          <CardContent className="pt-6">
            <BranchForm 
              onSubmit={onSubmit} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
