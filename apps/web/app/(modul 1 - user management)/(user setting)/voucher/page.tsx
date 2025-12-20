"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";

// VoucherItem Component
interface VoucherProps {
  title: string;
  expiry: string;
  image: string;
}

function VoucherItem({ title, expiry, image }: VoucherProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Image src={image} alt="Voucher" width={50} height={50} />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-gray-500">S/D: {expiry}</p>
        </div>
      </div>

      <Button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
        Pakai
      </Button>
    </div>
  );
}

// RedeemItem Component for Tukar Point
interface RedeemProps {
  title: string;
  points: number;
  image: string;
}

function RedeemItem({ title, points, image }: RedeemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Image src={image} alt="Reward" width={50} height={50} />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <Badge variant="outline" className="border-primary text-primary mt-1 text-xs">
            {points} Poin
          </Badge>
        </div>
      </div>

      <Button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
        Tukar
      </Button>
    </div>
  );
}

// Sample Data
const voucherList = [
  { title: "Gratis Ongkir Min. 100RB", expiry: "30-12-2025", image: "/promo/Free.png" },
  { title: "Gratis Ongkir Min. 100RB", expiry: "30-12-2025", image: "/promo/Free.png" },
  { title: "Diskon 10% Min. 100RB", expiry: "30-12-2025", image: "/promo/Keranjang.png" },
  { title: "Diskon 10% Min. 100RB", expiry: "30-12-2025", image: "/promo/Keranjang.png" },
];

const redeemList = [
  { title: "Voucher Gratis Ongkir", points: 500, image: "/promo/Free.png" },
  { title: "Voucher Diskon 10%", points: 750, image: "/promo/Keranjang.png" },
  { title: "Voucher Diskon 20%", points: 1500, image: "/promo/Keranjang.png" },
  { title: "Voucher Gratis Ongkir x3", points: 1200, image: "/promo/Free.png" },
];

export default function VoucherPage() {
  const [activeTab, setActiveTab] = useState<"voucher" | "tukar">("voucher");

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-green-700 bg-white shadow-md">
      {/* TAB HEADER */}
      <div className="flex gap-2 border-b border-green-600 bg-[#E6F4EA] p-3">
        <button
          onClick={() => setActiveTab("voucher")}
          className={`rounded-lg border px-6 py-2 text-sm font-semibold transition-all ${activeTab === "voucher"
              ? "bg-green-700 text-white"
              : "bg-white text-green-700 hover:bg-gray-100"
            }`}
        >
          Voucher
        </button>

        <button
          onClick={() => setActiveTab("tukar")}
          className={`rounded-lg border px-6 py-2 text-sm font-semibold transition-all ${activeTab === "tukar"
              ? "bg-green-700 text-white"
              : "bg-white text-green-700 hover:bg-gray-100"
            }`}
        >
          Tukar Poin
        </button>

        {/* Points Badge */}
        <div className="ml-auto flex items-center gap-2">
          <Badge className="bg-card rounded-md text-sm text-black shadow-md border">
            <Image
              src="/img/icon-poin.png"
              alt="icon poin"
              width={20}
              height={20}
              className="mr-1"
            />
            4.000 Poin
          </Badge>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {activeTab === "voucher" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {voucherList.map((item, index) => (
              <VoucherItem key={index} {...item} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {redeemList.map((item, index) => (
              <RedeemItem key={index} {...item} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === "voucher" && voucherList.length === 0) ||
          (activeTab === "tukar" && redeemList.length === 0)) && (
            <div className="py-10 text-center text-gray-500">
              {activeTab === "voucher"
                ? "Belum ada voucher tersedia"
                : "Belum ada reward untuk ditukar"}
            </div>
          )}
      </div>
    </div>
  );
}
