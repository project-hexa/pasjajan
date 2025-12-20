"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@workspace/ui/components/card";
import { BranchForm } from "../_components/branch-form";

type BranchFormValues = {
  code: string;
  name: string;
  address: string;
  phone_number: string;
  status: "Active" | "Inactive";
};

export default function CreateBranchPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: BranchFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          code: data.code,
          name: data.name,
          address: data.address,
          phone_number: data.phone_number,
          status: data.status,
          is_active: true,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Gagal menambahkan cabang');
      }

      router.push('/dashboard/branch-data');
    } catch (error: unknown) {
      console.error("Error creating branch:", error);
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat menambahkan cabang";
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
