"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  BadgePercent,
  Truck,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";

// helper kecil pengganti clsx
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
    title: "Diskon 10%",
    subtitle: "Tanpa minimum",
    expires: "S/D: 30-12-2025",
    kind: "percent",
    value: 10,
    code: "HEMAT10",
  },
  {
    id: "v3",
    title: "Diskon 20RB",
    subtitle: "Minimal Belanja 120RB",
    expires: "S/D: 30-12-2025",
    kind: "flat",
    value: 20000,
    code: "HEMAT20K",
  },
  {
    id: "v4",
    title: "Gratis Ongkir",
    subtitle: "Minimal Belanja 100RB",
    expires: "S/D: 30-12-2025",
    kind: "free_shipping",
    code: "ONGKIRFREE2",
  },
];

export default function VoucherDialog({ trigger, onApply, current }: Props) {
  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");
  const [selected, setSelected] = React.useState<VoucherChoice | null>(
    current ?? null
  );

  React.useEffect(() => {
    setSelected(current ?? null);
  }, [current]);

  const applyCode = () => {
    const hit = VOUCHERS.find(
      (v) => v.code?.toLowerCase() === keyword.trim().toLowerCase()
    );
    if (hit) {
      setSelected(hit);
    } else {
      setSelected(null);
    }
  };

  const IconBox = ({ kind }: { kind: VoucherChoice["kind"] }) => {
    const base = "h-12 w-12 rounded-md grid place-items-center";
    if (kind === "free_shipping") {
      return (
        <div className={cn(base, "bg-rose-500/90 text-white")}>
          <Truck className="h-6 w-6" />
        </div>
      );
    }
    if (kind === "percent") {
      return (
        <div className={cn(base, "bg-yellow-400/90 text-black")}>
          <BadgePercent className="h-6 w-6" />
        </div>
      );
    }
    return (
      <div className={cn(base, "bg-amber-500/90 text-black")}>
        <ShoppingCart className="h-6 w-6" />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <button
              className="p-2 -ml-2 rounded hover:bg-slate-100"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <DialogTitle className="text-base">
              Pilih Voucher dan Promo
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Bar Kode */}
        <div className="mx-4 mb-4 rounded-md bg-emerald-700 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-white/20 text-white text-xs px-2 py-1">
              Kode
            </div>
            <Input
              placeholder="Masukkan Kode"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-white text-slate-900 placeholder:text-slate-400"
            />
            <Button
              onClick={applyCode}
              className="bg-amber-400 text-black hover:bg-amber-300"
            >
              Pakai
            </Button>
          </div>
        </div>

        {/* List Voucher */}
        <ScrollArea className="px-4 pb-4 max-h-[52vh]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {VOUCHERS.map((v) => {
              const active = selected?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelected(active ? null : v)}
                  className={cn(
                    "flex items-center gap-3 rounded-md border p-3 text-left",
                    active
                      ? "ring-2 ring-emerald-600 border-emerald-600"
                      : "hover:bg-slate-50"
                  )}
                >
                  <IconBox kind={v.kind} />
                  <div className="flex-1">
                    <div className="font-medium leading-tight">{v.title}</div>
                    {v.subtitle && (
                      <div className="text-xs text-slate-600">
                        {v.subtitle}
                      </div>
                    )}
                    {v.expires && (
                      <div className="mt-1 text-[11px] text-slate-500">
                        {v.expires}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer hijau + tombol OK */}
        <div className="flex items-center justify-end gap-3 bg-emerald-800 px-4 py-3">
          <Button
            onClick={() => {
              onApply(selected ?? null);
              setOpen(false);
            }}
            className="bg-amber-400 text-black hover:bg-amber-300"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
