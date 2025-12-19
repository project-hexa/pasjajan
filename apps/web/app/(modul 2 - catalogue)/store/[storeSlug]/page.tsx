import React, { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import StoreProductList, { StoreProduct } from "../_components/store-product-list";
import { Navbar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/ui/footer";

const defaultHeroSubtitle = "Belanja semua kebutuhan kelontong favoritmu, langsung dari toko terpercaya di kota kamu.";

const defaultPopularProducts: StoreProduct[] = (() => {
  const base: StoreProduct = {
    id: "minyak-goreng",
    name: "Minyak Goreng",
    description: "Botol 2L",
    price: 38500,
    image: "/images/Screenshot 2025-10-25 173437.png",
    details:
      "Minyak goreng kemasan 2 liter dengan rasa netral yang cocok untuk menumis maupun menggoreng. Kemasan rapat memudahkan penyimpanan di dapur rumah atau toko.",
  };

  // create multiple identical products to simplify backend mapping during development
  return Array.from({ length: 8 }).map((_, idx) => ({ ...base, id: `${base.id}-${idx + 1}` }));
})();

const storeSeeds = [
  { slug: "pas-jajan-setiabudhi", name: "Pas Jajan - Setiabudhi" },
  { slug: "sushi-day-bandung", name: "Sushi Day - Bandung" },
  { slug: "burger-baik-cimahi", name: "Burger Baik - Cimahi" },
  { slug: "warkop-bandung", name: "Warkop - Bandung" },
  { slug: "jus-1l-gerlong", name: "Jus 1L - Gerlong" },
  { slug: "pizza-cuy-bandung", name: "Pizza Cuy - Bandung" },
  { slug: "roti-h-gerlong", name: "Roti H - Gerlong" },
  { slug: "ayam-bakar-mantap-bandung", name: "Ayam Bakar Mantap - Bandung", category: "Kuliner" },
  { slug: "dimsum-suka-bandung", name: "Dimsum Suka - Bandung", category: "Kuliner" },
  { slug: "toko-manis-bandung", name: "Toko Manis - Bandung", category: "Dessert" },
];

const storeCatalogue = storeSeeds.map((seed) => ({
  slug: seed.slug,
  name: seed.name,
  category: seed.category ?? "Snack",
  rating: 4.8,
  reviewCount: "1.4RB",
  distance: "1km",
  eta: "15min",
  discounts: ["Diskon 25%", "Diskon Ongkir"],
  heroTitle: "Toko Jajanan No.1 di Indonesia",
  heroSubtitle: defaultHeroSubtitle,
  heroImage: "/img/logo2.png",
  popularProducts: defaultPopularProducts.map((product) => ({ ...product })),
}));

const storeIndex = Object.fromEntries(storeCatalogue.map((store) => [store.slug, store]));

export default function StorePage(props: any) {
  const { params, searchParams } = props as { params: { storeSlug: string }; searchParams: { search?: string } };
  const slug = params.storeSlug;

  // Try to fetch store data from backend and fall back to seeds
  try {
    const res = await fetch("http://localhost:8000/api/stores");
    const json = await res.json();
    let stores: any[] = [];
    if (json && json.success) {
      if (Array.isArray(json.data)) stores = json.data;
      else if (Array.isArray(json.data?.data)) stores = json.data.data;
      else if (Array.isArray(json.data?.stores)) stores = json.data.stores;
    }

    const found = stores.find((s: any) => {
      const candidates = [s.code, s.slug, s.name].filter(Boolean).map((v: any) => String(v).toLowerCase());
      return candidates.includes(String(slug).toLowerCase());
    });

    let store: any = null;

    if (found) {
      // build basic store object
      store = {
        slug: found.code || found.slug || slug,
        name: found.name || found.title || "Store",
        category: found.category || "Snack",
        rating: found.rating || 4.8,
        reviewCount: found.review_count || "0",
        distance: found.distance || "1km",
        eta: found.eta || "15min",
        discounts: found.discounts || found.offers || [],
        heroTitle: found.hero_title || "Toko Jajanan No.1 di Indonesia",
        heroSubtitle: found.description || defaultHeroSubtitle,
        heroImage: found.image_url || found.logo_url || "/img/logo2.png",
        popularProducts: Array.isArray(found.products)
          ? found.products.map((p: any) => ({
              id: String(p.id || p.product_id || p.sku || Math.random()),
              name: p.name || p.title || "Produk",
              description: p.description || p.short_description || "",
              price: Number(p.price || p.final_price || p.sale_price || 0),
              image: p.image_url || p.image || "/images/Screenshot 2025-10-25 173437.png",
              details: p.details || p.long_description || undefined,
            }))
          : [],
      };

      // try to fetch products from backend API (global products endpoint)
      try {
        const prodRes = await fetch("http://localhost:8000/api/products");
        const prodJson = await prodRes.json();
        let items: any[] = [];
        if (prodJson && prodJson.success) {
          if (Array.isArray(prodJson.data?.products)) items = prodJson.data.products;
          else if (Array.isArray(prodJson.data)) items = prodJson.data;
          else if (Array.isArray(prodJson.data?.data)) items = prodJson.data.data;
        }

        // try to find products that belong to this store by common fields
        if (items.length > 0) {
          const storeIdentifiers = [found.id, found.code, found.slug, found.name].filter(Boolean).map((v: any) => String(v).toLowerCase());

  const rawQuery = searchParams?.search ?? "";
  const trimmedQuery = rawQuery.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const searchResults: StoreProduct[] = hasQuery
    ? store.popularProducts.filter((product) => {
        const haystack = `${product.name} ${product.description}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : [];

  const hasSearchResults = searchResults.length > 0;
  const heroHidden = hasQuery;

  return (
    <main className="min-h-screen flex flex-col bg-[#F9FAFB] pb-0 pt-0">
      <Suspense fallback={<div />}>
        <Navbar />
      </Suspense>
      <div className="mx-auto flex-1 w-full max-w-[90rem] px-4 pb-10 sm:px-6 lg:px-8 xl:px-10">
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            heroHidden
              ? "mt-0 max-h-0 -translate-y-6 opacity-0 pointer-events-none"
              : "mt-6 max-h-[520px] translate-y-0 opacity-100"
          }`}
        >
          <section className="rounded-2xl bg-black px-6 py-10 text-white shadow-lg sm:px-10 lg:px-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-4">
                <p className="text-sm uppercase tracking-wide text-[#FACC15]">PasJajan</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">{store.heroTitle}</h2>
                <p className="text-lg text-white/80">{store.heroSubtitle}</p>
                <div className="flex items-center gap-2 text-[#FACC15]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M12 2.5l2.924 5.925 6.541.952-4.732 4.615 1.118 6.516L12 17.77l-5.851 3.738 1.118-6.516-4.732-4.615 6.541-.952L12 2.5z" />
                    </svg>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {hasQuery ? (
            <section className="mt-8">
              <div className="space-y-1">
                <p className="text-sm text-[#111827]">
                  Hasil pencarian untuk &quot;<span className="font-semibold">{trimmedQuery}</span>&quot;
                </p>
                <p className="text-sm text-[#6B7280]">
                  {hasSearchResults ? `${searchResults.length} produk ditemukan` : "Produk tidak ditemukan"}
                </p>
              </div>
            )}
          </section>
        ) : (
          <section className="mt-12">
            <h3 className="text-2xl font-semibold text-[#111827]">Produk Populer</h3>
            <StoreProductList
              products={store.popularProducts}
              variant="scroll"
              outerClassName="mt-6 -mx-4 pb-4"
              innerClassName="px-4"
            />
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}