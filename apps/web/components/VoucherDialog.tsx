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

export type VoucherChoice = {
  id: string;
  title: string;
  subtitle?: string;
  expires?: string;
  kind: "free_shipping" | "percent" | "flat";
  value?: number;
  code?: string;
};

type Props = {
  trigger: React.ReactNode;
  current?: VoucherChoice | null;
  onApply: (v: VoucherChoice | null) => void;
};

const VOUCHERS: VoucherChoice[] = [
  {
    id: "v1",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "free_shipping",
    code: "ONGKIRFREE",
  },
  {
    id: "v2",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "free_shipping",
    code: "ONGKIRFREE2",
  },
  {
    id: "v3",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "free_shipping",
    code: "ONGKIRFREE3",
  },
  {
    id: "v4",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "free_shipping",
    code: "ONGKIRFREE4",
  },
  {
    id: "v5",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "percent",
    value: 10,
    code: "HEMAT10",
  },
  {
    id: "v6",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "percent",
    value: 10,
    code: "HEMAT10B",
  },
  {
    id: "v7",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "percent",
    value: 20,
    code: "HEMAT20",
  },
  {
    id: "v8",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "percent",
    value: 20,
    code: "HEMAT20B",
  },
];

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
  const isShipping = voucher.kind === "free_shipping";
  const bgColor = isShipping ? "bg-red-500" : "bg-yellow-400";
  const badgeText = isShipping ? "Free" : `${voucher.value}%`;
  const badgeBg = isShipping ? "bg-yellow-400 text-red-600" : "bg-red-500 text-white";

  return (
    <button
      onClick={onSelect}
      className="flex w-full overflow-hidden border border-gray-200 bg-white text-left transition-all hover:shadow-md h-[80px]"
    >
      {/* Colored ticket part with torn edge */}
      <div className={`relative ${bgColor} w-[68px] flex-shrink-0 flex flex-col items-center justify-center`}>
        {/* Torn edge - white semicircles cutting into colored section from left */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly">
          <div className="w-2 h-4 bg-white rounded-r-full" />
          <div className="w-2 h-4 bg-white rounded-r-full" />
          <div className="w-2 h-4 bg-white rounded-r-full" />
          <div className="w-2 h-4 bg-white rounded-r-full" />
        </div>
        
        {/* Badge */}
        <div className={`${badgeBg} text-[10px] font-bold px-2 py-0.5 rounded-full mb-1`}>
          {badgeText}
        </div>
        
        {/* Icon */}
        <Icon 
          icon={isShipping ? "lucide:truck" : "lucide:shopping-cart"} 
          width={24} 
          height={24} 
          className={isShipping ? "text-yellow-400" : "text-red-600"}
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

  React.useEffect(() => {
    setSelected(current ?? null);
  }, [current]);

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
            <div className="grid grid-cols-2 gap-3">
              {VOUCHERS.map((v) => (
                <VoucherTicket
                  key={v.id}
                  voucher={v}
                  isSelected={selected?.id === v.id}
                  onSelect={() => setSelected(selected?.id === v.id ? null : v)}
                />
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="h-[60px] bg-emerald-800 flex justify-end items-center px-5">
            <Button
              onClick={confirm}
              className="min-w-[90px] bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-semibold"
            >
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
