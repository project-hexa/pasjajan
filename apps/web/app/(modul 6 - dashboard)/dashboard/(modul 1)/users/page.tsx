import { userService } from "@/app/(modul 1 - user management)/_services/user.service";
import { SearchInput } from "@/components/ui/search-input";
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
import { EditModal } from "../_components/edit-modal";

export default async function DataUsersPage() {
  const { data: admin } = await userService.getUserByRole("Admin");
  const { data: staff } = await userService.getUserByRole("Staff");
  const { data: customer } = await userService.getUserByRole("Customer");

  const dataUserAllRole = await Promise.all([
    ...(Array.isArray(admin?.users) ? admin.users : []),
    ...(Array.isArray(staff?.users) ? staff.users : []),
    ...(Array.isArray(customer?.users) ? customer.users : []),
  ]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Management Role Pengguna</h2>
        <Button>Tambah Akun</Button>
      </div>

      <SearchInput classNameContainer="w-1/4" />

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
        <TableBody className="bg-card">
          {dataUserAllRole.map((user, i) => (
            <TableRow key={`user-${user.id}-${i + 1}`}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status_account}</TableCell>
              <TableCell>{user.created_at}</TableCell>
              {/* TODO: Implement data Total Order dari db */}
              <TableCell>0</TableCell>
              <TableCell className="space-x-2">
                <EditModal user={user} />
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
