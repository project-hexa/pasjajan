"use client";

import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Icon } from "@workspace/ui/components/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const menuinOrder = [
  {
    label: "Status",
    link: "/my-orders/status",
  },
  {
    label: "Semua",
    link: "/my-orders/all",
  },
  {
    label: "Sedang dikirim",
    link: "/my-orders/delivery",
  },
  {
    label: "Telah diterima",
    link: "/my-orders/received",
  },
  {
    label: "Selesai",
    link: "/my-orders/finished",
  },
  {
    label: "Diulas",
    link: "/my-orders/reviewed",
  },
];

export default function MyOrdersLayout({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>

      <div className="flex w-max items-center gap-4">
        <InputGroup>
          <InputGroupAddon>
            <Icon icon="lucide:search" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Cari Pesananmu disini" />
        </InputGroup>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant={"outline"}>
              <Icon icon="solar:calendar-outline" />
              {date ? date.toLocaleDateString() : "Pilih Tanggal Pesanan"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto">
        {menuinOrder.map((menu, i) => (
          <Button
            key={i}
            onClick={() => router.push(menu.link)}
            variant={pathname === menu.link ? "secondary" : "outline"}
          >
            {menu.label}
          </Button>
        ))}
      </div>

      {children}
    </>
  );
}
