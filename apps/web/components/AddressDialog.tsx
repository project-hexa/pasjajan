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
import { Icon } from "@workspace/ui/components/icon";


export interface Address {
  id: string | number;
  label: string;
  name: string;
  address: string;
  phone: string;
}

interface AddressDialogProps {
  trigger: React.ReactNode;
  onSelect: (item: Address) => void;
  addresses: Address[];
  loading?: boolean;
}

export default function AddressDialog({
  trigger,
  onSelect,
  addresses,
  loading = false,
}: AddressDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  const confirm = () => {
    const picked = addresses.find((a) => a.id.toString() === selected);
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
              <Icon icon="lucide:chevron-left" className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold text-slate-900">Pilih Alamat</p>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-none">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Icon icon="lucide:loader-2" className="h-8 w-8 text-emerald-600 animate-spin" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Icon icon="lucide:map-pin-off" className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">Belum ada alamat tersimpan</p>
                <p className="text-gray-400 text-xs mt-1">Tambahkan alamat di pengaturan profil</p>
              </div>
            ) : (
              <RadioGroup value={selected} onValueChange={setSelected}>
                <div className="flex flex-col gap-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      htmlFor={addr.id.toString()}
                      className="flex justify-between items-start p-4 border rounded-xl bg-white shadow-sm hover:bg-emerald-50 cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-emerald-700 font-semibold text-sm">
                          Alamat Pengiriman
                        </p>
                        <div className="flex items-start gap-2">
                          <Icon icon="lucide:map-pin" className="h-5 w-5 text-emerald-700 mt-0.5" />
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{addr.name}</p>
                            <p className="text-slate-700 text-xs leading-snug">{addr.address}</p>
                            <p className="text-slate-700 text-xs mt-1">{addr.phone}</p>
                          </div>
                        </div>
                      </div>
                      <RadioGroupItem id={addr.id.toString()} value={addr.id.toString()} />
                    </label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* FOOTER */}
          <div className="h-[60px] bg-emerald-800 flex justify-end items-center px-5">
            <Button
              onClick={confirm}
              disabled={!selected || addresses.length === 0}
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
