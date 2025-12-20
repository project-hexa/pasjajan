"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/sonner";
import { api } from "@/lib/utils/axios";
import { Icon } from "@workspace/ui/components/icon";

// Types
interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  discount_value: string;
  required_points: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface CustomerVoucher {
  id: number;
  voucher: Voucher;
  redeemed_at: string;
  is_used: boolean;
  used_at: string | null;
}

// VoucherItem Component - for customer's vouchers
function VoucherItem({ voucher, isUsed }: { voucher: Voucher; isUsed: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Image src="/promo/Keranjang.png" alt="Voucher" width={50} height={50} />
        <div>
          <p className="text-sm font-semibold">{voucher.name}</p>
          <p className="text-xs text-gray-500">Diskon: Rp {Number(voucher.discount_value).toLocaleString("id-ID")}</p>
          <p className="text-xs text-gray-400">S/D: {voucher.end_date}</p>
        </div>
      </div>

      <Button
        className={`rounded-lg px-4 py-2 text-white ${isUsed ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        disabled={isUsed}
      >
        {isUsed ? "Terpakai" : "Pakai"}
      </Button>
    </div>
  );
}

// RedeemItem Component - for available vouchers to redeem
function RedeemItem({
  voucher,
  userPoints,
  onRedeem,
  isRedeeming
}: {
  voucher: Voucher;
  userPoints: number;
  onRedeem: (voucherId: number) => void;
  isRedeeming: boolean;
}) {
  const canRedeem = userPoints >= voucher.required_points;

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Image src="/promo/Keranjang.png" alt="Reward" width={50} height={50} />
        <div>
          <p className="text-sm font-semibold">{voucher.name}</p>
          <p className="text-xs text-gray-500">Diskon: Rp {Number(voucher.discount_value).toLocaleString("id-ID")}</p>
          <Badge variant="outline" className="border-primary text-primary mt-1 text-xs">
            {voucher.required_points.toLocaleString("id-ID")} Poin
          </Badge>
        </div>
      </div>

      <Button
        className={`rounded-lg px-4 py-2 text-white ${canRedeem ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={!canRedeem || isRedeeming}
        onClick={() => onRedeem(voucher.id)}
      >
        {isRedeeming ? (
          <Icon icon="lucide:loader" className="h-4 w-4 animate-spin" />
        ) : (
          "Tukar"
        )}
      </Button>
    </div>
  );
}

export default function VoucherPage() {
  const [activeTab, setActiveTab] = useState<"voucher" | "tukar">("voucher");
  const [customerPoints, setCustomerPoints] = useState<number>(0);
  const [customerVouchers, setCustomerVouchers] = useState<CustomerVoucher[]>([]);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pointsRes, vouchersRes, availableRes] = await Promise.all([
        api.get("/customer/points"),
        api.get("/customer/vouchers"),
        api.get("/vouchers/available"),
      ]);

      setCustomerPoints(pointsRes.data.data.points || 0);
      setCustomerVouchers(vouchersRes.data.data || []);
      setAvailableVouchers(availableRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch voucher data", error);
      toast.error("Gagal memuat data voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (voucherId: number) => {
    setRedeemingId(voucherId);
    try {
      const response = await api.post("/customer/vouchers/redeem", {
        voucher_id: voucherId,
      });

      toast.success("Voucher berhasil ditukar!");

      // Update points and refresh voucher lists
      setCustomerPoints(response.data.data.remaining_points);
      await fetchData();

      // Switch to voucher tab to show the new voucher
      setActiveTab("voucher");
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal menukar voucher";
      toast.error(message);
    } finally {
      setRedeemingId(null);
    }
  };

  // Filter unused customer vouchers
  const unusedVouchers = customerVouchers.filter(cv => !cv.is_used);
  const usedVouchers = customerVouchers.filter(cv => cv.is_used);

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-green-700 bg-white shadow-md">
      {/* TAB HEADER */}
      <div className="flex gap-2 border-b border-green-600 bg-[#E6F4EA] p-3">
        <button
          onClick={() => setActiveTab("voucher")}
          className={`rounded-lg border px-6 py-2 text-sm font-semibold transition-all ${activeTab === "voucher"
            ? "bg-green-700 text-white"
            : "bg-white text-green-700 hover:bg-gray-100"
            }`}
        >
          Voucher Saya
        </button>

        <button
          onClick={() => setActiveTab("tukar")}
          className={`rounded-lg border px-6 py-2 text-sm font-semibold transition-all ${activeTab === "tukar"
            ? "bg-green-700 text-white"
            : "bg-white text-green-700 hover:bg-gray-100"
            }`}
        >
          Tukar Poin
        </button>

        {/* Points Badge */}
        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <Badge className="bg-card rounded-md text-sm text-black shadow-md border">
              <Image
                src="/img/icon-poin.png"
                alt="icon poin"
                width={20}
                height={20}
                className="mr-1"
              />
              {customerPoints.toLocaleString("id-ID")} Poin
            </Badge>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border bg-white p-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            ))}
          </div>
        ) : activeTab === "voucher" ? (
          <>
            {unusedVouchers.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Voucher Aktif</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {unusedVouchers.map((cv) => (
                    <VoucherItem key={cv.id} voucher={cv.voucher} isUsed={false} />
                  ))}
                </div>
              </div>
            )}

            {usedVouchers.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-500">Voucher Terpakai</h3>
                <div className="grid gap-4 md:grid-cols-2 opacity-60">
                  {usedVouchers.map((cv) => (
                    <VoucherItem key={cv.id} voucher={cv.voucher} isUsed={true} />
                  ))}
                </div>
              </div>
            )}

            {customerVouchers.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                <Icon icon="lucide:ticket" className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p>Belum ada voucher</p>
                <p className="text-sm">Tukar poin Anda untuk mendapatkan voucher!</p>
              </div>
            )}
          </>
        ) : (
          <>
            {availableVouchers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {availableVouchers.map((voucher) => (
                  <RedeemItem
                    key={voucher.id}
                    voucher={voucher}
                    userPoints={customerPoints}
                    onRedeem={handleRedeem}
                    isRedeeming={redeemingId === voucher.id}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500">
                <Icon icon="lucide:gift" className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p>Belum ada reward untuk ditukar</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
