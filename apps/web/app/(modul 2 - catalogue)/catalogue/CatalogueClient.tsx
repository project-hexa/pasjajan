"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useSearchStore } from "@/stores/useSearchStore";
import { HeroBanner } from "./components/hero-banner";
import { TopRatedCarousel } from "./components/top-rated-carousel";
import { Navbar } from "@/components/ui/navigation-bar";

// Default promo banners (will be replaced by API when available)
const promoBanners = [
  { id: 1, image: "/images/nutren-junior-head-banner-19082025.avif", title: "Gratis ongkir sepanjang hari!", link: "/promo/nutren", cta: "Klik di sini" },
  { id: 2, image: "/images/Screenshot 2025-10-25 203248.png", title: "Sweet Treats diskon s.d. 30%", link: "/promo/sweet-treats", cta: "klik di sini" },
  { id: 3, image: "/images/Screenshot 2025-10-25 202648.png", title: "Promo cashback Oktober", link: "/promo/cashback", cta: "lihat promo" },
  { id: 4, image: "/images/Screenshot 2025-10-25 203225.png", title: "Belanja hemat bulanan", link: "/promo/beli-hemat", cta: "cek sekarang" },
];


export default function CatalogueClient() {
  const params = useSearchParams();
  const q = params?.get("search")?.trim() ?? "";

  const router = useRouter();
  const { search, setSearch } = useSearchStore();
  const [isLoading, setIsLoading] = React.useState(false);

  // dynamic data from API
  interface StoreSummary {
    id: string;
    slug: string;
    title: string;
    image: string;
    offers?: string[];
  }

  interface ProductSummary {
    id: string;
    image_url?: string;
    image?: string;
    name?: string;
    title?: string;
    description?: string;
    short_description?: string;
    price?: number;
    final_price?: number;
  }

  const [topRatedRestaurants, setTopRatedRestaurants] = React.useState<StoreSummary[]>([]);
  const [products, setProducts] = React.useState<ProductSummary[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);

  const categories = [
    { title: "Rekomendasi", items: ["Sushi Day", "Burger Baik", "Jus 1L", "Ayam Gebrak"] },
    { title: "Top Laris", items: ["Mie Gaciakutan", "Kebab Biss", "Kopi Forest", "Pas Jajan"] },
    { title: "Resto Gratis Ongkir", items: ["Marbatak", "Mixul", "Ayam Bakar", "Es G Teler"] },
    { title: "Checkout Murah", items: ["Bakmie", "Tahu Gebrak", "Ayam UFC", "G Haus"] },
    { title: "Diskon Rame Rame", items: ["Domini", "Pizzz Hood", "Chees Cuiz", "Martabak London"] },
  ];

  const [isCatOpen, setIsCatOpen] = React.useState(false);
  const catButtonRef = React.useRef<HTMLDivElement | null>(null);
  const catOverlayRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!(e.target instanceof Node)) return;
      const insideButton = catButtonRef.current?.contains(e.target);
      const insideOverlay = catOverlayRef.current?.contains(e.target);
      if (!insideButton && !insideOverlay) setIsCatOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const matchedRestaurants = React.useMemo(() => {
    const val = (search || "").trim();
    if (!val) return [];
    const ql = val.toLowerCase();
    return topRatedRestaurants.filter((r) => (r.title || "").toLowerCase().includes(ql));
  }, [search, topRatedRestaurants]);

  React.useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, [search]);

  // ensure URL is in sync when search store changes (search component also updates URL)
  React.useEffect(() => {
    const val = (search || "").trim();
    const id = setTimeout(() => {
      if (val) router.replace(`/catalogue?search=${encodeURIComponent(val)}`);
      else router.replace(`/catalogue`);
    }, 400);
    return () => clearTimeout(id);
  }, [search]);

  const matchedFirst = matchedRestaurants.length > 0 ? matchedRestaurants[0] : null;
  // include current search query so store page can show filtered results
  const storeHref = matchedFirst
    ? `/store/${matchedFirst.slug}${(search || "").trim() ? `?search=${encodeURIComponent((search || "").trim())}` : ""}`
    : "#";

  // Initialize global search from query param when page loads
  React.useEffect(() => {
    if (q && q !== search) setSearch(q);
    if (!q && search) setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Fetch stores and products from API
  React.useEffect(() => {
    let mounted = true;
    setDataLoading(true);

    const fetchStores = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/stores");
        const json = await res.json();
        if (!mounted) return;
        let stores: unknown[] = [];
        if (json && json.success) {
          // support multiple response shapes
          if (Array.isArray(json.data)) stores = json.data;
          else if (Array.isArray(json.data?.data)) stores = json.data.data;
          else if (Array.isArray(json.data?.stores)) stores = json.data.stores;
        }

        if (stores.length > 0) {
          const mapped = stores.map((s) => {
            const si = s as Record<string, unknown>;
            const id = String(si.id ?? si.store_id ?? "");
            const slug = String(si.code ?? si.slug ?? `store-${id}`);
            const title = String(si.name ?? si.title ?? "Store");
            const image = String(si.image_url ?? si.logo_url ?? "");
            const offersRaw = si.offers;
            const offers = Array.isArray(offersRaw) ? (offersRaw as unknown[]).map((o) => String(o)) : [];

            return {
              id,
              slug,
              title,
              image: image || "/img/logo2.png",
              offers,
            } as StoreSummary;
          });
          setTopRatedRestaurants(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        const json = await res.json();
        if (!mounted) return;
        let items: unknown[] = [];
        if (json && json.success) {
          if (Array.isArray(json.data?.products)) items = json.data.products;
          else if (Array.isArray(json.data)) items = json.data;
          else if (Array.isArray(json.data?.data)) items = json.data.data;
        }

        const mapped = items.map((p) => {
          const pp = p as Record<string, unknown>;
          return {
            id: String(pp.id ?? pp.product_id ?? ""),
            image_url: String(pp.image_url ?? pp.image ?? ""),
            image: String(pp.image ?? pp.image_url ?? ""),
            name: String(pp.name ?? pp.title ?? ""),
            title: String(pp.title ?? pp.name ?? ""),
            description: String(pp.description ?? pp.short_description ?? ""),
            short_description: String(pp.short_description ?? pp.description ?? ""),
            price: Number(pp.price ?? pp.final_price ?? 0),
            final_price: Number(pp.final_price ?? pp.price ?? 0),
          } as ProductSummary;
        });
        setProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    Promise.all([fetchStores(), fetchProducts()]).finally(() => {
      if (mounted) setDataLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  

  return (
    <>
      <Navbar />

      <div className="flex w-full flex-col gap-10 px-4 pb-16 pt-8 sm:px-8 lg:px-12 xl:px-16">
        <HeroBanner banners={promoBanners} itemsPerSlide={3} hideOnSearch={!!q} />

        {q ? (
          <section className="w-full">
            <h3 className="mb-1 text-lg font-semibold text-[#111827]">Hasil Pencarian untuk &quot;{q.toUpperCase()}&quot;...</h3>
            <p className="mb-6 text-sm text-[#6B7280]">Menampilkan {matchedRestaurants.length} Resto</p>

            {isLoading && <div className="mb-4 text-sm text-[#6B7280]">Memuat hasil...</div>}

            {matchedRestaurants.length > 0 ? (
              <div className="mb-8 space-y-6">
                {matchedRestaurants.map((m) => {
                  const href = `/store/${m.slug}${(search || "").trim() ? `?search=${encodeURIComponent((search || "").trim())}` : ""}`;
                  return (
                    <Link key={m.slug} href={href} prefetch={false} aria-label={`Buka ${m.title ?? 'store'}`} className="block">
                      <article className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm hover:shadow-lg transition">
                        <div className="flex items-start gap-4 p-4">
                          {m.image ? (
                            <Image src={m.image} alt={m.title ?? "store"} width={72} height={72} className="h-18 w-18 rounded-xl object-cover" />
                          ) : (
                            <div className="flex h-18 w-18 items-center justify-center rounded-xl bg-black text-white">PJ</div>
                          )}

                          <div className="flex-1">
                            <h4 className="text-xl font-bold leading-tight text-[#111827]">{m.title}</h4>
                            <p className="mt-1 text-sm text-[#6B7280]">Snack</p>

                            <div className="mt-3 flex items-center gap-3 text-sm text-[#6B7280]">
                              <span className="flex items-center gap-2 text-sm text-[#6B7280]"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FBBF24" className="h-4 w-4"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.455a1 1 0 00-1.176 0l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69L9.05 2.927z" /></svg>★ 4.8 (1.4RB)</span>
                              <span>· 1km · 15min</span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#009F4D]">
                              {(m.offers || []).map((o, i: number) => (
                                <span key={i} className="font-medium">{String(o)}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-4">
                          <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2 items-start md:pl-20">
                            {(products.length > 0 ? products : []).map((p) => (
                              <div key={p.id} className="min-w-[140px] md:min-w-[160px]">
                                <div className="flex w-full flex-col items-center gap-2 rounded-lg bg-white p-2">
                                  <Image src={p.image_url || p.image || '/images/placeholder.png'} alt={p.name || p.title || 'product'} className="h-28 w-28 object-contain" width={112} height={112} />
                                  <h5 className="mt-1 text-sm font-semibold text-center text-[#111827]">{p.name || p.title}</h5>
                                  <p className="text-xs text-[#6B7280] text-center">{p.description || p.short_description || ''}</p>
                                  <p className="mt-1 text-sm font-bold text-red-600">Rp. {(p.price || p.final_price || 0).toLocaleString('id-ID')}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 text-sm text-[#6B7280]">Lihat 120 gerai &gt;</div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mb-8 rounded-lg bg-white p-6 text-sm text-[#6B7280]">Tidak ada hasil untuk {q}</div>
            )}

            <h3 className="mb-4 text-2xl font-semibold">Rekomendasi</h3>
            <TopRatedCarousel restaurants={topRatedRestaurants} showHeading={false} />
          </section>
        ) : (
          <TopRatedCarousel restaurants={topRatedRestaurants} />
        )}
      </div>
    </>
  );
}