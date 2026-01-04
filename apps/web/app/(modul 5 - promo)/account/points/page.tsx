"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RewardItem from "./RewardItem";

const pointBalance = 4000;

const freeOngkir = [
  {
    id: 1,
    title: "Gratis Ongkir Minimal Belanja 100RB",
    points: 500,
    image: `/img/promo/freeongkir.png`,
    category: "free-ongkir",
  },
  {
    id: 2,
    title: "Gratis Ongkir Minimal Belanja 100RB",
    points: 500,
    image: `/img/promo/freeongkir.png`,
    category: "free-ongkir",
  },
  {
    id: 3,
    title: "Gratis Ongkir Minimal Belanja 100RB",
    points: 500,
    image: `/img/promo/freeongkir.png`,
    category: "free-ongkir",
  },
  {
    id: 7,
    title: "Gratis Ongkir Minimal Belanja 100RB",
    points: 500,
    image: `/img/promo/freeongkir.png`,
    category: "free-ongkir",
  },
  {
    id: 9,
    title: "Gratis Ongkir Minimal Belanja 100RB",
    points: 500,
    image: `/img/promo/freeongkir.png`,
    category: "free-ongkir",
  },
];

const diskonVoucher = [
  {
    id: 4,
    title: "Diskon 10% Min. Belanja 100RB",
    points: 1000,
    image: `/img/promo/Keranjang2.png`,
    category: "diskon",
  },
  {
    id: 5,
    title: "Diskon 10% Min. Belanja 100RB",
    points: 1000,
    image: `/img/promo/Keranjang2.png`,
    category: "diskon",
  },
  {
    id: 6,
    title: "Diskon 10% Min. Belanja 100RB",
    points: 1000,
    image: `/img/promo/Keranjang2.png`,
    category: "diskon",
  },
  {
    id: 8,
    title: "Diskon 10% Min. Belanja 100RB",
    points: 1000,
    image: `/img/promo/Keranjang2.png`,
    category: "diskon",
  },
];

const rewardList = [...freeOngkir, ...diskonVoucher];

export default function PointsPage() {
  const path = usePathname();

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border-2 border-green-700 bg-white shadow-md">
      {/* ===== TAB HEADER ===== */}
      <div className="flex gap-2 border-b border-green-700 bg-[#E6F4EA] p-3">
        <Link
          href="/account/voucher"
          className={`rounded-xl border px-6 py-2 text-sm font-semibold transition-all ${
            path.includes("/account/voucher")
              ? "border-green-700 bg-white text-green-700"
              : "border-green-700 bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          Voucher
        </Link>

        <Link
          href="/account/points"
          className={`rounded-xl border px-6 py-2 text-sm font-semibold transition-all ${
            path.includes("/account/points")
              ? "border-green-700 bg-white text-green-700"
              : "border-green-700 bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          Tukar Poin
        </Link>
      </div>

      {/* ===== POINT BALANCE BOX ===== */}
      <div className="relative px-6">
        <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-2 shadow">
          <Image
            src={`/img/promo/points.png`}
            alt="Coin"
            width={35}
            height={35}
          />
          <span className="text-xl font-bold text-green-900">
            {pointBalance.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* ===== PAGE TITLE ===== */}
      <h2 className="px-6 pt-4 text-xl font-bold text-green-900">Tukar Poin</h2>

      {/* ===== GRID LIST ===== */}
      <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {rewardList
          .sort((a, b) => a.id - b.id)
          .map((item) => (
            <RewardItem
              key={item.id}
              title={item.title}
              points={item.points}
              image={item.image}
              imageClassName={item.category === "diskon" ? "bg-secondary" : "bg-destructive"}
            />
          ))}
      </div>
    </div>
  );
}
