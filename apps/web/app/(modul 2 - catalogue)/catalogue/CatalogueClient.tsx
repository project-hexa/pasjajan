"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useSearchStore } from "@/stores/useSearchStore";
import { HeroBanner } from "./components/hero-banner";
import { TopRatedCarousel } from "./components/top-rated-carousel";
import { Navbar } from "@/components/ui/navigation-bar";
import { useCatalog } from "@/hooks/use-catalog";

const defaultBanners = [
  { id: 1, image: "/images/nutren-junior-head-banner-19082025.avif", title: "Promo Spesial", link: "#", cta: "Lihat" },
  { id: 2, image: "/images/Screenshot 2025-10-25 203248.png", title: "Diskon Member", link: "#", cta: "Cek" },
];

export default function CatalogueClient() {
  const params = useSearchParams();
  const q = params?.get("search")?.trim() ?? "";
  const { search, setSearch } = useSearchStore();
  const { stores, promos, loading } = useCatalog();

  const mappedBanners = React.useMemo(() => {
    if (!promos || promos.length === 0) return defaultBanners;
    return promos.map((p) => ({
      id: p.id,
      image: p.image_url || "/images/placeholder.png",
      title: p.title,
      link: p.link || "#",
      cta: "Detail"
    }));
  }, [promos]);

  const matchedRestaurants = React.useMemo(() => {
    const val = (search || "").trim().toLowerCase();
    if (!val || !stores) return [];
    return stores
      .filter((s) => s.name.toLowerCase().includes(val))
      .map((s) => ({
        slug: s.code,
        title: s.name,
        image: s.image_url || "/img/logo2.png",
        offers: ["Tersedia"],
        address: s.address,
      }));
  }, [search, stores]);

  const mapStoresToCards = (items: Store[]) => {
    return items.map((it) => ({
      id: it.id,
      slug: it.code,
      title: it.name,
      image: it.image_url || "/img/logo2.png",
      offers: ["Buka"],
    }));
  };

  React.useEffect(() => {
    if (q && q !== search) setSearch(q);
  }, [q, search, setSearch]);

  if (loading) return <div className="flex min-h-screen items-center justify-center font-medium">Sinkronisasi Database...</div>;

  return (
    <>
      <Navbar />
      <div className="flex w-full flex-col gap-10 px-4 pb-16 pt-8 sm:px-8 lg:px-12 xl:px-16">
        <HeroBanner banners={mappedBanners} itemsPerSlide={3} hideOnSearch={!!q} />
        
        {q ? (
          <section className="w-full">
            <h3 className="mb-6 text-xl font-bold">Hasil untuk: {q}</h3>
            <div className="grid gap-6">
              {matchedRestaurants.map((m) => (
                <Link key={m.slug} href={`/store/${m.slug}?search=${encodeURIComponent(search)}`}>
                  <div className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
                    <Image src={m.image} alt={m.title} width={80} height={80} className="rounded-xl object-cover" />
                    <div>
                      <h4 className="text-lg font-bold">{m.title}</h4>
                      <p className="text-sm text-gray-500">{m.address}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <>
            <TopRatedCarousel restaurants={mapStoresToCards(stores)} />
            {/* Katalog Produk dihapus */}
          </>
        )}
      </div>
    </>
  );
}