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
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Icon } from "@workspace/ui/components/icon";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

interface BackendPayment {
  id: number;
  code: string; // gopay, shopeepay, va_bca, qris
  category: string; // e_wallet, bank_transfer, qris
  name: string; // "BCA Virtual Account"
  icon: string; // full URL: http://localhost:8000/images/payment/bca.png
  fee: string;
  min_amount: number;
  max_amount: number;
}

interface Props {
  trigger?: React.ReactNode;
  onConfirm?: (p: { method: string; option: string; name: string }) => void;
}

export default function PaymentMethodDialog({ trigger, onConfirm }: Props) {
  const [open, setOpen] = React.useState(false);
  const [methods, setMethods] = React.useState<BackendPayment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // pilihan
  const [selectedMethod, setSelectedMethod] = React.useState<string>();
  const [selectedOption, setSelectedOption] = React.useState<string>();
  const [selectedName, setSelectedName] = React.useState<string>();

  // Ambil dari backend
  React.useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:8000/api/payment-methods")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch payment methods");
        return res.json();
      })
      .then((res) => {
        if (res.success && res.data.payment_methods) {
          setMethods(res.data.payment_methods);
        } else {
          throw new Error("Invalid response format");
        }
      })
      .catch((err) => {
        console.error("Error fetching payment methods:", err);
        setError("Gagal memuat metode pembayaran");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const confirm = () => {
    if (!selectedMethod || !selectedOption || !selectedName)
      return setOpen(false);

    onConfirm?.({
      method: selectedMethod, // e_wallet | bank_transfer | qris
      option: selectedOption, // gopay | va_bca | qris
      name: selectedName, // "BCA Virtual Account" | "GoPay" | "QRIS (Semua E-Wallet)"
    });

    setOpen(false);
  };

  // kelompokkan metode
  const wallets = methods.filter((m) => m.category === "e_wallet");
  const vas = methods.filter((m) => m.category === "bank_transfer");
  const qris = methods.filter((m) => m.category === "qris");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="flex h-[400px] w-[480px] max-w-[92vw] flex-col border-0 bg-transparent p-0 shadow-xl"
      >
        <DialogTitle className="sr-only">Pilih Metode Pembayaran</DialogTitle>

        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white">
          {/* HEADER */}
          <div className="relative flex h-[48px] items-center justify-center border-b bg-white">
            <button
              onClick={() => setOpen(false)}
              className="absolute left-4 grid h-8 w-8 place-items-center rounded-full text-slate-800 hover:bg-slate-100"
            >
              <Icon icon="lucide:arrow-left" width={16} height={16} />
            </button>
            <p className="text-sm font-semibold text-slate-900">
              Pilih Metode Pembayaran
            </p>
          </div>

          {/* BODY */}
          <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-3">
            {/* Loading State */}
            {loading && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">
                  Memuat metode pembayaran...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-emerald-700 hover:underline"
                >
                  Muat ulang halaman
                </button>
              </div>
            )}

            {/* Payment Methods */}
            {!loading && !error && (
              <>
                {/* E-WALLET */}
                {wallets.length > 0 && (
                  <Accordion type="single" collapsible className="mb-3">
                    <AccordionItem value="ewallet">
                      <AccordionTrigger className="rounded-xl border bg-white px-5 py-5 shadow-sm">
                        <span className="text-base font-semibold">
                          Dompet Digital
                        </span>
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="mt-2 rounded-xl border p-2">
                          <RadioGroup value={selectedOption}>
                            {wallets.map((m) => (
                              <OptionRow
                                key={m.code}
                                label={m.name}
                                iconUrl={m.icon}
                                value={m.code}
                                selectedValue={selectedOption}
                                onSelect={() => {
                                  setSelectedMethod("e_wallet");
                                  setSelectedOption(m.code);
                                  setSelectedName(m.name);
                                }}
                              />
                            ))}
                          </RadioGroup>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* VA */}
                {vas.length > 0 && (
                  <Accordion type="single" collapsible className="mb-3">
                    <AccordionItem value="va">
                      <AccordionTrigger className="rounded-xl border bg-white px-5 py-5 shadow-sm">
                        <span className="text-base font-semibold">
                          Bank Transfer
                        </span>
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="mt-2 rounded-xl border p-2">
                          <RadioGroup value={selectedOption}>
                            {vas.map((m) => (
                              <OptionRow
                                key={m.code}
                                label={m.name}
                                iconUrl={m.icon}
                                value={m.code}
                                selectedValue={selectedOption}
                                onSelect={() => {
                                  setSelectedMethod("bank_transfer");
                                  setSelectedOption(m.code);
                                  setSelectedName(m.name);
                                }}
                              />
                            ))}
                          </RadioGroup>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* QRIS */}
                {qris.length > 0 && (
                  <RadioGroup value={selectedOption}>
                    <div
                      onClick={() => {
                        setSelectedMethod("qris");
                        setSelectedOption("qris");
                        setSelectedName(qris[0]?.name || "QRIS");
                      }}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xl border bg-white px-5 py-5 shadow-sm",
                        selectedOption === "qris" &&
                          "border-emerald-300 bg-emerald-50",
                      )}
                    >
                      <span className="text-base font-semibold">QRIS</span>
                      <RadioGroupItem
                        checked={selectedOption === "qris"}
                        value="qris"
                      />
                    </div>
                  </RadioGroup>
                )}

                {/* Empty State */}
                {methods.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-gray-500">
                      Tidak ada metode pembayaran tersedia
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex h-[60px] items-center justify-end bg-emerald-800 px-5">
            <Button
              onClick={confirm}
              className="min-w-[90px] bg-yellow-400 font-semibold text-slate-900 hover:bg-yellow-300"
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
        "flex cursor-pointer items-center justify-between rounded-lg border bg-white px-3 py-3",
        selectedValue === value && "border-emerald-300 bg-emerald-50",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center">
          <Image
            src={iconUrl || ""}
            alt={label}
            className="max-h-full max-w-full object-contain"
            width={32}
            height={32}
          />
        </div>
        <span className="text-sm">{label}</span>
      </div>

      <RadioGroupItem checked={selectedValue === value} value={value} />
    </div>
  );
}
