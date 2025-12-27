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
import { toast } from "@workspace/ui/components/sonner"

import PaymentMethodDialog from "@/components/PaymentMethodDialog";
import AddressDialog, { Address } from "@/components/AddressDialog";
import VoucherDialog, { VoucherChoice } from "@/components/VoucherDialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { orderService } from "@/app/(modul 3 - payment)/_services/order.service";
import { paymentService } from "@/app/(modul 3 - payment)/_services/payment.service";
import { addressService } from "@/app/(modul 3 - payment)/_services/address.service";
import { PaymentItem } from "@/types/payment.types";
import { Order, OrderItem } from "@/types/order.types";

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
}

function CheckoutPageContent() {
  const navigate = useNavigate();
  const navigateRef = React.useRef(navigate);
  navigateRef.current = navigate; // Always keep ref updated

  const searchParams = useSearchParams();
  const rawOrderCode = searchParams.get("order");
  const orderCode = rawOrderCode ? rawOrderCode.replace(/:\d+$/, "") : null;

  const [items, setItems] = React.useState<PaymentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [orderData, setOrderData] = React.useState<Order | null>(null);
  const [branchName, setBranchName] = React.useState<string>("");

  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = React.useState(true);
  const [address, setAddress] = React.useState({
    name: "",
    address: "",
    phone: "",
  });

  const { user } = useUserStore();

  React.useEffect(() => {
    const loadOrderData = async () => {
      try {
        const branchesResult = await orderService.getBranches();
        let fallbackBranchName = "";
        if (branchesResult.ok && branchesResult.data?.branches && branchesResult.data.branches.length > 0) {
          fallbackBranchName = branchesResult.data.branches[0]!.name;
        }

        if (!orderCode) {
          toast.error("Order code tidak ditemukan!", { toasterId: "global" });
          navigateRef.current.push("/cart");
          return;
        }

        const orderResult = await orderService.getOrder(orderCode);

        if (!orderResult.ok || !orderResult.data?.order) {
          toast.error("Order tidak ditemukan!", { toasterId: "global" });
          navigateRef.current.push("/cart");
          return;
        }

        const order = orderResult.data.order;
        setOrderData(order);

        if (order.store_name) {
          setBranchName(order.store_name);
        } else if (fallbackBranchName) {
          setBranchName(fallbackBranchName);
        }

        const productsResult = await orderService.getProducts();

        let products: Product[] = [];
        if (productsResult.ok && productsResult.data) {
          const data = productsResult.data as any;
          if (data.data) {
            products = data.data;
          } else if (Array.isArray(data)) {
            products = data;
          } else if (data.products) {
            products = data.products;
          }
        }

        if (products.length > 0) {
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
        } else if (order.items?.length > 0) {
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
        toast.error("Gagal memuat data order!", { toasterId: "global" });
        navigateRef.current.push("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderCode]); // Removed navigate from dependencies - using ref instead

  const productTotal = Number(orderData?.sub_total) || 0;
  const shipping = Number(orderData?.shipping_fee) || 10000;
  const adminFee = Number(orderData?.admin_fee) || 1000;

  React.useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.email) {
        setAddressLoading(false);
        return;
      }

      try {
        const result = await addressService.getUserAddresses(user.email);

        if (result.ok && result.data?.user?.customer?.addresses) {
          const userAddresses = result.data.user.customer.addresses;
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

  const [payChoice, setPayChoice] = React.useState<{
    method?: string;
    option?: string;
    name?: string;
  }>({});

  const paymentLabel = payChoice.name || "-";
  const [voucher, setVoucher] = React.useState<VoucherChoice | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Discount: pakai dari order jika sudah ada, atau dari voucher yang dipilih
  const existingDiscount = Number(orderData?.discount) || 0;
  const selectedVoucherDiscount = Number(voucher?.discount_value) || 0;
  const discount = existingDiscount > 0 ? existingDiscount : selectedVoucherDiscount;
  
  // Grand total: kalkulasi ulang jika ada voucher baru yang dipilih
  const baseTotal = productTotal + shipping + adminFee;
  const grandTotal = existingDiscount > 0 
    ? (Number(orderData?.grand_total) || baseTotal - existingDiscount)
    : Math.max(0, baseTotal - selectedVoucherDiscount);

  const handlePayment = async () => {
    if (isProcessing) return;

    if (!payChoice.option) {
      toast.warning("Silakan pilih metode pembayaran terlebih dahulu!", { toasterId: "global" });
      return;
    }

    if (!orderCode) {
      toast.error("Order code tidak ditemukan!", { toasterId: "global" });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await paymentService.processPayment({
        order_code: orderCode,
        payment_method_code: payChoice.option,
        shipping_address: address.address,
        shipping_recipient_name:
          address.name?.split(" – ")[1] || address.name,
        shipping_recipient_phone: address.phone,
        voucher_id: voucher?.voucher_id,
      });

      if (!result.ok) {
        toast.error(result.message || "Gagal memproses pembayaran!", { toasterId: "global" });
        setIsProcessing(false);
        return;
      }

      localStorage.setItem("payment_data", JSON.stringify(result.data));
      navigate.push(`/payment/waiting?order=${orderCode}`);
    } catch (error) {
      console.error("Payment process error:", error);
      toast.error(
        "Gagal memproses pembayaran. Pastikan Anda login sebagai Customer, bukan Admin.",
        { toasterId: "global" }
      );
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg">Memuat data keranjang...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-gray-50"
          >
            <Icon icon="lucide:arrow-left" width={20} height={20} />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
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

            <div className="space-y-3">
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

              {items.map((item, idx) => (
                <Card key={idx} className="bg-white py-1 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-stretch gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                        />
                      </div>

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

          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="space-y-5 p-4">
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

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-emerald-700">
                      Voucher dan Promo
                    </p>
                    {!orderData?.voucher && (
                      <VoucherDialog
                        current={voucher}
                        onApply={setVoucher}
                        trigger={
                          <button className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm hover:bg-gray-50">
                            Pilih
                          </button>
                        }
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {orderData?.voucher 
                      ? orderData.voucher.name 
                      : voucher 
                        ? voucher.title 
                        : "-"}
                  </p>
                </div>

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

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Diskon Voucher</span>
                        <span className="font-medium">-{currency(discount)}</span>
                      </div>
                    )}

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
