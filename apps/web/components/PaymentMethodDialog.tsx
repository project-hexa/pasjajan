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
  const [method, setMethod] = React.useState<MethodKey | undefined>(undefined);
  const [ewallet, setEwallet] = React.useState<string>();
  const [va, setVa] = React.useState<string>();

  const confirm = () => {
    if (!method) { setOpen(false); return; }
    const picked = method === "ewallet" ? ewallet : method === "va" ? va : undefined;
    onConfirm?.({ method, option: picked });
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

        {/* WRAPPER PUTIH + HIJAU (radius menyatu) */}
        <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white">
          {/* HEADER */}
          <div className="border-b bg-white flex items-center justify-center relative h-[48px]">
            <button
              aria-label="Kembali"
              onClick={() => setOpen(false)}
              className="absolute left-4 grid h-8 w-8 place-items-center rounded-full text-slate-800 hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold text-slate-900">Pilih Metode Pembayaran</p>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-none">
            <div className="flex flex-col gap-4">
              {/* === E-Wallet === */}
              <Accordion type="single" collapsible>
                <AccordionItem value="ewallet">
                  <AccordionTrigger
                    className="
                      w-full rounded-xl border shadow-sm bg-emerald-50
                      px-5 py-5 text-left
                      flex items-center justify-between
                      hover:bg-emerald-100 [&>svg]:text-slate-700
                    "
                  >
                    <span className="font-semibold text-base text-slate-900">E-Wallet</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 rounded-xl border border-emerald-100 bg-white p-2">
                      <RadioGroup
                        value={ewallet}
                        onValueChange={(v) => { setEwallet(v); setMethod("ewallet"); }}
                      >
                        <div className="space-y-2">
                          {EWALLET_OPTIONS.map((o) => (
                            <OptionRow key={o.id} id={`ew-${o.id}`} label={o.label} iconUrl={o.iconUrl} value={o.id} />
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* === Virtual Account === */}
              <Accordion type="single" collapsible>
                <AccordionItem value="va">
                  <AccordionTrigger
                    className="
                      w-full rounded-xl border shadow-sm bg-emerald-50
                      px-5 py-5 text-left
                      flex items-center justify-between
                      hover:bg-emerald-100 [&>svg]:text-slate-700
                    "
                  >
                    <span className="font-semibold text-base text-slate-900">Virtual Account</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 rounded-xl border border-emerald-100 bg-white p-2">
                      <RadioGroup
                        value={va}
                        onValueChange={(v) => { setVa(v); setMethod("va"); }}
                      >
                        <div className="space-y-2">
                          {VA_OPTIONS.map((o) => (
                            <OptionRow key={o.id} id={`va-${o.id}`} label={o.label} iconUrl={o.iconUrl} value={o.id} />
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* === QRIS === */}
              <button
                type="button"
                onClick={() => setMethod("qris")}
                className="
                  w-full rounded-xl border shadow-sm bg-emerald-50
                  px-5 py-5 text-left hover:bg-emerald-100
                  flex items-center justify-between
                "
              >
                <span className="font-semibold text-base text-slate-900">QRIS</span>
                <RadioGroup value={method} onValueChange={(v) => setMethod(v as MethodKey)}>
                  <RadioGroupItem id="m-qris" value="qris" />
                </RadioGroup>
              </button>
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

/* ------- Helpers ------- */
function OptionRow({
  id,
  label,
  iconUrl,
  value,
}: {
  id: string;
  label: string;
  iconUrl?: string;
  value: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between rounded-lg border bg-white px-3 py-3 hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-sm overflow-hidden bg-slate-100 ring-1 ring-slate-200">
          {iconUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={iconUrl} alt={label} className="h-full w-full object-contain" />
          )}
        </div>
        <span className="text-sm text-slate-800">{label}</span>
      </div>
      <RadioGroupItem id={id} value={value} />
    </label>
  );
}
