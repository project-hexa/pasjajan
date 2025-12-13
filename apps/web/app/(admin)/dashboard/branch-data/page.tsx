"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";

interface Branch {
  id: string;
  name: string;
  address: string;
  income: string | number;
  contact: string;
}

export default function BranchManagementPage() {
  const router = useRouter();

  const allBranches: Branch[] = [
  {
    id: '1',
    name: 'Cabang Pusat',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    income: 'Rp 25.000.000',
    contact: '021-1234567'
  },
  {
    id: '2',
    name: 'Cabang BSD',
    address: 'Jl. Pahlawan Seribu, BSD City, Tangerang',
    income: 'Rp 18.500.000',
    contact: '021-7654321'
  },
  {
    id: '3',
    name: 'Cabang Bandung',
    address: 'Jl. Dago No. 45, Bandung',
    income: 'Rp 20.000.000',
    contact: '022-1234567'
  },
  {
    id: '4',
    name: 'Cabang Surabaya',
    address: 'Jl. Tunjungan No. 12, Surabaya',
    income: 'Rp 22.000.000',
    contact: '031-1234567'
  },
  {
    id: '5',
    name: 'Cabang Bali',
    address: 'Jl. Raya Kuta No. 88, Kuta, Bali',
    income: 'Rp 30.000.000',
    contact: '0361-1234567'
  },
  {
    id: '6',
    name: 'Cabang Medan',
    address: 'Jl. Sisingamangaraja No. 10, Medan',
    income: 'Rp 19.500.000',
    contact: '061-1234567'
  },
  {
    id: '7',
    name: 'Cabang Yogyakarta',
    address: 'Jl. Malioboro No. 52, Yogyakarta',
    income: 'Rp 21.000.000',
    contact: '0274-1234567'
  },
  {
    id: '8',
    name: 'Cabang Semarang',
    address: 'Jl. Pahlawan No. 15, Semarang',
    income: 'Rp 18.000.000',
    contact: '024-1234567'
  },
  {
    id: '9',
    name: 'Cabang Makassar',
    address: 'Jl. Pasar Ikan No. 30, Makassar',
    income: 'Rp 20.500.000',
    contact: '0411-1234567'
  },
  {
    id: '10',
    name: 'Cabang Palembang',
    address: 'Jl. Jenderal Sudirman No. 8, Palembang',
    income: 'Rp 17.500.000',
    contact: '0711-1234567'
  },
  {
    id: '11',
    name: 'Cabang Balikpapan',
    address: 'Jl. Jenderal Sudirman No. 45, Balikpapan',
    income: 'Rp 23.000.000',
    contact: '0542-1234567'
  },
  {
    id: '12',
    name: 'Cabang Manado',
    address: 'Jl. Sam Ratulangi No. 22, Manado',
    income: 'Rp 16.500.000',
    contact: '0431-1234567'
  },
  {
    id: '13',
    name: 'Cabang Malang',
    address: 'Jl. Basuki Rahmat No. 5, Malang',
    income: 'Rp 19.000.000',
    contact: '0341-1234567'
  },
  {
    id: '14',
    name: 'Cabang Batam',
    address: 'Jl. Raja Ali Haji No. 12, Batam',
    income: 'Rp 24.500.000',
    contact: '0778-1234567'
  },
  {
    id: '15',
    name: 'Cabang Pekanbaru',
    address: 'Jl. Jenderal Sudirman No. 10, Pekanbaru',
    income: 'Rp 18.500.000',
    contact: '0761-1234567'
  }
];
  
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allBranches.length / itemsPerPage);
  
  // Get current branches
  const indexOfLastBranch = currentPage * itemsPerPage;
  const indexOfFirstBranch = indexOfLastBranch - itemsPerPage;
  const branches = allBranches.slice(indexOfFirstBranch, indexOfLastBranch);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Manajemen Data Cabang</h2>
        <Button onClick={() => {}}>
          Tambah Cabang
        </Button>
      </div>

      <div>
        <Table className="w-full overflow-clip rounded-2xl bg-[#F7FFFB]">
            <TableHeader>
                <TableRow className="bg-[#B9DCCC]">
                <TableHead className="w-1/5 pl-8 text-left">Nama</TableHead>
                <TableHead className="w-2/5 text-left">Alamat</TableHead>
                <TableHead className="w-1/6 text-center">Penghasilan</TableHead>
                <TableHead className="w-1/6 text-center">Kontak</TableHead>
                <TableHead className="w-1/12 pr-8 text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {branches.length > 0 ? (
                branches.map((branch) => (
                    <TableRow key={branch.id} className="h-16">
                    <TableCell className="pl-8 font-medium text-left">{branch.name}</TableCell>
                    <TableCell className="text-left">{branch.address}</TableCell>
                    <TableCell className="text-center">{branch.income}</TableCell>
                    <TableCell className="text-center">{branch.contact}</TableCell>
                    <TableCell className="pr-8">
                        <div className="flex justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-[#B9DCCC]">
                            <Pencil className="h-4 w-4" />
                        </Button>
                        </div>
                    </TableCell>
                    </TableRow> 
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center">
                    Tidak ada data cabang
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}