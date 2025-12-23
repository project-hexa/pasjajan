"use client";

import { useAuthStore } from "@/app/(modul 1 - user management)/_stores/useAuthStore";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@workspace/ui/components/card";
import { AddAddress } from "../../_components/add-address";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [openAddAddressDialog, setOpenAddAddressDialog] =
    useState<boolean>(false);

  return (
    <>
      <h1 className="text-2xl font-bold">Alamat Saya</h1>

      <div className="flex w-full items-center justify-between">
        <Badge
          className="text-primary border-primary rounded-md p-2.5"
          variant={"outline"}
        >
          Semua Alamat
        </Badge>
        <Button onClick={() => setOpenAddAddressDialog(true)}>
          Tambah Alamat
        </Button>
        <AddAddress
          open={openAddAddressDialog}
          onOpenChange={setOpenAddAddressDialog}
        />
      </div>

      <Card className="border-primary bg-primary/10">
        <CardContent>
          <CardTitle>
            Rumah
            <Badge variant={"outline"} className="ml-2 p-0">
              Utama
            </Badge>
          </CardTitle>
          <h2 className="text-md font-bold">{user?.full_name}</h2>
          <span>{user?.phone_number}</span>
          <CardDescription>
            Jl.Jambu NO 100 RT 05 RW 07, Antapani, Antapani kidul 40291, Kota
            Bandung, Jawa Barat
          </CardDescription>
          <Button variant={"link"}>Ubah Alamat</Button>
        </CardContent>
      </Card>
    </>
  );
}
