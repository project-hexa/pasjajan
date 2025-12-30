"use client"

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { api } from "@/lib/utils/axios";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { Skeleton } from "@workspace/ui/components/skeleton";
import Image from "next/image";
import { use, useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  discounted_price: number;
  stock: number;
  image_url: string | null;
}

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
  products: Product[];
}

export default function PromoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [promo, setPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const response = await api.get(`/promos/${slug}`);
        setPromo(response.data.data);
      } catch (error) {
        console.error("Failed to fetch promo", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromo();
  }, [slug]);

  const formatCurrency = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Skeleton for banner
  const BannerSkeleton = () => (
    <div className="mb-8 w-full overflow-hidden rounded-xl shadow-md">
      <Skeleton className="aspect-3/1 w-full" />
    </div>
  );

  // Skeleton for product card
  const ProductSkeleton = () => (
    <Card className="relative rounded-xl border p-4 shadow-sm">
      <Skeleton className="absolute top-3 right-3 h-6 w-12 rounded-md" />
      <div className="flex h-40 w-full items-center justify-center">
        <Skeleton className="h-30 w-30 rounded-lg" />
      </div>
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="mt-4 h-10 w-full rounded-md" />
    </Card>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <BannerSkeleton />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!promo) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <Icon icon="lucide:tag-x" className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Promo tidak ditemukan</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-8 w-full overflow-hidden rounded-xl shadow-lg">
          <div className="relative aspect-3/1 w-full">
            {promo.banner_url ? (
              <Image
                src={promo.banner_url}
                alt={promo.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-linear-to-br from-green-600 to-green-800">
                <Icon icon="lucide:percent" className="h-20 w-20 text-white/80 mb-2" />
                <h2 className="text-2xl font-bold text-white">{promo.name}</h2>
                <p className="text-white/70 mt-1">Diskon {Math.round(Number(promo.discount_percentage))}%</p>
              </div>
            )}
          </div>
        </div>

        {promo.products && promo.products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {promo.products.map((item) => (
              <Card key={item.id} className="relative rounded-xl border p-4 shadow-sm">
                <span className="absolute top-3 right-3 rounded-md bg-green-700 px-2 py-1 text-xs text-white">
                  {Math.round(Number(promo.discount_percentage))}%
                </span>

                <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      width={120}
                      height={120}
                      alt={item.name}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Icon icon="lucide:shopping-bag" className="h-12 w-12 text-green-600/60" />
                      <span className="text-xs text-gray-400 mt-1">Produk</span>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <h2 className="line-clamp-2 text-sm font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-xs text-gray-400 line-through">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    {formatCurrency(item.discounted_price)}
                  </p>
                </div>

                <Button className="mt-4 w-full bg-green-700 hover:bg-green-800">
                  Tambah
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Icon icon="lucide:package-x" className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada produk dalam promo ini</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
