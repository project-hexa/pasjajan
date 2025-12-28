"use client";

import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { useNavigate } from "@/hooks/useNavigate";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";
import Link from "next/link";
import { Cart } from "./cart";
import { SearchInput } from "./search-input";
import { UserDropdown } from "./user-dropdown";
import { CategoryDropdown } from "./category-dropdown";

export const Navbar = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  return (
    <header
      className={`bg-primary h-20 w-full border-b border-purple-200 ${className}`}
    >
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

        <CategoryDropdown />

        <SearchInput variant="home" />

        <div className="flex h-10 items-center gap-2 max-sm:hidden">
          <div className="flex items-center gap-5">
            <Link href="/promo">
              <Button
                variant={"ghost"}
                className="flex items-center text-white transition-all hover:scale-105 hover:bg-white/10 hover:text-white max-sm:hidden"
              >
                <span className="pt-1 font-medium">Promo</span>
              </Button>
            </Link>
            <Cart />
          </div>

          <Separator orientation="vertical" className="bg-white/20" />

          {!isLoggedIn ? (
            <div className="ml-2 flex items-center gap-2">
              <Button
                variant={"ghost"}
                className="text-white transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
                onClick={() => navigate.push("/register")}
              >
                Daftar
              </Button>
              <Button
                variant={"ghost"}
                className="text-white transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
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
