"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Icon } from "@workspace/ui/components/icon";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "../../app/(modul 1 - user management)/_components/logout";
import { Cart } from "./cart";
import { Search } from "./search";

export const Navbar = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { user, token } = useAuthStore();

  return (
    <header className={`bg-primary h-20 w-full border-2 ${className}`}>
      <nav className="flex h-full items-center justify-between gap-5 px-4 md:px-10 lg:gap-10">
        <Link
          href="/"
          className="flex flex-col items-center text-xs font-bold text-white md:text-sm"
        >
          <Image
            src={"/logo.png"}
            alt="logo"
            width={64}
            height={64}
            sizes="50vw"
            className="max-md:size-1/2"
          />
          PasJajan
        </Link>

        <Search />

        <div className="flex h-10 items-center gap-2 max-sm:hidden">
          <div className="flex items-center gap-2">
            <Link href="/promo">
              <Button variant={"link"} className="text-white">
                Promo
              </Button>
            </Link>
            <Cart />
          </div>

          <Separator orientation="vertical" />

          {!token ? (
            <div className="ml-2 flex items-center gap-5">
              <Button
                variant={"link"}
                className="text-white"
                onClick={() => router.push("/register")}
              >
                Daftar
              </Button>
              <Button
                variant={"link"}
                className="text-white"
                onClick={() => router.push("/login")}
              >
                Masuk
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="text-primary-foreground">
                  {user?.full_name}
                  <Icon icon="lucide:user" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-primary">
                <DropdownMenuItem>
                  <Icon icon="lucide:settings" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon icon={"ic:outline-discount"} /> Transaksi & Poin
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
};
