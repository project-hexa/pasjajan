"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HeroBanner } from "./components/hero-banner";
import { TopRatedCarousel } from "./components/top-rated-carousel";
import SiteFooter from "../components/site-footer";



// Mock data - Replace with actual API calls
const promoBanners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1400&q=80",
    title: "Kini Hadir Nutren Junior 400g",
    link: "/promo/nutren",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
    title: "Sweet Treats Diskon 30%",
    link: "/promo/sweet-treats",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
    title: "Promo Cashback Oktober",
    link: "/promo/cashback",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1400&q=80",
    title: "Beli Hemat Bulanan",
    link: "/promo/beli-hemat",
  },
];

const topRatedRestaurants = [
  { id: 1, slug: "sushi-day-bandung", title: "Sushi Day - Bandung", image: "/images/Screenshot 2025-11-10 083417.png", offers: ["Diskon 25%", "Diskon Ongkir"] },
  { id: 2, slug: "burger-baik-cimahi", title: "Burger Baik - Cimahi", image: "/images/Screenshot 2025-11-10 083650.png", offers: ["Diskon 20%", "Diskon Ongkir"] },
  { id: 3, slug: "warkop-bandung", title: "Warkop - Bandung", image: "/images/Screenshot 2025-11-10 084035.png", offers: ["Diskon 15%", "Diskon Ongkir"] },
  { id: 4, slug: "jus-1l-gerlong", title: "Jus 1L - Gerlong", image: "/images/Screenshot 2025-11-10 084135.png", offers: ["Diskon 25%", "Diskon Ongkir"] },
  { id: 5, slug: "pizza-cuy-bandung", title: "Pizza Cuy - Bandung", image: "/images/Screenshot 2025-11-10 084728.png", offers: ["Diskon 25%", "Diskon Ongkir"] },
  { id: 6, slug: "roti-h-gerlong", title: "Roti H - Gerlong", image: "/images/Screenshot 2025-11-10 084920.png", offers: ["Diskon 30%", "Diskon Ongkir"] },
  { id: 7, slug: "ayam-bakar-mantap-bandung", title: "Ayam Bakar Mantap - Bandung", image: "/images/Screenshot 2025-11-10 085035.png", offers: ["Diskon 30%", "Diskon Ongkir"] },
  { id: 8, slug: "dimsum-suka-bandung", title: "Dimsum Suka - Bandung", image: "/images/Screenshot 2025-11-10 085143.png", offers: ["Diskon 20%", "Diskon Ongkir"] },
  { id: 9, slug: "toko-manis-bandung", title: "Toko Manis - Bandung", image: "/images/Screenshot 2025-11-10 085301.png", offers: ["Diskon 15%", "Diskon Ongkir"] },
];

const mockProducts = [
  { id: 1, name: "Beng - Beng", description: "Kemasan Extra", image: "/images/Screenshot 2025-10-25 174036.png", price: 18500 },
  { id: 2, name: "Kusuka Keripik", description: "Singkong", image: "/images/Screenshot 2025-10-25 174142.png", price: 9500 },
  { id: 3, name: "Happy Tos", description: "Keripik 140 g", image: "/images/Screenshot 2025-10-25 174230.png", price: 14500 },
  { id: 4, name: "Mie Sedap", description: "Goreng Selection", image: "/images/Screenshot 2025-10-25 174329.png", price: 3500 },
  { id: 5, name: "Lays", description: "Rasa Rumput laut", image: "/images/Screenshot 2025-10-25 174436.png", price: 9700 },
  { id: 6, name: "Garuda Atom", description: "Original Flavor", image: "/images/Screenshot 2025-10-25 175114.png", price: 6800 },
  { id: 7, name: "TicTac Snack", description: "Rasa Sapi", image: "/images/Screenshot 2025-10-25 175203.png", price: 8500 },
  { id: 8, name: "Yupie Permen", description: "Gummy 9 Rasa", image: "/images/Screenshot 2025-10-25 175227.png", price: 14500 },
];

const supportLinks = ["Tentang Kami", "Keamanan dan Privasi"];

