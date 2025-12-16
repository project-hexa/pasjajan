"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition, useMemo } from "react";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { format } from "date-fns";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { LogResponse } from "@/lib/schema/log.schema";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";

interface ActivityLogClientProps {
  initialData: LogResponse["data"];
}

export default function ActivityLogClient({
  initialData,
}: ActivityLogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("email") || "",
  );
  const [fromDate, setFromDate] = useState<Date | undefined>(() => {
    const from = searchParams.get("from");
    return from ? new Date(from) : undefined;
  });
  const [toDate, setToDate] = useState<Date | undefined>(() => {
    const to = searchParams.get("to");
    return to ? new Date(to) : undefined;
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentEmail = searchParams.get("email") || "";
      if (searchQuery !== currentEmail) {
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery) {
          params.set("email", searchQuery);
        } else {
          params.delete("email");
        }
        params.set("page", "1");

        startTransition(() => {
          router.push(`?${params.toString()}`);
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchParams, router]);

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    const params = new URLSearchParams(searchParams.toString());

    if (date) {
      params.set("from", format(date, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    const params = new URLSearchParams(searchParams.toString());

    if (date) {
      params.set("to", format(date, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const paginationItems = useMemo(() => {
    const currentPage = initialData.pagination.current_page;
    const lastPage = initialData.pagination.last_page;
    const items: (number | "ellipsis")[] = [];

    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      if (currentPage <= 3) {
        items.push(2, 3, 4, "ellipsis", lastPage);
      } else if (currentPage >= lastPage - 2) {
        items.push(
          "ellipsis",
          lastPage - 3,
          lastPage - 2,
          lastPage - 1,
          lastPage,
        );
      } else {
        items.push(
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          lastPage,
        );
      }
    }

    return items;
  }, [initialData.pagination.current_page, initialData.pagination.last_page]);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Log Aktivitas</h2>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative flex items-center">
            <Icon icon={"lucide:search"} className="absolute left-3 h-4 w-4" />
            <Input
              placeholder="Search"
              className="w-full border border-black/20 bg-[#F7FFFB] pl-9 focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
        />
      </div>

      <div className="space-y-4">
        <div className={isPending ? "pointer-events-none opacity-50" : ""}>
          <Table className="overflow-clip rounded-2xl bg-[#F7FFFB]">
            <TableHeader>
              <TableRow className="bg-[#B9DCCC]">
                <TableHead className="pl-8">Waktu Aktivitas</TableHead>
                <TableHead>Informasi Pengguna</TableHead>
                <TableHead>Tipe Aktivitas</TableHead>
                <TableHead className="pr-8">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                initialData.logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="pl-8">{log.timestamp}</TableCell>
                    <TableCell>{log.user.email}</TableCell>
                    <TableCell>{log.activity_type}</TableCell>
                    <TableCell className="pr-8">{log.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {initialData.pagination.last_page > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (initialData.pagination.current_page > 1) {
                        handlePageChange(
                          initialData.pagination.current_page - 1,
                        );
                      }
                    }}
                    className={
                      initialData.pagination.current_page === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {paginationItems.map((item, index) => (
                  <PaginationItem key={`page-${index}`}>
                    {item === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(item);
                        }}
                        isActive={item === initialData.pagination.current_page}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        initialData.pagination.current_page <
                        initialData.pagination.last_page
                      ) {
                        handlePageChange(
                          initialData.pagination.current_page + 1,
                        );
                      }
                    }}
                    className={
                      initialData.pagination.current_page ===
                      initialData.pagination.last_page
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
    </section>
  );
}
