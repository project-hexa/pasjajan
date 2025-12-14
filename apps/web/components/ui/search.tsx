"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { useSearchStore } from "@/stores/useSearchStore";

export const Search = () => {
  const params = useSearchParams();
  const q = params?.get("search")?.trim() ?? "";

  const router = useRouter();
  const pathname = usePathname();
  const { search, setSearch } = useSearchStore();

  // Initialize store from URL when component mounts or query param changes
  React.useEffect(() => {
    if (q && q !== search) setSearch(q);
    // only when q changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Debounced URL update for pages that support search
  React.useEffect(() => {
    const val = (search || "").trim();
    const isStorePage = pathname?.startsWith("/store/");
    const isCatalogue = pathname === "/catalogue" || pathname?.startsWith("/catalogue");
    if (!isStorePage && !isCatalogue) return;

    const id = setTimeout(() => {
      const targetBase = isStorePage && pathname ? pathname : "/catalogue";
      const target = val ? `${targetBase}?search=${encodeURIComponent(val)}` : targetBase;
      router.replace(target);
    }, 400);

    return () => clearTimeout(id);
  }, [search, pathname, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = (search || "").trim();
    const isStorePage = pathname?.startsWith("/store/");
    const targetBase = isStorePage && pathname ? pathname : "/catalogue";
    const target = next ? `${targetBase}?search=${encodeURIComponent(next)}` : targetBase;
    router.push(target);
  };

  return (
    <div className="flex w-full">
      <form onSubmit={handleSearchSubmit} className="w-full">
        <ButtonGroup className="w-full [&>*:not(:first-child)]:-ml-5 [&>*:not(:first-child)]:rounded-bl-full">
          <Input
            placeholder="Cari produk atau toko"
            className="bg-card w-full rounded-full placeholder:max-sm:text-xs"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            aria-label="Cari produk atau toko"
            type="search"
          />
          <Button type="submit" className="rounded-full border-t border-r border-b">
            <Icon icon="lucide:search" className="size-4" />
          </Button>
        </ButtonGroup>
      </form>
    </div>
  );
};
