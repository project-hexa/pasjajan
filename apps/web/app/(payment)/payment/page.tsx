"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Badge } from "@workspace/ui/components/badge";
import { Icon } from "@workspace/ui/components/icon";

import PaymentMethodDialog from "@/components/PaymentMethodDialog";
import AddressDialog from "@/components/AddressDialog";
import VoucherDialog, { VoucherChoice } from "@/components/VoucherDialog";

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

// ====== INTERFACE ======
interface OrderItem {
  product_id: number;
  price: number;
  quantity: number;
  sub_total: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
}

interface PaymentItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  image_url: string;
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order");
  
  // ====== FETCH ORDER DATA FROM API ======
  const [items, setItems] = React.useState<PaymentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [orderData, setOrderData] = React.useState<any>(null);

  React.useEffect(() => {
    const loadOrderData = async () => {
      try {
        if (!orderCode) {
          alert("Order code tidak ditemukan!");
          router.push("/cart");
          return;
        }

        // Fetch order detail from API
        const response = await fetch(`http://localhost:8000/api/orders/${orderCode}`);
        const result = await response.json();

        if (!result.success || !result.data.order) {
          alert("Order tidak ditemukan!");
          router.push("/cart");
          return;
        }

        const order = result.data.order;
        setOrderData(order);

        // Fetch all products to get names and images
        const productsResponse = await fetch("http://localhost:8000/api/products");
        const productsResult = await productsResponse.json();

        if (productsResult.success && productsResult.data.products) {
          const products: Product[] = productsResult.data.products;
          
          // Map order items with product details
          const paymentItems: PaymentItem[] = order.items.map((orderItem: OrderItem) => {
            const product = products.find((p) => p.id === orderItem.product_id);
            return {
              id: orderItem.product_id.toString(),
              name: product?.name || "Unknown Product",
              variant: "Varian",
              price: orderItem.price,
              qty: orderItem.quantity,
              image_url: product?.image_url || "https://images.unsplash.com/photo-1604908176997-431c5f69f6a9?q=80&w=640&auto=format&fit=crop",
            };
          });

          setItems(paymentItems);
        }
      } catch (error) {
        console.error("Error loading order data:", error);
        alert("Gagal memuat data order!");
        router.push("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderCode, router]);

  const productTotal = orderData?.sub_total || 0;
  const shipping = orderData?.shipping_fee || 10000;
  const adminFee = orderData?.admin_fee || 1000;
  const grandTotal = orderData?.grand_total || productTotal + shipping + adminFee;

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
    name?: string;
  }>({});

  const paymentLabel = payChoice.name || "-";

  // VOUCHER
  const [voucher, setVoucher] = React.useState<VoucherChoice | null>(null);
  
  // LOADING STATE FOR PAYMENT BUTTON
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Handle Payment Process
  const handlePayment = async () => {
    if (isProcessing) return; // Prevent double clicks
    
    if (!payChoice.option) {
      alert("Silakan pilih metode pembayaran terlebih dahulu!");
      return;
    }

    if (!orderCode) {
      alert("Order code tidak ditemukan!");
      return;
    }

    setIsProcessing(true); // Start loading
    
    try {
      const response = await fetch("http://localhost:8000/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_code: orderCode,
          payment_method_code: payChoice.option,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Gagal memproses pembayaran!");
        setIsProcessing(false); // Stop loading on failure
        return;
      }

      // Save payment data to localStorage for waiting page
      localStorage.setItem("payment_data", JSON.stringify(result.data));

      // Redirect to waiting page
      router.push(`/payment/waiting?order=${orderCode}`);
    } catch (error) {
      console.error("Payment process error:", error);
      alert("Gagal menghubungi server!");
      setIsProcessing(false); // Stop loading on error
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Memuat data keranjang...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-white shadow hover:bg-gray-50 flex items-center justify-center"
          >
            <Icon icon="lucide:arrow-left" width={20} height={20} />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Address & Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* ALAMAT PENGIRIMAN */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-emerald-700 text-base font-semibold">
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>

              <CardContent className="flex items-start justify-between gap-8">
                <div className="flex gap-3 w-1/2">
                  <Icon icon="lucide:map-pin" width={24} height={24} className="text-emerald-700 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{address.name}</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {address.address}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                  </div>
                </div>

                <AddressDialog
                  trigger={
                    <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 whitespace-nowrap flex-shrink-0">
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

            {/* PESANAN */}
            <div className="space-y-3">
              {/* Header Card */}
              <Card className="bg-white shadow-sm py-2">
                <CardContent className="px-4 py-2">
                  <h2 className="text-emerald-700 text-sm font-semibold">
                    Pesanan
                  </h2>
                </CardContent>
              </Card>

              {/* Individual Product Cards */}
              {items.map((item, idx) => (
                <Card key={idx} className="bg-white shadow-sm py-1">
                  <CardContent className="p-4">
                    <div className="flex items-stretch gap-4">
                      {/* Product Image */}
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5"
                          >
                            {item.variant}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {currency(item.price)}
                        </p>
                      </div>

                      {/* Quantity & Total - Vertical with space */}
                      <div className="flex flex-col justify-between items-end text-right">
                        <p className="text-sm text-gray-600">x{item.qty}</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          Total {item.qty} Produk {currency(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - Payment Info */}
          <div className="lg:col-span-1">
            {/* Combined Card: Payment Method + Voucher + Summary */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 space-y-5">
                {/* Metode Pembayaran */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-emerald-700">
                      Metode Pembayaran
                    </p>
                    <PaymentMethodDialog
                      trigger={
                        <button className="px-4 py-1.5 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50">
                          Pilih
                        </button>
                      }
                      onConfirm={(sel) => setPayChoice(sel)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {payChoice.method ? paymentLabel : "-"}
                  </p>
                </div>

                {/* Voucher dan Promo */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-emerald-700">
                      Voucher dan Promo
                    </p>
                    <VoucherDialog
                      current={voucher}
                      onApply={setVoucher}
                      trigger={
                        <button className="px-4 py-1.5 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50">
                          Pilih
                        </button>
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {voucher ? voucher.title : "-"}
                  </p>
                </div>

                {/* Ringkasan Transaksi */}
                <div>
                  <p className="text-sm font-semibold text-emerald-700 mb-3">
                    Ringkasan transaksi
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Total Harga Pesanan</span>
                      <span className="font-medium">{currency(productTotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Biaya Pengiriman</span>
                      <span className="font-medium">{currency(shipping)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Biaya Admin</span>
                      <span className="font-medium">{currency(adminFee)}</span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                      <span>Total Pembayaran</span>
                      <span>{currency(grandTotal)}</span>
                    </div>

                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full py-3 mt-3 rounded-lg bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing && (
                        <Icon icon="lucide:loader-2" width={18} height={18} className="animate-spin" />
                      )}
                      {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                    </button>
                  </div>
                </div>
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

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-emerald-50/50">
                <p className="text-lg">Memuat...</p>
            </div>
        }>
            <CheckoutPageContent />
        </Suspense>
    );
}