"use client";

import { Icon } from "@workspace/ui/components/icon";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    name: "Produk",
    href: "/dashboard/products",
    icon: "icon-park-outline:ad-product",
  },
];

export function Sidebar() {
  const pathName = usePathname();

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
      <div className="flex items-center gap-4 px-4">
        <Image
          src="https://dummyimage.com/120x120/000/fff&text=A"
          width={32}
          height={32}
          alt="Dashboard Image"
          className="h-8 w-8 flex-shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-medium">Admin PasJajan</h3>
          <span className="line-clamp-1 text-sm text-gray-500">
            admin@pasjajan.com
          </span>
        </div>
      </div>
    </aside>
  );
}
