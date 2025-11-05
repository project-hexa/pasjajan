// app/checkout/page.tsx
// Next.js App Router + TypeScript + TailwindCSS + shadcn/ui
// Tampilan sesuai mockup gambar (navbar hijau, ringkasan kanan, daftar item kiri)

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@workspace/ui/components/select";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { MapPin, PencilLine, Smartphone, Wallet, CreditCard } from "lucide-react";


// ---- helpers ----
const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// ---- mock data ----
const items = [
  {
    id: "1",
    name: "Teh Pucuk – 350 ML",
    variant: "350 ML",
    price: 4000,
    qty: 2,
    image: "https://images.unsplash.com/photo-1604908176997-431c5f69f6a9?q=80&w=640&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Pop Mie – Baso",
    variant: "Baso",
    price: 6500,
    qty: 2,
    image: "https://images.unsplash.com/photo-1610440042657-612c9f47d409?q=80&w=640&auto=format&fit=crop",
  },
];

const shipping = 10000;
const adminFee = 1000;

export default function CheckoutPage() {
  const productTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const grandTotal = productTotal + shipping + adminFee;

  return (
    <div className="min-h-screen bg-slate-200">

      {/* Navbar brand hijau */}
      <div className="w-full border-b bg-emerald-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="rounded bg-white/10 px-2 py-1">PasJajan</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center">JD</div>
            <span>John Doe</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl p-4 md:p-6">
        <h1 className="text-xl font-semibold mb-4">Checkout</h1>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Left area */}
          <div className="md:col-span-2 space-y-4">
            {/* Address */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Alamat Pengiriman</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-medium">Rumah – John Doe</p>
                    <p className="text-sm text-slate-600">
                      Jln. Setiabudhi No. 67K, Kec. Sukasari, Kota Bandung,
                      Jawa Barat, 40636
                    </p>
                    <p className="text-sm text-slate-600">0888888888</p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2 self-start">
                  <PencilLine className="h-4 w-4" /> Ubah
                </Button>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="max-h-[360px] pr-3">
                  <div className="space-y-4">
                    {items.map((it) => (
                      <div key={it.id} className="flex items-start gap-4 rounded-lg border p-3">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium leading-tight">{it.name}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge variant="secondary" className="rounded-md">{it.variant}</Badge>
                                <span className="text-sm text-slate-600">x{it.qty}</span>
                              </div>
                              <p className="mt-1 text-sm text-slate-600">{currency(it.price)}</p>
                            </div>
                            <div className="text-sm font-medium">Total 1 Produk {currency(it.price * it.qty)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Payment method */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="method" className="text-sm">Pilih Metode</Label>
                <Select defaultValue="qris">
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Pilih metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qris"><div className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> QRIS</div></SelectItem>
                    <SelectItem value="ewallet"><div className="flex items-center gap-2"><Wallet className="h-4 w-4" /> E‑Wallet</div></SelectItem>
                    <SelectItem value="card"><div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Kartu Kredit/Debit</div></SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Voucher */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Voucher dan Promo</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input placeholder="Masukkan kode voucher" />
                <Button variant="outline">Pilih</Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ringkasan transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span>Total Harga Pesanan</span><span>{currency(productTotal)}</span></div>
                  <div className="flex items-center justify-between"><span>Biaya Pengiriman</span><span>{currency(shipping)}</span></div>
                  <div className="flex items-center justify-between"><span>Biaya Admin</span><span>{currency(adminFee)}</span></div>
                  <Separator />
                  <div className="flex items-center justify-between font-semibold"><span>Total Pembayaran</span><span>{currency(grandTotal)}</span></div>
                </div>

                <Button className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800">
                  Bayar Sekarang
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-500">
          © 2025 PasJajan — All Right Reserved
        </footer>
      </main>
    </div>
  );
}
