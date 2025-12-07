"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

const initialCart: CartItem[] = [
  {
    id: "teh-kotak",
    name: "Teh Kotak - 300 ML",
    variant: "300 ML",
    price: 9000,
    quantity: 1,
    image: "/images/Screenshot 2025-10-25 175403.png",
  },
  {
    id: "yupie-strawberry",
    name: "Yupie Strawberry",
    variant: "Gummy 57 g",
    price: 18000,
    quantity: 2,
    image: "/images/Screenshot 2025-10-25 175227.png",
  },
  {
    id: "chitato-barbeque",
    name: "Chitato - Barbeque",
    variant: "Snack 68 g",
    price: 20000,
    quantity: 2,
    image: "/images/Screenshot 2025-10-25 175518.png",
  },
];

const SHIPPING_COST = 9000;
const ADMIN_FEE = 1000;

const formatPrice = (value: number) => `Rp. ${value.toLocaleString("id-ID")}`;

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<CartItem[]>(initialCart);

  const totalItems = React.useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const subtotal = React.useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );

  const handleQuantityChange = React.useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  }, []);

  const handleRemoveItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const totals = React.useMemo(() => {
    const shipment = items.length > 0 ? SHIPPING_COST : 0;
    const admin = items.length > 0 ? ADMIN_FEE : 0;
    const totalAmount = subtotal + shipment + admin;

    return {
      shipment,
      admin,
      total: totalAmount,
    };
  }, [items.length, subtotal]);

  return (
    <main className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <SiteHeader />
      <div className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-[#111827]">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex w-max items-center gap-2 text-sm font-medium text-[#187247] transition hover:text-[#0A6B3C]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.56 11.5l5.97 5.97a.75.75 0 0 1-1.06 1.06l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <span>Kembali</span>
            </button>
            <h1 className="text-2xl font-semibold">Keranjang Saya ({totalItems})</h1>
            <p className="text-sm text-[#6B7280]">Terdapat {totalItems} produk dalam keranjang</p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A6B3C]/10 text-[#0A6B3C]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 6.19 11.22 6.46 11.48a.75.75 0 0 0 1.08 0C12.81 20.22 19 14.25 19 9a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5Z" />
                      </svg>
                    </span>
                    <div>
                      <h2 className="text-base font-semibold">Alamat Pengiriman</h2>
                      <p className="text-sm text-[#6B7280]">Belum ada alamat yang dipilih</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-max rounded-full border border-[#E5E7EB] px-5 py-2 text-sm font-medium text-[#0A6B3C] transition hover:border-[#0A6B3C]"
                  >
                    Tambah
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#111827]">Pesanan</h2>
                  <span className="text-sm text-[#6B7280]">Kelola produk pesananmu</span>
                </div>

                <div className="mt-6 space-y-4">
                  {items.map((item) => {
                    const productTotal = item.price * item.quantity;
                    const productLabel = item.quantity > 1 ? `Total ${item.quantity} Produk` : "Total 1 Produk";

                    return (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 items-start gap-4">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#FEE2E2] text-sm font-semibold text-[#DC2626] transition hover:bg-[#FCA5A5]"
                              aria-label={`Hapus ${item.name}`}
                            >
                              ×
                            </button>
                            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 768px) 30vw, (max-width: 1280px) 12vw, 8vw"
                                className="object-contain"
                              />
                            </div>
                            <div className="space-y-1 text-[#111827]">
                              <h3 className="text-base font-semibold leading-tight">{item.name}</h3>
                              <p className="text-sm text-[#6B7280]">{item.variant}</p>
                              <p className="text-sm font-semibold text-[#DC2626]">{formatPrice(item.price)}</p>
                            </div>
                          </div>

                          <div className="flex w-full flex-col justify-between gap-3 md:w-[220px] md:items-end">
                            <div className="flex items-center gap-3 self-start rounded-full border border-[#E5E7EB] px-3 py-2 text-sm font-medium md:self-end">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#111827] transition hover:bg-[#F3F4F6]"
                                aria-label={`Kurangi jumlah ${item.name}`}
                              >
                                −
                              </button>
                              <span className="min-w-[32px] text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A6B3C] text-white transition hover:bg-[#07502C]"
                                aria-label={`Tambah jumlah ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right text-sm text-[#6B7280]">
                              <p>{productLabel}</p>
                              <p className="font-semibold text-[#111827]">{formatPrice(productTotal)}</p>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  {items.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white px-6 py-10 text-center text-sm text-[#6B7280]">
                      Keranjangmu masih kosong. Yuk, tambah produk favoritmu!
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#111827]">Metode Pembayaran</h2>
                  <button
                    type="button"
                    className="rounded-full border border-[#E5E7EB] px-4 py-1.5 text-sm font-medium text-[#0A6B3C] transition hover:border-[#0A6B3C]"
                  >
                    Pilih
                  </button>
                </div>
                <p className="mt-3 text-sm text-[#6B7280]">Belum ada metode pembayaran yang dipilih</p>
              </section>

              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#111827]">Voucher dan Promo</h2>
                  <button
                    type="button"
                    className="rounded-full border border-[#E5E7EB] px-4 py-1.5 text-sm font-medium text-[#0A6B3C] transition hover:border-[#0A6B3C]"
                  >
                    Pilih
                  </button>
                </div>
                <p className="mt-3 text-sm text-[#6B7280]">Belum ada voucher yang digunakan</p>
              </section>

              <section className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#111827]">Ringkasan Transaksi</h2>
                <div className="space-y-3 text-sm text-[#4B5563]">
                  <div className="flex items-center justify-between">
                    <span>Total Harga Pesanan</span>
                    <span className="font-semibold text-[#111827]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Biaya Pengiriman</span>
                    <span>{totals.shipment > 0 ? formatPrice(totals.shipment) : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Biaya Admin</span>
                    <span>{totals.admin > 0 ? formatPrice(totals.admin) : "-"}</span>
                  </div>
                </div>
                <div className="h-px bg-[#E5E7EB]" />
                <div className="flex items-center justify-between text-base font-semibold text-[#111827]">
                  <span>Total Pembayaran</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
                <button
                  type="button"
                  disabled={items.length === 0}
                  className="w-full rounded-full bg-[#0A6B3C] py-3 text-sm font-semibold text-white transition hover:bg-[#07502C] disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
                >
                  Checkout ({totalItems})
                </button>
              </section>
            </aside>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
