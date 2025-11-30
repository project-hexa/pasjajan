"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { ChevronLeft, MapPin } from "lucide-react";

interface Address {
  id: string;
  label: string;
  name: string;
  address: string;
  phone: string;
}

const ADDRESSES: Address[] = [
  {
    id: "home",
    label: "Alamat Pengiriman",
    name: "Rumah – John Doe",
    address: "Jln. Setiabudhi No. 676, Kec. Sukasari, Kel. Sukasuka, Kota Bandung, Jawa Barat, 40616",
    phone: "0888888888",
  },
  {
    id: "office",
    label: "Alamat Pengiriman",
    name: "Kantor – diki",
    address: "Jln. Gegerkalong No. 73125, Kec. Sukasari, Kel. Sukajadi, Kota Bandung, Jawa Barat, 40153",
    phone: "1234567890",
  },
];

export default function AddressDialog({
  trigger,
  onSelect,
}: {
  trigger: React.ReactNode;
  onSelect: (item: Address) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  const confirm = () => {
    const picked = ADDRESSES.find((a) => a.id === selected);
    if (picked) onSelect(picked);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ← support trigger yang kamu buat sendiri */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="
          p-0 border-0 shadow-xl bg-transparent
          w-[480px] h-[400px] max-w-[92vw]
          flex flex-col items-stretch
        "
      >
        <DialogTitle className="sr-only">Pilih Alamat</DialogTitle>

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
            <p className="text-sm font-semibold text-slate-900">Pilih Alamat</p>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-none">
            <RadioGroup value={selected} onValueChange={setSelected}>
              <div className="flex flex-col gap-4">
                {ADDRESSES.map((addr) => (
                  <label
                    key={addr.id}
                    htmlFor={addr.id}
                    className="flex justify-between items-start p-4 border rounded-xl bg-white shadow-sm hover:bg-emerald-50 cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-emerald-700 font-semibold text-sm">
                        {addr.label}
                      </p>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-emerald-700 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{addr.name}</p>
                          <p className="text-slate-700 text-xs leading-snug">{addr.address}</p>
                          <p className="text-slate-700 text-xs mt-1">{addr.phone}</p>
                        </div>
                      </div>
                    </div>
                    <RadioGroupItem id={addr.id} value={addr.id} />
                  </label>
                ))}
              </div>
            </RadioGroup>
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
