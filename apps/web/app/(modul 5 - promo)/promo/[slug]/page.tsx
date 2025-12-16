"use client"

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import Image from "next/image";
import { use } from "react";

const products = [
  {
    name: "Nivea Pembersih Wajah",
    priceBefore: "Rp 40.000",
    priceAfter: "Rp 24.000",
    discount: "40%",
    image: "/promo/products/nivea.jpg",
  },
  {
    name: "Cosrx Gel Pembersih Wajah",
    priceBefore: "Rp 60.000",
    priceAfter: "Rp 36.000",
    discount: "40%",
    image: "/promo/products/cosrx.png",
  },
  {
    name: "Kahf Pembersih Wajah",
    priceBefore: "Rp 45.000",
    priceAfter: "Rp 27.000",
    discount: "40%",
    image: "/promo/products/kahf.png",
  },
  {
    name: "L'OREAL Men Expert",
    priceBefore: "Rp 60.000",
    priceAfter: "Rp 39.000",
    discount: "40%",
    image: "/promo/products/loreal.png",
  },
  {
    name: "Nivea Pembersih Wajah",
    priceBefore: "Rp 40.000",
    priceAfter: "Rp 24.000",
    discount: "40%",
    image: "/promo/products/nivea.jpg",
  },
  {
    name: "Cosrx Gel Pembersih Wajah",
    priceBefore: "Rp 60.000",
    priceAfter: "Rp 36.000",
    discount: "40%",
    image: "/promo/products/cosrx.png",
  },
  {
    name: "Kahf Pembersih Wajah",
    priceBefore: "Rp 45.000",
    priceAfter: "Rp 27.000",
    discount: "40%",
    image: "/promo/products/kahf.png",
  },
  {
    name: "L'OREAL Men Expert",
    priceBefore: "Rp 60.000",
    priceAfter: "Rp 39.000",
    discount: "40%",
    image: "/promo/products/loreal.png",
  },
];

export default function PromoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-8 w-full overflow-hidden rounded-xl shadow-md">
          <Image
            src="/promo/bannerpromo.jpg"
            alt={slug}
            width={1200}
            height={400}
            className="w-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((item, i) => (
            <Card key={i} className="relative rounded-xl border p-4 shadow-sm">
              <span className="absolute top-3 right-3 rounded-md bg-green-700 px-2 py-1 text-xs text-white">
                {item.discount}
              </span>

              <div className="flex h-[160px] w-full items-center justify-center overflow-hidden">
                <Image
                  src={item.image}
                  width={120}
                  height={120}
                  alt={item.name}
                  className="object-contain"
                />
              </div>

              <div className="mt-2">
                <h2 className="line-clamp-2 text-sm font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-xs text-gray-400 line-through">
                  {item.priceBefore}
                </p>
                <p className="text-sm font-bold text-red-600">
                  {item.priceAfter}
                </p>
              </div>

              <Button className="mt-4 w-full bg-green-700 hover:bg-green-800">
                Tambah
              </Button>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
