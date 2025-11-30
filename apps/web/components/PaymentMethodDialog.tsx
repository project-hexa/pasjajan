"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { ChevronLeft } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

type MethodKey = "ewallet" | "va" | "qris";
type Option = { id: string; label: string; iconUrl?: string };

const EWALLET_OPTIONS: Option[] = [
  { id: "gopay", label: "Gopay", iconUrl: "https://logo.clearbit.com/gopay.co.id" },
  { id: "dana", label: "Dana", iconUrl: "https://logo.clearbit.com/dana.id" },
  { id: "shopeepay", label: "Shopee Pay", iconUrl: "https://logo.clearbit.com/shopee.co.id" },
  { id: "ovo", label: "OVO", iconUrl: "https://logo.clearbit.com/ovo.id" },
];

const VA_OPTIONS: Option[] = [
  { id: "bca", label: "BCA", iconUrl: "https://logo.clearbit.com/bca.co.id" },
  { id: "bni", label: "BNI", iconUrl: "https://logo.clearbit.com/bni.co.id" },
  { id: "permata", label: "Permata Bank", iconUrl: "https://logo.clearbit.com/permatabank.com" },
  { id: "bri", label: "BRI", iconUrl: "https://logo.clearbit.com/bri.co.id" },
];

interface Props {
  trigger?: React.ReactNode;
  onConfirm?: (p: { method: MethodKey; option?: string }) => void;
}

export default function PaymentMethodDialog({
  trigger = <Button variant="outline" className="w-full">Pilih Metode Pembayaran</Button>,
  onConfirm,
}: Props) {
  const [open, setOpen] = React.useState(false);

  // ========= STATE TUNGGAL YANG BENAR =========
  const [method, setMethod] = React.useState<MethodKey | undefined>();
  const [option, setOption] = React.useState<string | undefined>();

  const confirm = () => {
    if (!method) return setOpen(false);
    onConfirm?.({ method, option });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="
          p-0 border-0 shadow-xl bg-transparent
          w-[480px] h-[400px] max-w-[92vw]
          flex flex-col items-stretch
        "
      >
        <DialogTitle className="sr-only">Pilih Metode Pembayaran</DialogTitle>

        <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white">

          {/* HEADER */}
          <div className="border-b bg-white flex items-center justify-center relative h-[48px]">
            <button
              onClick={() => setOpen(false)}
              className="absolute left-4 grid h-8 w-8 place-items-center rounded-full text-slate-800 hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold text-slate-900">
              Pilih Metode Pembayaran
            </p>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-none">
            <div className="flex flex-col gap-4">

              {/* === E-WALLET === */}
              <Accordion type="single" collapsible>
                <AccordionItem value="ewallet">
                  <AccordionTrigger
                    className="
                      w-full rounded-xl border shadow-sm bg-emerald-50
                      px-5 py-5 text-left flex items-center justify-between
                      hover:bg-emerald-100
                    "
                  >
                    <span className="font-semibold text-base text-slate-900">
                      E-Wallet
                    </span>
                  </AccordionTrigger>

                  <AccordionContent
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                  >
                    <div className="mt-2 rounded-xl border border-emerald-100 bg-white p-2">
                      <RadioGroup value={option}>
                        <div className="space-y-2">
                          {EWALLET_OPTIONS.map((o) => (
                            <OptionRow
                              key={o.id}
                              id={`ew-${o.id}`}
                              label={o.label}
                              iconUrl={o.iconUrl}
                              value={o.id}
                              selectedValue={option}
                              onSelect={() => {
                                setMethod("ewallet");
                                setOption(o.id);
                              }}
                            />
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* === VIRTUAL ACCOUNT === */}
              <Accordion type="single" collapsible>
                <AccordionItem value="va">
                  <AccordionTrigger
                    className="
                      w-full rounded-xl border shadow-sm bg-emerald-50
                      px-5 py-5 text-left flex items-center justify-between
                      hover:bg-emerald-100
                    "
                  >
                    <span className="font-semibold text-base text-slate-900">
                      Virtual Account
                    </span>
                  </AccordionTrigger>

                  <AccordionContent
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                  >
                    <div className="mt-2 rounded-xl border border-emerald-100 bg-white p-2">
                      <RadioGroup value={option}>
                        <div className="space-y-2">
                          {VA_OPTIONS.map((o) => (
                            <OptionRow
                              key={o.id}
                              id={`va-${o.id}`}
                              label={o.label}
                              iconUrl={o.iconUrl}
                              value={o.id}
                              selectedValue={option}
                              onSelect={() => {
                                setMethod("va");
                                setOption(o.id);
                              }}
                            />
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* === QRIS === */}
              <div
                onClick={() => {
                  setMethod("qris");
                  setOption("qris");
                }}
                className={cn(
                  "w-full rounded-xl border shadow-sm px-5 py-5 flex items-center justify-between cursor-pointer",
                  method === "qris"
                    ? "bg-emerald-100 border-emerald-300"
                    : "bg-emerald-50 hover:bg-emerald-100"
                )}
              >
                <span className="font-semibold text-base text-slate-900">
                  QRIS
                </span>

                <RadioGroup value={method}>
                  <RadioGroupItem
                    id="m-qris"
                    value="qris"
                    checked={method === "qris"}
                    onClick={(e) => e.stopPropagation()}
                  />
                </RadioGroup>
              </div>

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

/* ------- OPTION ITEM ------- */
function OptionRow({
  id,
  label,
  iconUrl,
  value,
  selectedValue,
  onSelect,
}: {
  id: string;
  label: string;
  iconUrl?: string;
  value: string;
  selectedValue?: string;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center justify-between rounded-lg border bg-white px-3 py-3 hover:bg-slate-50 cursor-pointer",
        selectedValue === value && "border-emerald-300 bg-emerald-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-sm overflow-hidden bg-slate-100 ring-1 ring-slate-200">
          {iconUrl && <img src={iconUrl} alt={label} className="h-full w-full object-contain" />}
        </div>
        <span className="text-sm text-slate-800">{label}</span>
      </div>

      <RadioGroupItem
        id={id}
        value={value}
        checked={selectedValue === value}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
