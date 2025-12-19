"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

type ClassValue = string | false | null | undefined;

function cx(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}

function formatPrice(value: number) {
  return `Rp. ${value.toLocaleString("id-ID")}`;
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  details?: string;
}

interface StoreProductListProps {
  products: StoreProduct[];
  variant: "grid" | "scroll";
  outerClassName?: string;
  innerClassName?: string;
}

export default function StoreProductList({
  products,
  variant,
  outerClassName,
  innerClassName,
}: StoreProductListProps) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = React.useState<StoreProduct | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [toast, setToast] = React.useState<{ visible: boolean; message: string }>({ visible: false, message: "" });
  const toastTimerRef = React.useRef<number | null>(null);
  const { token } = useAuthStore();

  React.useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
    }
  }, [selectedProduct]);

  React.useEffect(() => {
    if (!selectedProduct) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedProduct]);

  const openProduct = React.useCallback((product: StoreProduct) => {
    setSelectedProduct(product);
  }, []);

  const closeProduct = React.useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const showToast = React.useCallback((message: string) => {
    // clear existing timer
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast({ visible: true, message });
    toastTimerRef.current = window.setTimeout(() => {
      setToast({ visible: false, message: "" });
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const changeQuantity = React.useCallback((delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      return next < 1 ? 1 : next;
    });
  }, []);

  const outerClasses = cx(variant === "scroll" && "overflow-x-auto", outerClassName);
  const innerClasses = cx(
    variant === "scroll"
      ? "flex gap-4 pb-4"
      : "grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5",
    innerClassName,
  );

  return (
    <>
      <div className={outerClasses}>
        <div className={innerClasses}>
          {products.map((product) => {
            const cardClasses = cx(
              "relative flex min-h-[240px] flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A6B3C]",
              variant === "scroll" && "w-[200px] flex-shrink-0",
            );

            return (
              <div
                key={product.id}
                className={cardClasses}
                role="button"
                tabIndex={0}
                onClick={() => openProduct(product)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProduct(product);
                  }
                }}
              >
                <div className="p-3 pb-16">
                  <div className="relative h-32 w-full overflow-hidden rounded-md bg-white">
                    <Image
                      src={product.image || '/images/Screenshot 2025-10-25 173437.png'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 20vw, 15vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-3 space-y-1">
                    <h4 className="text-sm font-semibold text-[#111827]">{product.name}</h4>
                    <p className="text-xs text-[#6B7280]">{product.description}</p>
                    <p className="text-sm font-bold text-[#DC2626]">{formatPrice(product.price)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="absolute inset-x-0 bottom-0 rounded-2xl bg-[#0A6B3C] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#07502C]"
                  onClick={(event) => {
                      event.stopPropagation();
                      openProduct(product);
                    }}
                >
                  Tambah
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProduct ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10"
          onClick={closeProduct}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-product-modal-title"
          >
            <button
              type="button"
              onClick={closeProduct}
              className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#D3BCBC] border border-black text-lg font-semibold text-black shadow-lg transition hover:bg-[#D3BCBC]"
              aria-label="Tutup detail produk"
            >
              ×
            </button>

            <div className="px-8 pt-12 pb-8 text-[#111827]">
              <div className="flex justify-center">
                <div className="relative h-48 w-48 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
                  <Image
                    src={selectedProduct.image || '/images/Screenshot 2025-10-25 173437.png'}
                    alt={selectedProduct.name}
                    fill
                    sizes="(max-width: 768px) 60vw, (max-width: 1280px) 30vw, 20vw"
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <h4 id="store-product-modal-title" className="text-lg font-semibold">
                  {selectedProduct.name}
                </h4>
                <p className="text-sm text-[#6B7280]">{selectedProduct.description}</p>
              </div>

              <div className="mt-4 text-sm leading-relaxed text-[#4B5563]">
                {selectedProduct.details ?? "Deskripsi produk belum tersedia."}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-lg font-semibold text-[#111827] transition hover:border-[#0A6B3C]"
                    onClick={() => changeQuantity(-1)}
                    aria-label="Kurangi jumlah"
                  >
                    −
                  </button>
                  <span className="min-w-[32px] text-center text-base font-medium">{quantity}</span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-lg font-semibold text-[#111827] transition hover:border-[#0A6B3C]"
                    onClick={() => changeQuantity(1)}
                    aria-label="Tambah jumlah"
                  >
                    +
                  </button>
                </div>
                <p className="text-lg font-semibold text-[#DC2626]">
                  {formatPrice(selectedProduct.price * quantity)}
                </p>
              </div>

              <button
                type="button"
                className="mt-8 w-full rounded-full bg-[#0A6B3C] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#07502C]"
                onClick={() => {
                  if (!selectedProduct) return;

                  // require login
                  if (!token) {
                    showToast("Silakan masuk terlebih dahulu untuk menambahkan produk ke keranjang");
                    try {
                      // delay navigation so the toast is visible longer
                      setTimeout(() => {
                        try {
                          router.push("/login");
                        } catch {
                          /* ignore */
                        }
                      }, 3500);
                    } catch {
                      // ignore
                    }
                    return;
                  }

                  try {
                    const key = "pasjajan_cart";
                    const raw = localStorage.getItem(key);
                    const parsed: unknown[] = raw ? (JSON.parse(raw) as unknown[]) : [];

                    const existingIndex = parsed.findIndex((i) => {
                      const entry = i as Record<string, unknown>;
                      const id = entry.id ?? entry.product_id;
                      return String(id ?? "") === selectedProduct.id;
                    });

                    if (existingIndex !== -1) {
                      const existing = parsed[existingIndex] as Record<string, unknown>;
                      existing.quantity = Number(existing.quantity ?? 0) + quantity;
                    } else {
                      parsed.push({
                        id: selectedProduct.id,
                        name: selectedProduct.name,
                        variant: selectedProduct.details ?? "",
                        price: selectedProduct.price,
                        quantity,
                        image: selectedProduct.image,
                      } as unknown);
                    }

                    localStorage.setItem(key, JSON.stringify(parsed));
                    // notify other components (navbar) that cart changed
                    try {
                      window.dispatchEvent(new CustomEvent("cart_updated"));
                    } catch {
                      // ignore
                    }
                    showToast("Barang berhasil di tambahkan ke keranjang");
                    closeProduct();
                  } catch (err) {
                    console.error(err);
                    showToast("Gagal menambahkan ke keranjang");
                  }
                }}
              >
                Tambah Keranjang
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {toast.visible && (
        <div className="fixed right-6 top-6 z-50">
          <div
            className="max-w-xs rounded-lg border border-gray-300 px-4 py-3 shadow-lg"
            style={{ backgroundColor: "#d9d9d9" }}
          >
            <p className="text-sm font-medium text-[#111827]">{toast.message}</p>
          </div>
        </div>
      )}
    </>
  );
}