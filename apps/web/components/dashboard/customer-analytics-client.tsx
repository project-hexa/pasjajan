"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useEffect,
  useTransition,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
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
import { CustomerListResponse } from "@/lib/schema/customers-analytics.schema";
import { Icon } from "@workspace/ui/components/icon";

interface CustomerAnalyticsClientProps {
  initialData: CustomerListResponse["data"];
}

export default function CustomerAnalyticsClient({
  initialData,
}: CustomerAnalyticsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const previousSearchValue = useRef(searchParams.get("search") || "");

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );
  const [period, setPeriod] = useState<
    "daily" | "monthly" | "yearly" | "custom"
  >(
    (searchParams.get("period") as "daily" | "monthly" | "yearly" | "custom") ||
      "monthly",
  );
  const [fromDate, setFromDate] = useState<Date | undefined>(() => {
    const startDate = searchParams.get("start_date");
    return startDate ? new Date(startDate) : undefined;
  });
  const [toDate, setToDate] = useState<Date | undefined>(() => {
    const endDate = searchParams.get("end_date");
    return endDate ? new Date(endDate) : undefined;
  });

  const updateURL = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [searchParams, router],
  );

  useEffect(() => {
    if (searchValue === previousSearchValue.current) {
      return;
    }

    previousSearchValue.current = searchValue;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries({ search: searchValue, page: "1" }).forEach(
        ([key, value]) => {
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
        },
      );

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, searchParams, router]);

  const handlePeriodChange = (
    newPeriod: "daily" | "monthly" | "yearly" | "custom",
  ) => {
    setPeriod(newPeriod);
    const updates: Record<string, string> = { period: newPeriod, page: "1" };

    if (newPeriod !== "custom") {
      // Clear date range when not custom
      setFromDate(undefined);
      setToDate(undefined);
      updates.start_date = "";
      updates.end_date = "";
    }

    updateURL(updates);
  };

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);

    // Only update URL if both dates are selected
    if (date && toDate) {
      const updates: Record<string, string> = {
        page: "1",
        start_date: format(date, "yyyy-MM-dd"),
        end_date: format(toDate, "yyyy-MM-dd"),
        period: "custom",
      };
      setPeriod("custom");
      updateURL(updates);
    } else if (!date) {
      // Clear start_date if date is undefined
      const updates: Record<string, string> = {
        page: "1",
        start_date: "",
      };
      updateURL(updates);
    }
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);

    // Only update URL if both dates are selected
    if (date && fromDate) {
      const updates: Record<string, string> = {
        page: "1",
        start_date: format(fromDate, "yyyy-MM-dd"),
        end_date: format(date, "yyyy-MM-dd"),
        period: "custom",
      };
      setPeriod("custom");
      updateURL(updates);
    } else if (!date) {
      // Clear end_date if date is undefined
      const updates: Record<string, string> = {
        page: "1",
        end_date: "",
      };
      updateURL(updates);
    }
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
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
    <>
      <div className="flex items-center rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
        <Icon icon={"lucide:search"} className="text-muted-foreground" />
        <Input
          placeholder="Search customer name..."
          className="border-0 shadow-none focus-visible:ring-0"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
        <div className="flex gap-2">
          <DateRangePicker
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={handleFromDateChange}
            onToDateChange={handleToDateChange}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === "daily" ? "default" : "outline"}
            onClick={() => handlePeriodChange("daily")}
          >
            Daily
          </Button>
          <Button
            variant={period === "monthly" ? "default" : "outline"}
            onClick={() => handlePeriodChange("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={period === "yearly" ? "default" : "outline"}
            onClick={() => handlePeriodChange("yearly")}
          >
            Yearly
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className={isPending ? "pointer-events-none opacity-50" : ""}>
          <Table className="overflow-clip rounded-2xl bg-[#F7FFFB]">
            <TableHeader>
              <TableRow className="bg-[#B9DCCC]">
                <TableHead className="pl-8">Nama Pelanggan</TableHead>
                <TableHead>Tanggal Transaksi</TableHead>
                <TableHead>Total Item</TableHead>
                <TableHead className="pr-8">Total Harga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                initialData.customers.map((item, i) => (
                  <TableRow key={`customer-list-${i}`}>
                    <TableCell className="pl-8">{item.customer_name}</TableCell>
                    <TableCell>{item.transaction_date}</TableCell>
                    <TableCell>{item.total_items}</TableCell>
                    <TableCell className="pr-8">{item.total_payment}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {initialData.pagination.last_page > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (initialData.pagination.current_page > 1) {
                      handlePageChange(initialData.pagination.current_page - 1);
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
                      handlePageChange(initialData.pagination.current_page + 1);
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
        )}
      </div>
    </>
  );
}
