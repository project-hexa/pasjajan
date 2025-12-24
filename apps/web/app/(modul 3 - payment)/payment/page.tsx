"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useNavigate } from "@/hooks/useNavigate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Badge } from "@workspace/ui/components/badge";
import { Icon } from "@workspace/ui/components/icon";

import PaymentMethodDialog from "@/components/PaymentMethodDialog";
import AddressDialog, { Address } from "@/components/AddressDialog";
import VoucherDialog, { VoucherChoice } from "@/components/VoucherDialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cookies from "js-cookie";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";

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
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  // Sanitize order code - hapus suffix :1 atau :digit jika ada
  const rawOrderCode = searchParams.get("order");
  const orderCode = rawOrderCode ? rawOrderCode.replace(/:\d+$/, "") : null;

  // ====== FETCH ORDER DATA FROM API ======
  const [items, setItems] = React.useState<PaymentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [orderData, setOrderData] = React.useState<any>(null);
  const [branchName, setBranchName] = React.useState<string>("");

  // ALAMAT - Dynamic from user profile
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = React.useState(true);
  const [address, setAddress] = React.useState({
    name: "",
    address: "",
    phone: "",
  });

  // Get logged-in user from auth store
  const { user } = useUserStore();

  React.useEffect(() => {
    const loadOrderData = async () => {
      try {
        // Fallback fetch branch name from public API (jika order tidak punya store)
        const branchesResponse = await fetch(
          "http://localhost:8000/api/branches/public",
        );
        const branchesResult = await branchesResponse.json();

        let fallbackBranchName = "";
        if (
          branchesResult.success &&
          branchesResult.data.branches &&
          branchesResult.data.branches.length > 0
        ) {
          fallbackBranchName = branchesResult.data.branches[0].name;
        }

        if (!orderCode) {
          alert("Order code tidak ditemukan!");
          navigate.push("/cart");
          return;
        }

        // Get auth token
        const token = Cookies.get("token");

        // Fetch order detail from API
        const response = await fetch(
          `http://localhost:8000/api/orders/${orderCode}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                }
              : {
                  Accept: "application/json",
                },
          },
        );

        console.log("Order API Response Status:", response.status);
        const result = await response.json();
        console.log("Order API Response:", result);

        if (!result.success || !result.data.order) {
          alert("Order tidak ditemukan!");
          navigate.push("/cart");
          return;
        }

        const order = result.data.order;
        setOrderData(order);

        // Set branch name dari order store_name, fallback ke branches list
        if (order.store_name) {
          setBranchName(order.store_name);
        } else if (fallbackBranchName) {
          setBranchName(fallbackBranchName);
        }

        // Fetch all products to get names and images
        const productsResponse = await fetch(
          "http://localhost:8000/api/products",
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                }
              : {
                  Accept: "application/json",
                },
          },
        );
        const productsResult = await productsResponse.json();

        // Normalize products data (bisa di data.data atau data)
        let products: Product[] = [];
        if (productsResult.data?.data) {
          products = productsResult.data.data;
        } else if (Array.isArray(productsResult.data)) {
          products = productsResult.data;
        } else if (productsResult.data?.products) {
          products = productsResult.data.products;
        }

        if (productsResult.success && products) {
          // Map order items with product details
          const paymentItems: PaymentItem[] = order.items.map(
            (orderItem: OrderItem) => {
              const product = products.find(
                (p) => p.id === orderItem.product_id,
              );
              return {
                id: orderItem.product_id.toString(),
                name: product?.name || `Produk ${orderItem.product_id}`,
                variant: "Varian",
                price: orderItem.price,
                qty: orderItem.quantity,
                image_url:
                  product?.image_url ||
                  "https://images.unsplash.com/photo-1604908176997-431c5f69f6a9?q=80&w=640&auto=format&fit=crop",
              };
            },
          );

          setItems(paymentItems);
        } else if (order.items && order.items.length > 0) {
          // Fallback: tampilkan items dari order langsung tanpa product details
          const paymentItems: PaymentItem[] = order.items.map(
            (orderItem: OrderItem) => ({
              id: orderItem.product_id.toString(),
              name: `Produk ${orderItem.product_id}`,
              variant: "Varian",
              price: orderItem.price,
              qty: orderItem.quantity,
              image_url:
                "https://images.unsplash.com/photo-1604908176997-431c5f69f6a9?q=80&w=640&auto=format&fit=crop",
            }),
          );
          setItems(paymentItems);
        }
      } catch (error) {
        console.error("Error loading order data:", error);
        alert("Gagal memuat data order!");
        navigate.push("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderCode, navigate]);

  const productTotal = orderData?.sub_total || 0;
  const shipping = orderData?.shipping_fee || 10000;
  const adminFee = orderData?.admin_fee || 1000;
  const grandTotal =
    orderData?.grand_total || productTotal + shipping + adminFee;

  // Fetch user addresses
  React.useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.email) {
        setAddressLoading(false);
        return;
      }

      try {
        const token = Cookies.get("token");
        const res = await fetch(
          `http://localhost:8000/api/user/profile?email=${user.email}`,
          {
            headers: {
              Accept: "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          },
        );
        const result = await res.json();

        if (result.success && result.data?.user?.customer?.addresses) {
          const userAddresses = result.data.user.customer.addresses;
          // Transform to Address format
          const formattedAddresses: Address[] = userAddresses.map(
            (addr: any) => ({
              id: addr.id,
              label: addr.label || "Alamat",
              name: `${addr.label || "Alamat"} – ${addr.recipient_name}`,
              address: addr.detail_address,
              phone: addr.phone_number,
            }),
          );

          setAddresses(formattedAddresses);

          // Set default address (first one or is_default)
          const defaultAddr =
            userAddresses.find((a: any) => a.is_default) || userAddresses[0];
          if (defaultAddr) {
            setAddress({
              name: `${defaultAddr.label || "Alamat"} – ${defaultAddr.recipient_name}`,
              address: defaultAddr.detail_address,
              phone: defaultAddr.phone_number,
            });
          }
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      } finally {
        setAddressLoading(false);
      }
    };

    loadAddresses();
  }, [user?.email]);

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
      // Get auth token
      const token = Cookies.get("token");

      const response = await fetch(
        "http://localhost:8000/api/payment/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            order_code: orderCode,
            payment_method_code: payChoice.option,
            shipping_address: address.address,
            shipping_recipient_name:
              address.name?.split(" – ")[1] || address.name,
            shipping_recipient_phone: address.phone,
          }),
        },
      );

      const result = await response.json();

      console.log("Payment process response:", result);

      if (!result.success) {
        alert(result.message || "Gagal memproses pembayaran!");
        setIsProcessing(false); // Stop loading on failure
        return;
      }

      // Save payment data to localStorage for waiting page
      localStorage.setItem("payment_data", JSON.stringify(result.data));

      // Redirect to waiting page
      navigate.push(`/payment/waiting?order=${orderCode}`);
    } catch (error) {
      console.error("Payment process error:", error);

      // Cek apakah ini masalah user tidak punya customer profile
      alert(
        "Gagal memproses pembayaran. Pastikan Anda login sebagai Customer, bukan Admin.",
      );
      setIsProcessing(false); // Stop loading on error
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg">Memuat data keranjang...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <Header
        logoSrc="/images/pasjajan2.png"
        logoAlt="PasJajan Logo"
        userName={user?.full_name}
        userInitials={user?.full_name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)}
        userAvatar={user?.avatar}
      />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* HEADER */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-gray-50"
          >
            <Icon icon="lucide:arrow-left" width={20} height={20} />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN - Address & Orders */}
          <div className="space-y-6 lg:col-span-2">
            {/* ALAMAT PENGIRIMAN */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-emerald-700">
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>

              <CardContent className="flex items-start justify-between gap-8">
                <div className="flex w-1/2 gap-3">
                  <Icon
                    icon="lucide:map-pin"
                    width={24}
                    height={24}
                    className="mt-1 flex-shrink-0 text-emerald-700"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {address.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {address.address}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {address.phone}
                    </p>
                  </div>
                </div>

                <AddressDialog
                  trigger={
                    <button className="flex-shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-gray-50">
                      Ubah
                    </button>
                  }
                  addresses={addresses}
                  loading={addressLoading}
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
              <Card className="bg-white py-2 shadow-sm">
                <CardContent className="flex items-center justify-between px-4 py-2">
                  <h2 className="text-sm font-semibold text-emerald-700">
                    Pesanan
                  </h2>
                  {branchName && (
                    <p className="text-sm font-semibold text-emerald-700">
                      Cabang {branchName}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Individual Product Cards */}
              {items.map((item, idx) => (
                <Card key={idx} className="bg-white py-1 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-stretch gap-4">
                      {/* Product Image */}
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-gray-200 px-2 py-0.5 text-xs text-gray-700"
                          >
                            {item.variant}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {currency(item.price)}
                        </p>
                      </div>

                      {/* Quantity & Total - Vertical with space */}
                      <div className="flex flex-col items-end justify-between text-right">
                        <p className="text-sm text-gray-600">x{item.qty}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Total {item.qty} Produk{" "}
                          {currency(item.price * item.qty)}
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
              <CardContent className="space-y-5 p-4">
                {/* Metode Pembayaran */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-emerald-700">
                      Metode Pembayaran
                    </p>
                    <PaymentMethodDialog
                      trigger={
                        <button className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm hover:bg-gray-50">
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
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-emerald-700">
                      Voucher dan Promo
                    </p>
                    <VoucherDialog
                      current={voucher}
                      onApply={setVoucher}
                      trigger={
                        <button className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm hover:bg-gray-50">
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
                  <p className="mb-3 text-sm font-semibold text-emerald-700">
                    Ringkasan transaksi
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Total Harga Pesanan</span>
                      <span className="font-medium">
                        {currency(productTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Biaya Pengiriman</span>
                      <span className="font-medium">{currency(shipping)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Biaya Admin</span>
                      <span className="font-medium">{currency(adminFee)}</span>
                    </div>

                    <div className="flex justify-between pt-2 text-base font-bold text-gray-900">
                      <span>Total Pembayaran</span>
                      <span>{currency(grandTotal)}</span>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed"
                    >
                      {isProcessing && (
                        <Icon
                          icon="lucide:loader-2"
                          width={18}
                          height={18}
                          className="animate-spin"
                        />
                      )}
                      {isProcessing ? "Memproses..." : "Bayar Sekarang"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-emerald-50/50">
          <p className="text-lg">Memuat...</p>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
