// app/checkout/page.tsx
"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { MapPin, PencilLine } from "lucide-react";

import PaymentMethodDialog from "@/components/PaymentMethodDialog";
import AddressDialog from "@/components/AddressDialog";
import VoucherDialog, { VoucherChoice } from "@/components/VoucherDialog";

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const items = [
  {
    id: "1",
    name: "Teh Pucuk – 350 ML",
    variant: "350 ML",
    price: 4000,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1604908176997-431c5f69f6a9?q=80&w=640&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Pop Mie – Baso",
    variant: "Baso",
    price: 6500,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1610440042657-612c9f47d409?q=80&w=640&auto=format&fit=crop",
  },
];

const shipping = 10000;
const adminFee = 1000;

export default function CheckoutPage() {
  const productTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const grandTotal = productTotal + shipping + adminFee;

  // ALAMAT
  const [address, setAddress] = React.useState({
    name: "Rumah – John Doe",
    address:
      "Jln. Setiabudhi No. 67K, Kec. Sukasari, Kota Bandung, Jawa Barat, 40636",
    phone: "0888888888",
  });

  // PAYMENT METHOD
  type MethodKey = "ewallet" | "va" | "qris";
  type PayChoice = { method?: MethodKey; option?: string };
  const [payChoice, setPayChoice] = React.useState<PayChoice>({});

  const labelMaps = {
    ewallet: {
      gopay: "Gopay",
      dana: "Dana",
      shopeepay: "Shopee Pay",
      ovo: "OVO",
    } as Record<string, string>,
    va: {
      bca: "BCA",
      bni: "BNI",
      permata: "Permata Bank",
      bri: "BRI",
    } as Record<string, string>,
  };

  const paymentLabel = (() => {
    if (!payChoice.method) return "Pilih Metode";
    if (payChoice.method === "qris") return "QRIS";

    if (payChoice.method === "ewallet") {
      const name = payChoice.option
        ? labelMaps.ewallet[payChoice.option]
        : "Pilih E-Wallet";
      return `E-Wallet — ${name}`;
    }

    const name = payChoice.option
      ? labelMaps.va[payChoice.option]
      : "Pilih Bank VA";
    return `Virtual Account — ${name}`;
  })();

  // VOUCHER
  const [voucher, setVoucher] = React.useState<VoucherChoice | null>(null);

  // HIDE SCROLLBAR
  React.useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      html::-webkit-scrollbar { display: none; }
      body::-webkit-scrollbar { display: none; }
      html { scrollbar-width: none; }
      body { scrollbar-width: none; }
    `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-200">
      {/* NAVBAR */}
      <div className="w-full border-b bg-emerald-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="rounded bg-white/10 px-2 py-1">PasJajan</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center">
              JD
            </div>
            <span>John Doe</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl p-4 md:p-6">
        <h1 className="text-xl font-semibold mb-4">Checkout</h1>

        <div className="grid gap-4 md:grid-cols-3">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">
            {/* ADDRESS */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Alamat Pengiriman</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 mt-1 text-emerald-700" />

                  <div>
                    <p className="font-medium">{address.name}</p>
                    <p className="text-sm text-slate-600 leading-snug">
                      {address.address}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {address.phone}
                    </p>
                  </div>
                </div>

                <AddressDialog
                  trigger={
                    <button className="px-3 py-2 rounded-md border text-sm">
                      <PencilLine className="h-4 w-4 inline mr-1" />
                      Ubah
                    </button>
                  }
                  onSelect={(data) =>
                    setAddress({
                      name: data.name,
                      address: data.address,
                      phone: data.phone,
                    })
                  }
                />
              </CardContent>
            </Card>

            {/* ITEMS */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pesanan</CardTitle>
              </CardHeader>

              <CardContent>
                <ScrollArea className="max-h-[360px] pr-3">
                  <div className="space-y-4">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-start gap-4 rounded-lg border p-3 bg-white"
                      >
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium leading-tight">
                                {it.name}
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="rounded-md"
                                >
                                  {it.variant}
                                </Badge>
                                <span className="text-sm text-slate-600">
                                  x{it.qty}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-slate-600">
                                {currency(it.price)}
                              </p>
                            </div>

                            <p className="text-sm font-medium">
                              {currency(it.price * it.qty)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

         {/* RIGHT — CARD YANG SAMA PERSIS DENGAN DESAIN */}
<Card className="bg-white shadow-none border border-[#E5E7EB] rounded-md p-4 space-y-6">

{/* METODE PEMBAYARAN */}
<div className="space-y-1">
  <div className="flex items-center justify-between">
    <p className="text-[14px] font-semibold text-[#0E9F6E]">
      Metode Pembayaran
    </p>

    <PaymentMethodDialog
      trigger={
        <button className="px-3 h-[30px] border border-[#C6D9D2] rounded-md bg-white text-[13px]">
          Pilih
        </button>
      }
      onConfirm={(sel) => setPayChoice(sel)}
    />
  </div>

  <p className="text-[13px] text-slate-500 leading-none">
    {payChoice.method ? paymentLabel : "-"}
  </p>
</div>

<div className="border-t border-[#D9D9D9]" />

{/* VOUCHER */}
<div className="space-y-1">
  <div className="flex items-center justify-between">
    <p className="text-[14px] font-semibold text-[#0E9F6E]">
      Voucher dan Promo
    </p>

    <VoucherDialog
      current={voucher}
      onApply={setVoucher}
      trigger={
        <button className="px-3 h-[30px] border border-[#C6D9D2] rounded-md bg-white text-[13px]">
          Pilih
        </button>
      }
    />
  </div>

  <p className="text-[13px] text-slate-500 leading-none">
    {voucher ? voucher.title : "-"}
  </p>
</div>

<div className="border-t border-[#D9D9D9]" />

{/* RINGKASAN */}
<div className="space-y-3">
  <p className="text-[14px] font-semibold text-[#0E9F6E]">
    Ringkasan transaksi
  </p>

  <div className="flex justify-between text-[13px]">
    <span>Total Harga Pesanan</span>
    <span>{currency(productTotal)}</span>
  </div>

  <div className="flex justify-between text-[13px]">
    <span>Biaya Pengiriman</span>
    <span>{currency(shipping)}</span>
  </div>

  <div className="flex justify-between text-[13px]">
    <span>Biaya Admin</span>
    <span>{currency(adminFee)}</span>
  </div>

  <div className="border-t border-[#D9D9D9]" />

  <div className="flex justify-between text-[14px] font-bold">
    <span>Total Pembayaran</span>
    <span>{currency(grandTotal)}</span>
  </div>

  <button className="w-full py-2 rounded-md bg-[#0E9F6E] text-white font-semibold text-[14px]">
    Bayar Sekarang
  </button>
</div>
</Card>

      </div>

        <footer className="mt-8 text-center text-xs text-slate-500">
          © 2025 PasJajan — All Right Reserved
        </footer>
      </main>
    </div>
  );
}
