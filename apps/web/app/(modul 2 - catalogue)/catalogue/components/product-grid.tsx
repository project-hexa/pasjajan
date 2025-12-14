"use client";

import * as React from "react";
import { ProductCard } from "@workspace/ui/components/product-card";

interface Product {
  id: string | number;
  name: string;
  description?: string;
  image: string;
  price: number;
  category?: string;
  stock?: number;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  onAddToCart?: (product: Product) => void;
}

export function ProductGrid({ products, title, onAddToCart }: ProductGridProps) {
  return (
    <section className="w-full py-8 px-4">
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            name={product.name}
            description={product.description}
            price={product.price}
            onAddToCart={() => onAddToCart?.(product)}
          />
        ))}
      </div>
    </section>
  );
}
