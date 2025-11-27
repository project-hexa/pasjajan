"use client"

import { useAuth } from "@/hooks/contollers/useAuth";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import Link from "next/link";

export function BottomBar() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex items-center justify-between gap-2 fixed bottom-0 w-full bg-background p-4 border-t-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] md:hidden">
      <Link href="">
        <Button variant={"ghost"} size={"icon"}>
          <Icon icon={"lucide:home"} width={24} />
        </Button>
      </Link>
      <Link href="">
        <Button variant={"ghost"} size={"icon"}>
          <Icon icon={"lucide:bell"} width={24} />
        </Button>
      </Link>
      <Link href={isLoggedIn ? "/profile" : "/login"}>
        <Button variant={"ghost"} size={"icon"}>
          <Icon icon={"lucide:user"} width={24} />
        </Button>
      </Link>
    </div>
  )
}
