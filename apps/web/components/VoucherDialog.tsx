"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import { voucherService, CustomerVoucher } from "@/app/(modul 3 - payment)/_services/voucher.service";

export type VoucherChoice = {
  id: number;
  voucher_id: number;
  title: string;
  subtitle?: string;
  expires?: string;
  discount_value: number;
  code?: string;
};

type Props = {
  trigger: React.ReactNode;
  current?: VoucherChoice | null;
  onApply: (v: VoucherChoice | null) => void;
};

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

// Voucher ticket card component
function VoucherTicket({
  voucher,
  isSelected,
  onSelect,
}: {
  voucher: VoucherChoice;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex w-full overflow-hidden border border-gray-200 bg-white text-left transition-all hover:shadow-md h-[80px]"
    >
      {/* Colored ticket part with torn edge */}
      <div className="relative bg-yellow-400 w-[68px] flex-shrink-0 flex flex-col items-center justify-center">
        {/* Torn edge - white semicircles cutting into colored section from left */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly">
          <div className="w-2 h-4 bg-white rounded-r-full" />
          <div className="w-2 h-4 bg-white rounded-r-full" />
          <div className="w-2 h-4 bg-white rounded-r-full" />
          <div className="w-2 h-4 bg-white rounded-r-full" />
        </div>
        
        {/* Badge */}
        <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
          Diskon
        </div>
        
        {/* Icon */}
        <Icon 
          icon="lucide:ticket" 
          width={24} 
          height={24} 
          className="text-red-600"
        />
      </div>

      {/* Right content part */}
      <div className="flex flex-1 items-center gap-2 px-3 py-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900">{voucher.title}</p>
          <p className="text-xs text-gray-600">{voucher.subtitle}</p>
          <p className="text-xs text-gray-500">{voucher.expires}</p>
        </div>
        
        {/* Radio button */}
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
          isSelected ? "border-emerald-600 bg-emerald-600" : "border-gray-300 bg-white"
        }`}>
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>
    </button>
  );
}

export default function VoucherDialog({ trigger, onApply, current }: Props) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<VoucherChoice | null>(
    current ?? null
  );
  const [vouchers, setVouchers] = React.useState<VoucherChoice[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelected(current ?? null);
  }, [current]);

  // Fetch vouchers when dialog opens
  React.useEffect(() => {
    if (open) {
      const fetchVouchers = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await voucherService.getCustomerVouchers();
          
          if (result.ok && result.data) {
            // Filter only unused vouchers and transform to VoucherChoice
            const availableVouchers: VoucherChoice[] = (result.data as CustomerVoucher[])
              .filter((cv) => !cv.is_used)
              .map((cv) => ({
                id: cv.id,
                voucher_id: cv.voucher.id,
                title: cv.voucher.name,
                subtitle: cv.voucher.description || `Diskon ${currency(parseFloat(cv.voucher.discount_value))}`,
                expires: `S/D: ${new Date(cv.voucher.end_date).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
                discount_value: parseFloat(cv.voucher.discount_value),
                code: cv.voucher.code,
              }));
            setVouchers(availableVouchers);
          } else {
            setError(result.message || "Gagal memuat voucher");
          }
        } catch (err) {
          console.error("Error fetching vouchers:", err);
          setError("Gagal memuat voucher");
        } finally {
          setLoading(false);
        }
      };
      
      fetchVouchers();
    }
  }, [open]);

  const confirm = () => {
    onApply(selected ?? null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent showCloseButton={false} className="p-0 border-0 shadow-xl bg-transparent w-[900px] h-[500px] max-w-[95vw] flex flex-col">
        <DialogTitle className="sr-only">Pilih Voucher dan Promo</DialogTitle>

        <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white">
          
          {/* HEADER */}
          <div className="border-b bg-white flex items-center justify-center relative h-[48px]">
            <button
              onClick={() => setOpen(false)}
              className="absolute left-4 grid h-8 w-8 place-items-center rounded-full text-slate-800 hover:bg-slate-100"
            >
              <Icon icon="lucide:arrow-left" width={16} height={16} />
            </button>
            <p className="text-sm font-semibold text-slate-900">
              Pilih Voucher dan Promo
            </p>
          </div>

          {/* BODY - Voucher Grid */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Icon icon="lucide:loader-2" width={32} height={32} className="animate-spin text-emerald-600" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Icon icon="lucide:alert-circle" width={48} height={48} className="mb-2 text-red-400" />
                <p>{error}</p>
              </div>
            ) : vouchers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Icon icon="lucide:ticket" width={48} height={48} className="mb-2 text-gray-400" />
                <p>Belum ada voucher yang tersedia</p>
                <p className="text-sm text-gray-400 mt-1">Tukarkan poin Anda untuk mendapatkan voucher</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {vouchers.map((v) => (
                  <VoucherTicket
                    key={v.id}
                    voucher={v}
                    isSelected={selected?.id === v.id}
                    onSelect={() => setSelected(selected?.id === v.id ? null : v)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="h-[60px] bg-emerald-800 flex justify-end items-center px-5">
            <Button
              onClick={confirm}
              disabled={loading}
              className="min-w-[90px] bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-semibold disabled:opacity-50"
            >
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
