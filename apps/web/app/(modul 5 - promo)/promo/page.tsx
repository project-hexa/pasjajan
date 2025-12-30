"use client";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { api } from "@/lib/utils/axios";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Promo {
  id: number;
  name: string;
  banner_url: string | null;
  description: string;
  discount_percentage: string;
  min_order_value: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function PromoPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPromos = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/promos?page=${page}`);
      // ApiResponse format: { success, message, data: { data: [...], meta: {...} } }
      const responseData = response.data.data;
      setPromos(responseData.data || []);
      setMeta(responseData.meta || null);
    } catch (error) {
      console.error("Failed to fetch promos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "d MMMM yyyy", { locale: id });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PromoSkeleton = () => (
    <Card className="overflow-hidden rounded-xl border bg-white p-0">
      <Skeleton className="aspect-video w-full" />
      <div className="space-y-2 p-4 pt-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-7xl flex-1 px-4 py-10">
        <h1 className="mb-8 text-3xl font-semibold text-gray-800">
          Semua Promo
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <PromoSkeleton key={i} />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <div className="py-20 text-center">
            <Icon
              icon="lucide:tag"
              className="mx-auto mb-4 h-16 w-16 text-gray-300"
            />
            <p className="text-lg text-gray-500">
              Tidak ada promo tersedia saat ini
            </p>
          </div>
        ) : (
          <>
            <div className="grid cursor-pointer grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promos.map((promo) => (
                <Link key={promo.id} href={`/promo/${promo.id}`}>
                  <Card className="overflow-hidden rounded-xl border bg-white p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="group relative aspect-video w-full overflow-hidden bg-gray-100">
                      {promo.banner_url ? (
                        <Image
                          src={promo.banner_url}
                          alt={promo.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Icon
                            icon="lucide:image"
                            className="h-12 w-12 text-gray-300"
                          />
                        </div>
                      )}
                      {/* Discount Badge */}
                      <span className="absolute top-3 right-3 rounded-md bg-green-700 px-2 py-1 text-xs font-bold text-white">
                        {Math.round(Number(promo.discount_percentage))}% OFF
                      </span>
                    </div>

                    <div className="p-4 pt-3">
                      <h2 className="line-clamp-1 font-bold text-gray-800">
                        {promo.name}
                      </h2>
                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                        {promo.description}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                        <Icon icon="lucide:calendar" className="h-3 w-3" />
                        {formatDate(promo.start_date)} -{" "}
                        {formatDate(promo.end_date)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Icon icon="lucide:chevron-left" className="h-4 w-4" />
                </Button>

                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(page)}
                      className={
                        currentPage === page
                          ? "bg-green-700 hover:bg-green-800"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.last_page}
                >
                  <Icon icon="lucide:chevron-right" className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
