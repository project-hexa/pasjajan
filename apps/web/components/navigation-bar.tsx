"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

export const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/catalogue?search=${encodeURIComponent(q)}`);
    else router.push(`/catalogue`);
  };

  return (
    <header className="w-full bg-[#1B6B2F] text-white sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto flex flex-wrap items-center gap-4 px-4 py-3 text-sm md:flex-nowrap">
        <Link href="/" className="flex items-center text-white transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center overflow-visible">
            <Image
              src="/images/pasjajan2.png"
              alt="PasJajan"
              width={40}
              height={40}
              className="rounded-lg object-contain"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>

        <div className="flex flex-1 flex-wrap items-center gap-3 md:flex-nowrap">
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-white hover:bg-white/20"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Kategori</span>
          </Button>

          <form onSubmit={onSubmit} className="relative flex min-w-[220px] flex-1 items-center">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1B6B2F]" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
              placeholder="Cari produk yang anda inginkan di sini"
              className="h-11 w-full rounded-full border-0 bg-white pl-12 pr-24 text-sm text-foreground shadow-sm"
              aria-label="Cari produk"
            />
            {/* Clear button - visible when there's input */}
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); router.push('/catalogue'); }}
                aria-label="Bersihkan pencarian"
                className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 text-[#1B6B2F] hover:bg-white"
              >
                ✕
              </button>
            )}
            <Button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#1B6B2F] px-4 text-white hover:bg-[#155229]"
              aria-label="Cari"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-3 whitespace-nowrap">
          <Link
            href="/promo"
            className="font-medium transition-colors hover:text-yellow-200"
          >
            Promo
          </Link>
          <div className="hidden h-6 w-px bg-white/40 sm:block" aria-hidden />
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
            aria-label="Keranjang"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <div className="hidden h-6 w-px bg-white/40 sm:block" aria-hidden />
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="rounded-full border border-white/40 px-5 text-white hover:bg-white/15"
            >
              <Link href="/register">Daftar</Link>
            </Button>
            <Button asChild className="rounded-full bg-white px-5 text-[#1B6B2F] hover:bg-white/90">
              <Link href="/login">Masuk</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};
