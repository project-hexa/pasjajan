"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "@/hooks/useNavigate";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

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
import { Icon } from "@workspace/ui/components/icon";
import { getBranches as getBranchesService } from "@/services/branches";
import { AxiosError } from "axios";

interface Branch {
  id: string;
  name: string;
  address: string;
  income: string | number;
  contact: string;
  status: "active" | "inactive";
  code?: string;
  latitude?: number;
  longitude?: number;
}

type ApiBranch = Partial<{
  id: string | number;
  name: string;
  address: string;
  penghasilan: string | number;
  phone_number: string;
  is_active: boolean;
  code?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}>;

export default function BranchManagementPage() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const responseData = await getBranchesService();
        console.log("API Response:", responseData);

        // Get branches from the nested data.branches
        let branchesData: ApiBranch[] = (responseData.data?.branches as ApiBranch[]) || [];
        
        // Sort branches by created_at (newest first) or by ID if created_at is not available
        branchesData = [...branchesData].sort((a, b) => {
          // Try to sort by created_at if available
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          // Fallback to ID if created_at is not available
          return parseInt(String(b.id || "0")) - parseInt(String(a.id || "0"));
        });
        
        // Transform the API response to match our Branch interface
        const formattedBranches: Branch[] = branchesData.map((branch) => ({
          id: (branch.id !== undefined && branch.id !== null) ? String(branch.id) : "",
          name: branch.name || "Nama tidak tersedia",
          address: branch.address || "Alamat tidak tersedia",
          income: branch.penghasilan ?? "Rp 0",
          contact: branch.phone_number || "-",
          status: branch.is_active ? "active" : "inactive",
          code: branch.code || "",
          latitude: branch.latitude,
          longitude: branch.longitude,
        }));

        setBranches(formattedBranches);
        setTotalPages(Math.ceil(formattedBranches.length / itemsPerPage));
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const message = axiosErr?.response?.data?.message || (err instanceof Error ? err.message : "An error occurred");
        setError(message);
        console.error("Error fetching branches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Get current branches for pagination
  const indexOfLastBranch = currentPage * itemsPerPage;
  const indexOfFirstBranch = indexOfLastBranch - itemsPerPage;
  const currentBranches = branches.slice(indexOfFirstBranch, indexOfLastBranch);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Manajemen Data Cabang
          </h2>
        </div>
        <Button
          onClick={() => navigate.push("/dashboard/branch-data/create")}
          className="bg-[#1E8F59] text-white hover:bg-[#166E45]"
        >
          Tambah Cabang
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#1E8F59]"></div>
        </div>
      ) : error ? (
        <div
          className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div>
          <Table className="w-full overflow-clip rounded-2xl bg-[#F7FFFB]">
            <TableHeader>
              <TableRow className="bg-[#B9DCCC]">
                <TableHead className="w-1/5 pl-8 text-left">Nama</TableHead>
                <TableHead className="w-2/5 text-left">Alamat</TableHead>
                <TableHead className="w-1/6 text-center">Penghasilan</TableHead>
                <TableHead className="w-1/6 text-center">Kontak</TableHead>
                <TableHead className="w-1/6 text-center">Status</TableHead>
                <TableHead className="w-1/6 pr-8 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBranches.length > 0 ? (
                currentBranches.map((branch) => (
                  <TableRow key={branch.id} className="h-16">
                    <TableCell className="pl-8 font-medium text-left">{branch.name}</TableCell>
                    <TableCell className="text-left">{branch.address}</TableCell>
                    <TableCell className="text-center">{branch.income}</TableCell>
                    <TableCell className="text-center">{branch.contact}</TableCell>
                    <TableCell className="text-center">
                      <span className={branch.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                        {branch.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </TableCell>
                    <TableCell className="pr-8">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 hover:bg-[#B9DCCC]"
                          asChild
                        >
                          <Link
                            href={`/dashboard/branch-data/edit/${branch.id}`}
                          >
                            <Icon icon="lucide:pencil" className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Tidak ada data cabang yang tersedia.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
