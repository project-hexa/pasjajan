"use client";

import { getNotifications } from "@/services/notifications";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";

interface Notification {
  id: number;
  title: string;
  body: string;
  created_at: string;
}

interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNotifications = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getNotifications(page);
      setNotifications(data.data.notifications);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat notifikasi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginationItems = useMemo(() => {
    if (!pagination) return [];

    const currentPage = pagination.current_page;
    const lastPage = pagination.last_page;
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
  }, [pagination]);

  if (isLoading && notifications.length === 0) {
    return (
      <div className="rounded-2xl bg-[#F7FFFB] p-8 text-center shadow-xl">
        <p className="text-gray-600">Memuat notifikasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-xl">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl bg-[#F7FFFB] p-8 text-center shadow-xl">
        <p className="text-gray-600">Belum ada notifikasi yang dikirim.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="rounded-2xl bg-[#F7FFFB] p-4 shadow-xl"
          >
            <h4 className="font-semibold">{notification.title}</h4>
            <p>{notification.body}</p>
            <span className="text-sm text-gray-500">
              {format(
                new Date(notification.created_at),
                "dd MMMM yyyy, HH:mm",
                {
                  locale: id,
                },
              )}
            </span>
          </li>
        ))}
      </ul>

      {pagination && pagination.last_page > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page > 1) {
                    handlePageChange(pagination.current_page - 1);
                  }
                }}
                className={
                  pagination.current_page === 1
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
                    isActive={item === pagination.current_page}
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
                  if (pagination.current_page < pagination.last_page) {
                    handlePageChange(pagination.current_page + 1);
                  }
                }}
                className={
                  pagination.current_page === pagination.last_page
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