const paymentMethods = [
  "BCA",
  "BNI",
  "BRI",
  "QRIS",
  "Mandiri",
  "Permata Bank",
  "Shopee Pay",
  "Gopay",
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/pasjajan",
    icon: "/img/ig.png",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/pasjajan",
    icon: "/img/facebook.svg",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@pasjajan",
    icon: "/img/tiktok.png",
  },
];

export default function CataloguePage() {
  const params = useSearchParams();
  const q = params?.get("search")?.trim() ?? "";

  const router = useRouter();
  const [searchValue, setSearchValue] = React.useState(q);

  const [isLoading, setIsLoading] = React.useState(false);

  // Categories data for dropdown
  const categories = [
    {
      title: "Rekomendasi",
      items: ["Sushi Day", "Burger Baik", "Jus 1L", "Ayam Gebrak"],
    },
    {
      title: "Top Laris",
      items: ["Mie Gaciakutan", "Kebab Biss", "Kopi Forest", "Pas Jajan"],
    },
    {
      title: "Resto Gratis Ongkir",
      items: ["Marbatak", "Mixul", "Ayam Bakar", "Es G Teler"],
    },
    {
      title: "Checkout Murah",
      items: ["Bakmie", "Tahu Gebrak", "Ayam UFC", "G Haus"],
    },
    {
      title: "Diskon Rame Rame",
      items: ["Domini", "Pizzz Hood", "Chees Cuiz", "Martabak London"],
    },
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
    if (!q) return [];
    const ql = q.toLowerCase();
    // simulate quick client-side search
    return topRatedRestaurants.filter((r) => r.title.toLowerCase().includes(ql));
  }, [q]);

  React.useEffect(() => {
    if (!q) { setIsLoading(false); return; }
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 300); // short simulated load
    return () => clearTimeout(t);
  }, [q]);
  const matchedFirst = matchedRestaurants.length > 0 ? matchedRestaurants[0] : null;
  const storeHref = matchedFirst ? `/store/${matchedFirst.slug}` : "#";

  React.useEffect(() => {
    setSearchValue(q);
  }, [q]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = (searchValue || "").trim();
    if (next) router.push(`/catalogue?search=${encodeURIComponent(next)}`);
    else router.push(`/catalogue`);
  };

  return (
    <main className="min-h-screen bg-white">
<header className="relative flex items-center bg-[#187247] px-8 py-3 text-white">
{/* --- BAGIAN KIRI --- */}
<div className="flex items-center gap-10 flex-1">
{/* Logo */}
<div className="flex flex-col items-center">
<img src="/img/logo2.png" alt="pasjajan" className="h-8" />
<span className="-mt-0.5 text-xs font-semibold">pasjajan</span>
</div>


{/* Tombol Kategori */}
<div
  ref={catButtonRef}
  className="relative"
  onMouseEnter={() => setIsCatOpen(true)}
>
  <button
    type="button"
    onClick={() => setIsCatOpen((s) => !s)}
    aria-expanded={isCatOpen}
    className="flex items-center gap-2 rounded-lg border border-white px-4 py-2 text-sm font-semibold transition-all hover:bg-white hover:text-[#0A6B3C]"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
    <span>Kategori</span>
  </button>
</div>


{/* Search Bar (form) */}
<form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-3xl items-center rounded-full bg-white pl-4 pr-1 py-1 shadow">
  <input
    type="search"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    placeholder="Cari produk yang anda inginkan"
    className="flex-grow bg-transparent text-base text-gray-800 placeholder-gray-500 outline-none px-4 py-2"
  />
  <button type="submit" aria-label="Cari" className="ml-2 mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#154C32] text-white">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
  </button>
</form>


{/* Promo */}
<a href="#" className="flex items-center gap-15 font-semibold text-white ml-6">
<span>Promo</span>
<img src="/img/icon-promo.png" alt="Promo" className="h-5" />
</a>
</div>


{/* --- BAGIAN KANAN --- */}
<nav className="ml-10 flex items-center gap-6 text-base">
<div className="h-6 w-[2px] bg-white/50"></div>
<a href="#" className="font-semibold text-white">Daftar</a>
<a href="#" className="font-semibold text-white">Masuk</a>
</nav>

<div
  ref={catOverlayRef}
  onMouseEnter={() => setIsCatOpen(true)}
  onMouseLeave={() => setIsCatOpen(false)}
  className={`absolute left-0 right-0 top-full z-40 px-8 transition-all duration-200 ${
    isCatOpen ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
  }`}
>
  <div className="border-t border-white/10 bg-[#187247]/95 text-white backdrop-blur-sm">
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 py-8 sm:grid-cols-5">
      {categories.map((col) => (
        <div key={col.title} className="space-y-3">
          <h4 className="text-sm font-semibold">{col.title}</h4>
          <ul className="space-y-2 text-sm">
            {col.items.map((it) => (
              <li key={it}>
                <Link
                  href={`/catalogue?search=${encodeURIComponent(it)}`}
                  prefetch={false}
                  onClick={() => setIsCatOpen(false)}
                  className="block rounded px-2 py-1 transition-colors hover:bg-white/10"
                >
                  {it}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</div>
</header>

        <div className="flex w-full flex-col gap-10 px-4 pb-16 pt-8 sm:px-8 lg:px-12 xl:px-16">
          <HeroBanner banners={promoBanners} itemsPerSlide={3} hideOnSearch={!!q} />

          {q ? (
            <section className="w-full">
            <h3 className="mb-1 text-lg font-semibold text-[#111827]">Hasil Pencarian untuk "{q.toUpperCase()}"...</h3>
            <p className="mb-6 text-sm text-[#6B7280]">Menampilkan {matchedRestaurants.length} Resto</p>

            {isLoading && (
              <div className="mb-4 text-sm text-[#6B7280]">Memuat hasil...</div>
            )}

            {matchedRestaurants.length > 0 ? (
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12">
                <div className="md:col-span-3">
                  <Link
                    href={storeHref}
                    prefetch={false}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A6B3C]"
                  >
                    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <div className="flex items-center gap-4">
                        {matchedFirst?.image ? (
                          <Image
                            src={matchedFirst.image}
                            alt={matchedFirst.title ?? "store"}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-black text-white">PJ</div>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold leading-tight text-[#111827]">{matchedFirst?.title}</h4>
                          <p className="text-sm text-[#6B7280]">Snack</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#6B7280]">
                            <span>★ 4.8 (1.4RB)</span>
                            <span>· 1km · 15min</span>
                          </div>
                          <div className="mt-3 flex gap-2 text-sm text-[#009F4D]">
                            <span>Diskon 25%</span>
                            <span>Diskon Ongkir</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex w-full gap-4 overflow-x-auto pb-2">
                          {mockProducts.slice(0, 4).map((p) => (
                            <div key={p.id} className="min-w-[128px] rounded-2xl border border-[#E5E7EB] bg-white/90 p-3 shadow-sm">
                              <img src={p.image} alt={p.name} className="h-24 w-full rounded-xl object-cover" />
                              <h5 className="mt-3 text-sm font-semibold text-[#111827]">{p.name}</h5>
                              <p className="text-xs text-[#6B7280]">{p.description}</p>
                              <p className="mt-2 text-sm font-bold text-[#DC2626]">Rp. {p.price.toLocaleString('id-ID')}</p>
                            </div>
                          ))}
                        </div>
                        <span className="mt-4 inline-block text-sm font-medium text-[#6B7280] transition-colors group-hover:text-[#0A6B3C]">
                          Lihat 120 gerai &gt;
                        </span>
                      </div>
                    </article>
                  </Link>
                </div>

                <div className="md:col-span-9">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">{matchedFirst?.title}</h4>
                      <a className="text-sm text-[#6B7280]">Lihat semua</a>
                    </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {mockProducts.map((p) => (
                      <div key={p.id} className="min-w-40">
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                          <img src={p.image} alt={p.name} className="h-28 w-full object-cover rounded" />
                          <h5 className="mt-2 text-sm font-medium">{p.name}</h5>
                          <p className="text-sm text-[#6B7280]">{p.description}</p>
                          <p className="mt-2 font-bold text-red-600">Rp. {p.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
      <SiteFooter />
    </main>
  );
}
