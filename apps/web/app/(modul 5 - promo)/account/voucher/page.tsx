"use client";

import Link from "next/link";
import { VoucherItem } from "@/app/(modul 5 - promo)/account/voucher/VoucherItem";
import { usePathname } from "next/navigation";

const leftVoucherList = [
  {
    title: "Gratis Ongkir Min. 100RB",
    expiry: "30-12-2025",
    image: "/promo/Free.png",
  },
  {
    title: "Gratis Ongkir Min. 100RB",
    expiry: "30-12-2025",
    image: "/promo/Free.png",
  },
  {
    title: "Gratis Ongkir Min. 100RB",
    expiry: "30-12-2025",
    image: "/promo/Free.png",
  },
  {
    title: "Gratis Ongkir Min. 100RB",
    expiry: "30-12-2025",
    image: "/promo/Free.png",
  },
];

const rightVoucherList = [
  {
    title: "Diskon 10% Min. 100RB",
    expiry: "30-12-2025",
    image: "/promo/Keranjang.png",
  },
  {
    title: "Diskon 10% Min. 100RB",
    expiry: "30-12-2025",
    image: "/promo/Keranjang.png",
  },
  {
    title: "Diskon 10% Min. 100RB",
    expiry: "30-12-2025",
    image: "/promo/Keranjang.png",
  },
  {
    title: "Diskon 10% Min. 100RB",
    expiry: "30-12-2025",
    image: "/promo/Keranjang.png",
  },
];

export default function VoucherPage() {
  const path = usePathname();

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border-2 border-green-700 bg-white shadow-md">
      {/* TAB HEADER */}
      <div className="flex gap-2 border-b border-green-600 bg-[#E6F4EA] p-3">
        {/* Voucher Tab */}
        <Link
          href="/account/voucher"
          className={`rounded-lg border px-6 py-2 text-sm font-semibold transition-all ${path.includes("/account/voucher")
              ? "bg-white text-green-700"
              : "bg-green-700 text-white hover:bg-green-800"
            }`}
        >
          Voucher
        </Link>

        {/* Points Tab */}
        <Link
          href="/account/points"
          className={`rounded-lg border px-6 py-2 text-sm font-semibold transition-all ${path.includes("/account/points")
              ? "bg-white text-green-700"
              : "bg-green-700 text-white hover:bg-green-800"
            }`}
        >
          Tukar Poin
        </Link>
      </div>

      {/* CONTENT */}
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {leftVoucherList.map((item, index) => (
            <VoucherItem key={index} {...item} />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {rightVoucherList.map((item, index) => (
            <VoucherItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
