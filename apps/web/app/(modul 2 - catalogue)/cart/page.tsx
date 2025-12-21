"use client";

import React, { Suspense } from "react";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import Image from "next/image";
import { useNavigate } from "@/hooks/useNavigate";
import Cookies from "js-cookie";

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  store_id?: string | number;
}

const initialCart: CartItem[] = [];

const SHIPPING_COST = 9000;
const ADMIN_FEE = 1000;

const formatPrice = (value: number) => `Rp. ${value.toLocaleString("id-ID")}`;

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<CartItem[]>(initialCart);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("pasjajan_cart");
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown[];
      const normalized = parsed.map((rawItem) => {
        const it = rawItem as Record<string, unknown>;
        return {
          id: String(it.id ?? it.product_id ?? ""),
          name: String(it.name ?? it.product_name ?? ""),
          variant: String(it.variant ?? it.product_variant ?? ""),
          price: Number(it.price ?? it.product_price ?? 0),
          quantity: Number(it.quantity ?? it.qty ?? 1),
          image: String(it.image ?? it.image_url ?? "/images/Screenshot 2025-10-25 173437.png"),
          store_id: it.store_id ?? undefined,
        } as CartItem;
      });

      // try to fetch latest product data from API and merge
      (async () => {
        try {
          const ids = Array.from(new Set(normalized.map((i) => i.id).filter(Boolean)));
          if (ids.length === 0) {
            setItems(normalized);
            return;
          }

          // fetch products in parallel using product detail endpoint
          const fetches = ids.map((id) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$|\/$/, '') || "http://localhost:8000"}/api/products/${id}`).then((r) => {
              if (!r.ok) return null;
              return r.json().catch(() => null);
            }).catch(() => null),
          );

          const results = await Promise.all(fetches);

          const byId = new Map<string, unknown>();
          results.forEach((res) => {
            if (!res) return;
            // support different shapes: { success, data: { product } } or { success, data } or direct product
            const product = res.data?.product ?? res.data ?? res.product ?? null;
            if (product && (product.id ?? product.product_id)) {
              const pid = (product.id ?? product.product_id).toString();
              byId.set(pid, product);
            }
          });

          const merged = normalized.map((it) => {
            const pRaw = byId.get(it.id);
            if (!pRaw) return it;
            const p = pRaw as Record<string, unknown>;
            return {
              ...it,
              name: String(p.name ?? p.title ?? it.name),
              price: Number(p.price ?? p.final_price ?? it.price ?? 0),
              image: String(p.image_url ?? p.image ?? it.image),
              variant: it.variant || String(p.details ?? it.variant),
            } as CartItem;
          });

          setItems(merged);
        } catch (err) {
          console.error("Failed to refresh cart product data", err);
          setItems(normalized);
        }
      })();
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("pasjajan_cart", JSON.stringify(items));
    } catch (err) {
      console.error("Failed to persist cart to localStorage", err);
    }
  }, [items]);

  const totalItems = React.useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const subtotal = React.useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );

  const handleQuantityChange = React.useCallback(
    (id: string, delta: number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        ),
      );
    },
    [],
  );

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

  const handleCheckout = React.useCallback(async () => {
    if (items.length === 0) return;

    try {
      // Get token from Cookies (sesuai dengan authStore)
      const token = Cookies.get('token');
      if (!token) {
        alert('Silakan login terlebih dahulu!');
        router.push('/login');
        return;
      }

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_fee: SHIPPING_COST,
        admin_fee: ADMIN_FEE,
        sub_total: subtotal,
        grand_total: totals.total,
        // Default shipping address (bisa diubah nanti di payment page)
        shipping_recipient_name: 'Customer',
        shipping_recipient_phone: '0888888888',
        shipping_address: 'Alamat akan diisi di halaman pembayaran',
        // Ambil store_id dari item pertama (asumsi single store checkout)
        store_id: items[0]?.store_id,
      };

      // Create order via API
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiBase}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal membuat order');
      }

      // Get order code from response
      const orderCode = result.data?.order?.code || result.data?.code;

      if (!orderCode) {
        throw new Error('Order code tidak ditemukan');
      }

      // Clear cart after successful order
      localStorage.removeItem('pasjajan_cart');

      // Redirect to payment page with order code
      router.push(`/payment?order=${orderCode}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Gagal melakukan checkout. Silakan coba lagi.');
    }
  }, [items, subtotal, totals.total, router]);

  return (
    <>
      <Suspense fallback={<div />}>
        <Navbar />
      </Suspense>
      <div className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-[#111827]">
            <button
              type="button"
              onClick={() => navigate.back()}
              className="flex w-max items-center gap-2 text-sm font-medium text-[#187247] transition hover:text-[#0A6B3C]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.56 11.5l5.97 5.97a.75.75 0 0 1-1.06 1.06l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <span>Kembali</span>
            </button>
            <h1 className="text-2xl font-semibold">
              Keranjang Saya ({totalItems})
            </h1>
            <p className="text-sm text-[#6B7280]">
              Terdapat {totalItems} produk dalam keranjang
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">


              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#111827]">
                    Pesanan
                  </h2>
                  <span className="text-sm text-[#6B7280]">
                    Kelola produk pesananmu
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {items.map((item) => {
                    const productTotal = item.price * item.quantity;
                    const productLabel =
                      item.quantity > 1
                        ? `Total ${item.quantity} Produk`
                        : "Total 1 Produk";

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
                              <h3 className="text-base leading-tight font-semibold">
                                {item.name}
                              </h3>
                              <p className="text-sm text-[#6B7280]">
                                {item.variant}
                              </p>
                              <p className="text-sm font-semibold text-[#DC2626]">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>

                          <div className="flex w-full flex-col justify-between gap-3 md:w-[220px] md:items-end">
                            <div className="flex items-center gap-3 self-start rounded-full border border-[#E5E7EB] px-3 py-2 text-sm font-medium md:self-end">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#111827] transition hover:bg-[#F3F4F6]"
                                aria-label={`Kurangi jumlah ${item.name}`}
                              >
                                −
                              </button>
                              <span className="min-w-[32px] text-center">
                                {item.quantity}
                              </span>
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
                              <p className="font-semibold text-[#111827]">
                                {formatPrice(productTotal)}
                              </p>
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


              <section className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#111827]">
                  Ringkasan Transaksi
                </h2>
                <div className="space-y-3 text-sm text-[#4B5563]">
                  <div className="flex items-center justify-between">
                    <span>Total Harga Pesanan</span>
                    <span className="font-semibold text-[#111827]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Biaya Pengiriman</span>
                    <span>
                      {totals.shipment > 0 ? formatPrice(totals.shipment) : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Biaya Admin</span>
                    <span>
                      {totals.admin > 0 ? formatPrice(totals.admin) : "-"}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-[#E5E7EB]" />
                <div className="flex items-center justify-between text-base font-semibold text-[#111827]">
                  <span>Total Pembayaran</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
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
      <Footer />
    </>
  );
}