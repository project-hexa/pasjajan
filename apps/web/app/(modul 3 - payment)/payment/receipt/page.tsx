"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Icon } from "@workspace/ui/components/icon";
import Image from "next/image";
import { orderService } from "@/app/(modul 3 - payment)/_services/order.service";

interface ReceiptItem {
  no: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  sub_total: number;
}

interface ReceiptData {
  order_code: string;
  status_message: string;
  customer: {
    name: string;
    address: string;
    recipient_name: string;
    phone: string;
  };
  payment: {
    paid_at: string;
    paid_at_formatted: string;
    payment_method: string;
    payment_method_code: string | null;
  };
  items: ReceiptItem[];
  summary: {
    sub_total: number;
    discount: number;
    shipping_fee: number;
    admin_fee: number;
    grand_total: number;
  };
  created_at: string;
}

const currency = (val: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val).replace("Rp", "Rp ");
};

function ReceiptPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order");

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderCode) {
      router.push("/my-orders/all");
      return;
    }

    const fetchReceipt = async () => {
      try {
        const result = await orderService.getPaymentReceipt(orderCode);
        if (result.ok && result.data?.receipt) {
          setReceipt(result.data.receipt as ReceiptData);
        } else {
          setError(result.message || "Gagal memuat bukti transaksi");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan koneksi");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [orderCode, router]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
        <p className="font-medium text-red-500">{error || "Bukti transaksi tidak ditemukan"}</p>
        <button onClick={() => router.back()} className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1 print:hidden">
            <Icon icon="lucide:arrow-left" width={24} height={24} />
          </button>
          <div className="flex items-center gap-2">
            <Image src="/images/pasjajan2.png" alt="PasJajan Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="text-xl font-bold text-emerald-700">PasJajan</span>
          </div>
          <div className="w-6"></div>
        </div>

        {/* Greeting */}
        <div className="mb-4">
          <p className="text-gray-700">Hai {receipt.customer.name}</p>
          <p className="mt-1 text-gray-600">
            Pesanan {receipt.order_code} Telah berhasil dibayar
          </p>
        </div>

        {/* Customer Info */}
        <div className="mb-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Nama Pembeli:</p>
            <p className="text-sm text-gray-600">{receipt.customer.name}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Alamat Pembeli:</p>
            <p className="text-sm text-gray-600">{receipt.customer.address}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">No. handphone</p>
            <p className="text-sm text-gray-600">{receipt.customer.phone}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-gray-800">Rincian Pembayaran</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Waktu Pembayaran:</p>
              <p className="text-sm text-gray-600">{receipt.payment.paid_at_formatted || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Metode Pembayaran:</p>
              <p className="text-sm text-gray-600">{receipt.payment.payment_method}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-gray-800">Rincian Pesanan</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">No</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Gambar</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Produk</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">Harga Produk</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Kuantitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {receipt.items.map((item) => (
                  <tr key={item.no}>
                    <td className="px-3 py-3 text-center text-gray-600">{item.no}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                            <Icon icon="lucide:image" width={20} height={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-800">{item.product_name}</td>
                    <td className="px-3 py-3 text-right text-gray-600">{currency(item.price)}</td>
                    <td className="px-3 py-3 text-center text-gray-600">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary inside table */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pesanan</span>
                  <span className="text-gray-800">{currency(receipt.summary.sub_total)}</span>
                </div>
                {receipt.summary.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potongan Voucher</span>
                    <span className="text-red-500">-{currency(receipt.summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span className="text-gray-800">{currency(receipt.summary.shipping_fee)}</span>
                </div>
                {receipt.summary.admin_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span className="text-gray-800">{currency(receipt.summary.admin_fee)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                  <span className="text-gray-800">Total Pembayaran</span>
                  <span className="text-gray-800">{currency(receipt.summary.grand_total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mb-6 text-sm text-gray-600">
          <p>
            Kami sangat menghargai waktu dan kepercayaan Anda. Terima kasih telah membeli produk di
            layanan kami. Kami berharap Anda puas dengan produk yang Anda terima dan menantikan
            kedatangan Anda kembali di layanan kami untuk pengalaman berbelanja berikutnya.
          </p>
        </div>

        {/* Download Button */}
        <div className="mb-8 flex justify-center print:hidden">
          <button
            onClick={handleDownload}
            className="rounded-full bg-emerald-700 px-8 py-3 font-medium text-white transition-colors hover:bg-emerald-800"
          >
            Download
          </button>
        </div>

        {/* Footer */}
        <div className="text-center print:hidden">
          <p className="mb-2 font-semibold text-gray-800">Ikuti kami</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Icon icon="mdi:instagram" width={24} height={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Icon icon="mdi:facebook" width={24} height={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Icon icon="ic:baseline-tiktok" width={24} height={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ReceiptPageContent />
    </Suspense>
  );
}
