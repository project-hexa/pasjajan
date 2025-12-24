"use client";

import { useNavigate } from "@/hooks/useNavigate";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { Icon } from "@workspace/ui/components/icon";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useUserStore } from "../_stores/useUserStore";

export default function UserSettingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUserStore();
  const pathname = usePathname();
  const navigate = useNavigate();
  const [accountTrigger, setAccountTrigger] = useState<boolean>(false);
  const accountPage = pathname === "/profile" || pathname === "/address";

  useEffect(() => {
    if (accountPage) {
      setAccountTrigger(true);
    }

    return () => setAccountTrigger(false);
  }, [accountPage]);

  return (
    <div className="bg-primary flex min-h-[calc(100vh-306px)]">
      <div className="flex w-80 flex-col gap-8 p-5 pr-0">
        <div className="from-background/20 text-primary-foreground flex items-center justify-start gap-5 rounded-full bg-gradient-to-r from-0% via-transparent via-40% to-transparent to-60% p-1 font-bold">
          <Avatar>
            <AvatarFallback>{`${user?.full_name?.charAt(0) ?? "U"}${user?.full_name?.split(" ")[1]?.charAt(0) ?? ""}`}</AvatarFallback>
            <AvatarImage
              src={user?.avatar}
              alt={`avatar ${user?.full_name || "user profile"}`}
            />
          </Avatar>
          <span>{user?.full_name}</span>
        </div>
        <div className="flex flex-col gap-4">
          <Collapsible
            open={accountTrigger}
            onOpenChange={setAccountTrigger}
            className={cn(
              "flex flex-col justify-start rounded-4xl px-2 py-4 transition-all",
              accountPage
                ? "bg-background text-primary rounded-r-none"
                : "from-background/20 w-3/4 bg-gradient-to-l from-0% via-transparent via-40% to-transparent to-60%",
              accountTrigger && "bg-background text-primary",
            )}
          >
            <CollapsibleTrigger
              className={cn(
                "flex cursor-pointer items-center justify-start gap-5 py-1",
                !accountPage && !accountTrigger && "text-white",
              )}
            >
              <Icon icon="lucide:circle-user-round" className="text-3xl" />
              <span>Akun Saya</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="w-max space-y-2 pl-5">
              <Button
                variant={pathname === "/profile" ? "outline" : "default"}
                className={cn(
                  "w-full justify-start rounded-full px-2",
                  pathname === "/profile" && "border-primary bg-card",
                )}
                onClick={() => navigate.push("/profile")}
              >
                Profile
              </Button>
              <Button
                variant={pathname === "/address" ? "outline" : "default"}
                className={cn(
                  "w-full justify-start rounded-full px-2",
                  pathname === "/address" && "border-primary bg-card",
                )}
                onClick={() => navigate.push("/address")}
              >
                Alamat
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {[
            {
              icon: "majesticons:box-line",
              link: "/my-orders/all",
              label: "Pesanan Saya",
            },
            {
              icon: "mdi:voucher-outline",
              link: "/voucher",
              label: "Voucher",
            },
          ].map((btnMenu, i) => (
            <Button
              key={i}
              variant={pathname === btnMenu.link ? "outline" : "default"}
              className={cn(
                "w-3/4 justify-start gap-5 rounded-full p-1",
                pathname === btnMenu.link
                  ? "border-primary bg-card text-primary"
                  : "from-background/20 bg-gradient-to-r from-0% via-transparent via-40% to-transparent to-60%",
              )}
              onClick={() => navigate.push(btnMenu.link)}
            >
              <Icon icon={btnMenu.icon} className="text-3xl" />
              <span>{btnMenu.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-background flex flex-1 flex-col gap-5 rounded-l-4xl p-5">
        {children}
      </div>
    </div>
  );
}
