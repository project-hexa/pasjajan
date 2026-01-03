"use client";

import { AspectRatio } from "@workspace/ui/components/aspect-ratio";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@workspace/ui/components/item";
import Image from "next/image";
import { DetailProductTrigger } from "./detail-product-modal";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  unit: string;
};

const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Air Mineral",
    description:
      "Segar dalam kemasan botol 2 liter, cocok untuk kebutuhan harian.",
    price: 38500,
    image: "https://placehold.co/300x200/png?text=Produk-1",
    unit: "botol 2L",
  },
  {
    id: 2,
    name: "Teh Botol",
    description:
      "Teh manis siap minum dalam botol 1 liter, menyegarkan kapan saja.",
    price: 25000,
    image: "https://placehold.co/300x200/png?text=Produk-2",
    unit: "botol 1L",
  },
  {
    id: 3,
    name: "Kopi Instan",
    description:
      "Praktis dengan rasa nikmat, cocok untuk menemani aktivitas Anda.",
    price: 15000,
    image: "https://placehold.co/300x200/png?text=Produk-3",
    unit: "sachet",
  },
  {
    id: 4,
    name: "Susu UHT",
    description: "Segar dalam kemasan kotak, sumber kalsium untuk keluarga.",
    price: 18000,
    image: "https://placehold.co/300x200/png?text=Produk-4",
    unit: "kotak 1L",
  },
  {
    id: 5,
    name: "Roti Tawar",
    description: "Lembut dan enak, cocok untuk sarapan atau camilan.",
    price: 22000,
    image: "https://placehold.co/300x200/png?text=Produk-5",
    unit: "bungkus",
  },
  {
    id: 6,
    name: "Mie Instan",
    description: "Lezat dengan bumbu khas, mudah dan cepat disajikan.",
    price: 12000,
    image: "https://placehold.co/300x200/png?text=Produk-6",
    unit: "pak",
  },
  {
    id: 7,
    name: "Coklat Batang",
    description: "Premium dengan rasa manis dan tekstur lembut.",
    price: 17000,
    image: "https://placehold.co/300x200/png?text=Produk-7",
    unit: "batang",
  },
  {
    id: 8,
    name: "Keripik Kentang",
    description: "Renyah dengan rasa gurih, cocok untuk camilan.",
    price: 25000,
    image: "https://placehold.co/300x200/png?text=Produk-8",
    unit: "pak",
  },
  {
    id: 9,
    name: "Soda",
    description: "Segar dalam kemasan kaleng, pas untuk menemani waktu santai.",
    price: 9000,
    image: "https://placehold.co/300x200/png?text=Produk-9",
    unit: "kaleng",
  },
  {
    id: 10,
    name: "Biskuit Coklat",
    description: "Renyah dengan rasa manis, cocok untuk teman minum teh.",
    price: 20000,
    image: "https://placehold.co/300x200/png?text=Produk-10",
    unit: "pak",
  },
];

export const ProductPopulerSection = () => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-black">Produk Populer</h2>

      <div className="grid grid-cols-8 gap-4 pl-5">
        {dummyProducts.map((product) => (
          <DetailProductTrigger key={product.id} product={product}>
            <Card className="overflow-hidden p-0">
              <CardContent className="p-0">
                <Item className="p-0">
                  <ItemHeader>
                    <AspectRatio
                      ratio={16 / 9}
                      className="flex items-center justify-center"
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          priority
                        />
                      </div>
                    </AspectRatio>
                  </ItemHeader>
                  <ItemContent className="gap-5 px-4 pb-4">
                    <div className="flex flex-col">
                      <ItemTitle className="line-clamp-1 text-sm">
                        {product.name}
                      </ItemTitle>
                      <ItemDescription className="line-clamp-1 text-xs">
                        {product.unit}
                      </ItemDescription>
                    </div>

                    <ItemFooter className="flex flex-col items-start">
                      <span className="text-destructive text-md">
                        Rp. {product.price.toLocaleString("id-ID")}
                      </span>
                      <Button
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Tambah
                      </Button>
                    </ItemFooter>
                  </ItemContent>
                </Item>
              </CardContent>
            </Card>
          </DetailProductTrigger>
        ))}
      </div>
    </div>
  );
};
