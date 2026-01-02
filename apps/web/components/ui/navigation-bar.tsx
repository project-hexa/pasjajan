"use client";

import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { useNavigate } from "@/hooks/useNavigate";
import { Button } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink
} from "@workspace/ui/components/navigation-menu";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";
import { Cart } from "./cart";
import { SearchInput } from "./search-input";
import { UserDropdown } from "./user-dropdown";
import { Category } from "@/app/(modul 2 - catalogue)/_components/category";

export const Navbar = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  return (
    <nav className={`bg-primary border-b border-purple-200 ${className}`}>
      <NavigationMenu className="max-w-full list-none gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/"
            className="flex flex-col items-center text-xs font-bold text-white hover:bg-transparent hover:text-white md:text-sm"
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
          </NavigationMenuLink>
        </NavigationMenuItem>

        <Category />

        <NavigationMenuItem className="flex-1">
          <SearchInput variant="home" />
        </NavigationMenuItem>

        <div className="flex h-10 items-center gap-2 max-sm:hidden">
          <NavigationMenuItem>
            <div className="flex items-center gap-5">
              <NavigationMenuLink href="/promo" asChild>
                <Button
                  variant={"ghost"}
                  className="flex items-center text-white transition-all hover:scale-105 hover:bg-white/10 hover:text-white max-sm:hidden"
                >
                  <span className="pt-1 font-medium">Promo</span>
                </Button>
              </NavigationMenuLink>
              <Cart />
            </div>
          </NavigationMenuItem>

          <Separator orientation="vertical" />

          <NavigationMenuItem>
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
          </NavigationMenuItem>
        </div>
      </NavigationMenu>
    </nav>
  );
};
