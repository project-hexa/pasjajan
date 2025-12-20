"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@workspace/ui/components/card";
import { BranchForm } from "../_components/branch-form";

export default function CreateBranchPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
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
          ...data,
          is_active: true,
          latitude: parseFloat(data.latitude) || 0,
          longitude: parseFloat(data.longitude) || 0
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Gagal menambahkan cabang');
      }

      router.push('/dashboard/branch-data');
    } catch (error: any) {
      console.error("Error creating branch:", error);
      alert(error.message || "Terjadi kesalahan saat menambahkan cabang");
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
