"use client"

import React, { Suspense } from "react";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { Card } from "@workspace/ui/components/card";
import Image from "next/image";
import Link from "next/link";

const promos = [
  {
    title: "Wajah Bersih Maksimal",
    date: "1 – 30 November 2025",
    image: "/promo/promo1.jpg",
  },
  {
    title: "Snack Paradise",
    date: "1 – 30 November 2025",
    image: "/promo/promo2.png",
  },
  {
    title: "Warehouse Sale",
    date: "1 – 30 November 2025",
    image: "/promo/promo3.png",
  },
  {
    title: "UHT Milk Fair",
    date: "1 – 30 November 2025",
    image: "/promo/promo4.png",
  },
  {
    title: "Perlindungan Keluarga Bebas Kuman",
    date: "1 – 30 November 2025",
    image: "/promo/promo5.jpg",
  },
  {
    title: "Strong & Shiny Hair",
    date: "1 – 30 November 2025",
    image: "/promo/promo6.jpg",
  },
  {
    title: "Hangat & Terlindungi Sepanjang Hari",
    date: "1 – 7 November 2025",
    image: "/promo/promo7.jpg",
  },
  {
    title: "Krimer Kental Manis",
    date: "1 – 30 November 2025",
    image: "/promo/promo8.jpg",
  },
  {
    title: "Warna Baru Gaya Baru",
    date: "1 – 30 November 2025",
    image: "/promo/promo9.jpg",
  },
  {
    title: "Lebih Terang, Lebih Baik",
    date: "1 – 30 November 2025",
    image: "/promo/promo10.jpg",
  },
  {
    title: "Ngopi Nikmat!",
    date: "1 – 30 November 2025",
    image: "/promo/promo11.jpg",
  },
  {
    title: "Find Your Perfect Shade",
    date: "1 – 30 November 2025",
    image: "/promo/promo12.jpg",
  },
];

const toSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function PromoPage() {
  
  return (
    <>
      <Suspense fallback={<div />}> 
        <Navbar />
      </Suspense>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-semibold text-gray-800">
          Semua Promo
        </h1>

        <div className="grid cursor-pointer grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo, index) => (
            <Link
              key={toSlug(promo.title)}
              href={`/promo/${promo.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Card
                key={index}
                className="overflow-hidden rounded-xl border bg-white p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="group relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 pt-3">
                  <h2 className="font-bold text-gray-800">{promo.title}</h2>
                  <p className="text-sm text-gray-500">{promo.date}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
