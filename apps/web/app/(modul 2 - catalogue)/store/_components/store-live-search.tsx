"use client";

import * as React from "react";
import StoreProductList, { StoreProduct } from "./store-product-list";

interface Props {
  initialProducts: StoreProduct[];
}

export default function StoreLiveSearch({ initialProducts }: Props) {
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(Boolean(query));
    const t = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialProducts;
    return initialProducts.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q));
  }, [initialProducts, query]);

  return (
    <section className="mt-8">
      <div className="flex items-center gap-4">
        <input
          type="search"
          aria-label="Cari produk di toko"
          placeholder="Cari produk di toko ini"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2"
        />
        <div className="min-w-[120px] text-sm text-gray-600">{isLoading ? "Mencari..." : `${filtered.length} produk`}</div>
      </div>

      <div className="mt-4">
        <StoreProductList products={filtered} variant={filtered.length > 6 ? "scroll" : "grid"} outerClassName="mt-4" />
      </div>
    </section>
  );
}