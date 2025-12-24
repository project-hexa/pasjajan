import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

export default function LoadingDataUsersSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Management Role Pengguna</h2>
        <Button>Tambah Akun</Button>
      </div>

      <SearchInput className="w-1/4" />

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
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i + 1}>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell className="flex gap-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
