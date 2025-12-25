"use client";

import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { useNavigate } from "@/hooks/useNavigate";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";
import Link from "next/link";
import { Cart } from "./cart";
import { Search } from "./search";
import { UserDropdown } from "./user-dropdown";

export const Navbar = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  return (
    <header className={`bg-primary h-20 w-full border-2 ${className}`}>
      <nav className="flex h-full items-center justify-between gap-5 px-4 md:px-10 lg:gap-10">
        <Link
          href="/"
          className="flex flex-col items-center text-xs font-bold text-white md:text-sm"
        >
          <Image
            src={"/img/logo.png"}
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

          {!isLoggedIn ? (
            <div className="ml-2 flex items-center gap-5">
              <Button
                variant={"link"}
                className="text-white"
                onClick={() => navigate.push("/register")}
              >
                Daftar
              </Button>
              <Button
                variant={"link"}
                className="text-white"
                onClick={() => navigate.push("/login")}
              >
                Masuk
              </Button>
            </div>
          ) : (
            <UserDropdown />
          )}
        </div>
      </nav>
    </header>
  );
};
