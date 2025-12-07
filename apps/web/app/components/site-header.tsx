"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

export default function SiteHeader() {
  const params = useSearchParams();
  const q = params?.get("search")?.trim() ?? "";

  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = React.useState(q);

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

  React.useEffect(() => {
    setSearchValue(q);
  }, [q]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = (searchValue || "").trim();
    const isStorePage = pathname?.startsWith("/store/");
    const targetBase = isStorePage && pathname ? pathname : "/catalogue";
    const target = next ? `${targetBase}?search=${encodeURIComponent(next)}` : targetBase;
    router.push(target);
  };

  return (
    <header className="relative flex items-center bg-[#187247] px-8 py-3 text-white">
      <div className="flex items-center gap-10 flex-1">
          <Link href="/catalogue" prefetch={false} className="flex flex-col items-center" aria-label="Kembali ke Catalogue">
            <Image src="/img/logo2.png" alt="pasjajan" className="h-8" width={32} height={32} />
            <span className="-mt-0.5 text-xs font-semibold">pasjajan</span>
          </Link>

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

        <div className="flex items-center gap-5">
          <Link
            href="/cart"
            prefetch={false}
            aria-label="Buka keranjang belanja"
            className="flex items-center gap-15 font-semibold text-white ml-6"
          >
            <span>Promo</span>
            <Image src="/img/icon-promo.png" alt="Keranjang" className="h-5" width={20} height={20} />
          </Link>
        </div>
      </div>

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
  );
}
