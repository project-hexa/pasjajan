"use client";

import { UserDropdown } from "@/components/ui/user-dropdown";
import { Icon } from "@workspace/ui/components/icon";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "lucide:shopping-cart",
  },
  {
    name: "Analitik Pelanggan",
    href: "/dashboard/customers-analytics",
    icon: "lucide:user-round",
  },
  {
    name: "Poin Pelanggan",
    href: "/dashboard/customer-points",
    icon: "lucide:coins",
  },
  {
    name: "Notifikasi",
    href: "/dashboard/notifications",
    icon: "lucide:bell",
  },
  {
    name: "Data Cabang",
    href: "/dashboard/branch-data",
    icon: "lucide:store",
  },
  {
    name: "Log Aktivitas",
    href: "/dashboard/activity-log",
    icon: "lucide:history",
  },
  {
    name: "Promo",
    href: "/dashboard/promo",
    icon: "lucide:tag",
  },
  {
    name: "Data Pengguna",
    href: "/dashboard/users",
    icon: "lucide:user-round",
  },
  {
    name: "Voucher",
    href: "/dashboard/vouchers",
    icon: "lucide:ticket",
  },
  {
    name: "Produk",
    href: "/dashboard/products",
    icon: "icon-park-outline:ad-product",
  },
  {
    name: "Delivery",
    href: "/dashboard/delivery",
    icon: "lucide:truck",
  },
  {
    name: "Order",
    href: "/dashboard/orders",
    icon: "lucide:shopping-bag",
  },
];

export function Sidebar() {
  const pathName = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render skeleton during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <aside className="sticky top-[100px] flex h-[calc(100vh-116px)] flex-col gap-4 rounded-3xl bg-[#F7FFFB] py-8">
        <h2 className="px-4 text-nowrap">Dashboard Summary</h2>
        <ul className="flex-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <div className="relative flex items-center gap-2 px-4 py-2">
                <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
                <span className="text-gray-400">{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 px-4">
          <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-lg bg-gray-200" />
          <div className="min-w-0 flex-1">
            <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky top-[100px] flex h-[calc(100vh-116px)] flex-col gap-4 rounded-3xl bg-[#F7FFFB] py-8">
      <h2 className="px-4 text-nowrap">Dashboard Summary</h2>
      <ul className="flex-1">
        {navigation.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:bg-[#B9DCCC]",
                {
                  "bg-[#B9DCCC]": pathName === item.href,
                },
              )}
            >
              <Icon icon={item.icon} />
              {item.name}
              <div
                className={cn(
                  "absolute top-1/2 right-0 h-1/2 w-1 -translate-y-1/2 rounded-full bg-[#1E8F59]",
                  {
                    hidden: pathName !== item.href,
                  },
                )}
              />
            </Link>
          </li>
        ))}
      </ul>
      <UserDropdown />
    </aside>
  );
}
