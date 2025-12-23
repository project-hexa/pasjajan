"use client";

import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useEffect, useState } from "react";

export default function DataUsersPage() {
  const [dataUserAllRole, setDataUserAllRole] = useState<User[]>([]);
  const { getUserByRole } = useUserStore();

  useEffect(() => {
    const user = async () => {
      const { data: admin } = await getUserByRole("Admin");
      const { data: staff } = await getUserByRole("Staff");
      const { data: customer } = await getUserByRole("Customer");

      setDataUserAllRole((prev) => [
        ...prev,
        ...(Array.isArray(admin?.users) ? admin.users : []),
        ...(Array.isArray(staff?.users) ? staff.users : []),
        ...(Array.isArray(customer?.users) ? customer.users : []),
      ]);
    };
    user();
  }, [getUserByRole]);

  return (
    <section className="space-y-4">
      <Table className="overflow-clip rounded-2xl">
        <TableHeader>
          <TableRow className="bg-primary/30">
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Daftar</TableHead>
            <TableHead>Total Order</TableHead>
            <TableHead>aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataUserAllRole.map((user, i) => (
            <TableRow key={user.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status_account}</TableCell>
              <TableCell>{user.created_at}</TableCell>
              {/* TODO: Implement data Total Order dari db */}
              <TableCell>0</TableCell>
              <TableCell className="space-x-2">
                <Button size={"icon"}>
                  <Icon icon={"lucide:pencil"} />
                </Button>
                <Button size={"icon"} variant={"destructive"}>
                  <Icon icon={"lucide:trash"} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
