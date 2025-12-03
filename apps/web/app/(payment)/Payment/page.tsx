"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Badge } from "@workspace/ui/components/badge";
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

// ====== DUMMY ITEMS (ganti dengan API) ======
const items = [
  {
    id: "1",
    name: "Chitato Rasa Sapi Panggang 68g",
    variant: "1 pcs",
    price: 12500,
    qty: 1,
    image_url:
      "https://images.unsplash.com/photo-1604908176997-431c5f69f6a9?q=80&w=640&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Oreo Original 137g",
    variant: "1 pcs",
    price: 15000,
    qty: 1,
    image_url:
      "https://images.unsplash.com/photo-1610440042657-612c9f47d409?q=80&w=640&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Teh Pucuk Harum 350ml",
    variant: "1 pcs",
    price: 6000,
    qty: 1,
    image_url:
      "https://images.unsplash.com/photo-1570197769439-532a1bfe3a5a?q=80&w=640&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Indomie Goreng Original",
    variant: "1 pcs",
    price: 3500,
    qty: 1,
    image_url:
      "https://images.unsplash.com/photo-1604908176997-431c5f69f6a9?q=80&w=640&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Aqua Botol 600ml",
    variant: "1 pcs",
    price: 5000,
    qty: 1,
    image_url:
      "https://images.unsplash.com/photo-1610440042657-612c9f47d409?q=80&w=640&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "SilverQueen Chunky Bar 100g",
    variant: "1 pcs",
    price: 25000,
    qty: 1,
    image_url:
      "https://images.unsplash.com/photo-1613666817995-a7c79e92724d?q=80&w=640&auto=format&fit=crop",
  },
];

export default function CheckoutPage() {
  const productTotal =
    items.reduce((s, i) => s + i.price * (i.qty ?? 1), 0) || 0;

  const shipping = 10000;
  const adminFee = 1000;
  const grandTotal = productTotal + shipping + adminFee;

  // ALAMAT
  const [address, setAddress] = React.useState({
    name: "Rumah – John Doe",
    address:
      "Jln. Setiabudhi No. 67K, Kec. Sukasari, Kota Bandung, Jawa Barat, 40636",
    phone: "0888888888",
  });

  // PAYMENT
  const [payChoice, setPayChoice] = React.useState<{
    method?: string;
    option?: string;
  }>({});

  const paymentLabel = payChoice.method
    ? `${payChoice.method.toUpperCase()} ${payChoice.option ?? ""}`
    : "-";

  // VOUCHER
  const [voucher, setVoucher] = React.useState<VoucherChoice | null>(null);

  // REMOVE GLOBAL SCROLLBAR
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

        {/* ========== LEVEL 1: layout vertical ========== */}
        <div className="space-y-4">

          {/* ========== ALAMAT FULL WIDTH ========== */}
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

          {/* ========== LEVEL 2: kiri & kanan ========== */}
          <div className="flex flex-col md:flex-row md:items-start gap-4">

            {/* ==================== KIRI: PESANAN ==================== */}
            <div className="flex-1">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Pesanan</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 border border-[#E5E7EB] rounded-xl bg-white p-4 shadow-sm"
                      >
                        <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center">
                          <img
                            src={it.image_url}
                            alt={it.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-[14px] leading-tight">
                            {it.name}
                          </p>

                          <div className="flex items-center gap-3 mt-1">
                            <span className="px-2 py-[1px] text-[11px] rounded-md bg-emerald-100 text-emerald-700 font-medium">
                              {it.qty} pcs
                            </span>
                            <span className="text-[12px] text-slate-500">
                              {currency(it.price)}
                            </span>
                          </div>
                        </div>

                        <p className="text-[14px] font-semibold text-slate-900">
                          {currency(it.price * it.qty)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ==================== KANAN ==================== */}
            <div className="w-full md:w-[330px] space-y-4">

              {/* Metode Pembayaran */}
              <Card className="bg-white shadow-none border border-[#E5E7EB] rounded-md p-4 space-y-3">
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

                <p className="text-[13px] text-slate-600">
                  {payChoice.method ? paymentLabel : "-"}
                </p>
              </Card>

              {/* Voucher */}
              <Card className="bg-white shadow-none border border-[#E5E7EB] rounded-md p-4 space-y-3">
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

                <p className="text-[13px] text-slate-600">
                  {voucher ? voucher.title : "-"}
                </p>
              </Card>

              {/* Ringkasan */}
              <Card className="bg-white shadow-none border border-[#E5E7EB] rounded-md p-4 space-y-3">
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

                <div className="border-t border-gray-300 my-1" />

                <div className="flex justify-between text-[14px] font-bold">
                  <span>Total Pembayaran</span>
                  <span>{currency(grandTotal)}</span>
                </div>

                <button className="w-full py-2 rounded-md bg-[#0E9F6E] text-white font-semibold text-[14px]">
                  Bayar Sekarang
                </button>
              </Card>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-500">
          © 2025 PasJajan — All Right Reserved
        </footer>
      </main>
    </div>
  );
}
