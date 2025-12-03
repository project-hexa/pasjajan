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

interface BackendPayment {
  id: number;
  code: string;            // gopay, shopeepay, va_bca, qris
  payment_type: string;    // e_wallet, bank_transfer, qris
  method_name: string;     // "BCA Virtual Account"
  icon: string;            // images/payment/bca.png
}

interface Props {
  trigger?: React.ReactNode;
  onConfirm?: (p: { method: string; option: string }) => void;
}

export default function PaymentMethodDialog({ trigger, onConfirm }: Props) {
  const [open, setOpen] = React.useState(false);
  const [methods, setMethods] = React.useState<BackendPayment[]>([]);

  // pilihan
  const [selectedMethod, setSelectedMethod] = React.useState<string>();
  const [selectedOption, setSelectedOption] = React.useState<string>();

  // Ambil dari backend
  React.useEffect(() => {
    fetch("http://localhost:8000/api/payment-methods")
      .then((res) => res.json())
      .then((res) => {
        setMethods(res.data.payment_methods);
      })
      .catch(console.error);
  }, []);

  const confirm = () => {
    if (!selectedMethod || !selectedOption) return setOpen(false);

    onConfirm?.({
      method: selectedMethod,   // e_wallet | bank_transfer | qris
      option: selectedOption,   // gopay | va_bca | qris
    });

    setOpen(false);
  };

  // kelompokkan metode
  const wallets = methods.filter((m) => m.payment_type === "e_wallet");
  const vas = methods.filter((m) => m.payment_type === "bank_transfer");
  const qris = methods.filter((m) => m.payment_type === "qris");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="p-0 border-0 shadow-xl bg-transparent w-[480px] h-[400px] max-w-[92vw] flex flex-col">
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

            {/* E-WALLET */}
            <Accordion type="single" collapsible>
              <AccordionItem value="ewallet">
                <AccordionTrigger className="rounded-xl border shadow-sm bg-emerald-50 px-5 py-5">
                  <span className="font-semibold text-base">E-Wallet</span>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="mt-2 rounded-xl border p-2">
                    <RadioGroup value={selectedOption}>
                      {wallets.map((m) => (
                        <OptionRow
                          key={m.code}
                          label={m.method_name}
                          iconUrl={`http://localhost:8000/${m.icon}`}
                          value={m.code}
                          selectedValue={selectedOption}
                          onSelect={() => {
                            setSelectedMethod("e_wallet");
                            setSelectedOption(m.code);
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* VA */}
            <Accordion type="single" collapsible>
              <AccordionItem value="va">
                <AccordionTrigger className="rounded-xl border shadow-sm bg-emerald-50 px-5 py-5">
                  <span className="font-semibold text-base">
                    Virtual Account
                  </span>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="mt-2 rounded-xl border p-2">
                    <RadioGroup value={selectedOption}>
                      {vas.map((m) => (
                        <OptionRow
                          key={m.code}
                          label={m.method_name}
                          iconUrl={`http://localhost:8000/${m.icon}`}
                          value={m.code}
                          selectedValue={selectedOption}
                          onSelect={() => {
                            setSelectedMethod("bank_transfer");
                            setSelectedOption(m.code);
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* QRIS */}
            {qris.length > 0 && (
              <OptionRow
                label={qris[0].method_name}
                iconUrl={`http://localhost:8000/${qris[0].icon}`}
                value="qris"
                selectedValue={selectedOption}
                onSelect={() => {
                  setSelectedMethod("qris");
                  setSelectedOption("qris");
                }}
              />
            )}
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

function OptionRow({
  label,
  iconUrl,
  value,
  selectedValue,
  onSelect,
}: {
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
        "flex items-center justify-between rounded-lg border bg-white px-3 py-3 cursor-pointer",
        selectedValue === value && "border-emerald-300 bg-emerald-50"
      )}
    >
      <div className="flex items-center gap-3">
        <img src={iconUrl} className="h-6 w-6" />
        <span className="text-sm">{label}</span>
      </div>

      <RadioGroupItem checked={selectedValue === value} value={value} />
    </div>
  );
}
