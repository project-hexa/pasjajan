"use client";

import { useAuth } from "@/hooks/contollers/useAuth";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "./auth/logout";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/contollers/useUser";

export const Navbar = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

        <div className="flex w-full">
          <ButtonGroup className="w-full [&>*:not(:first-child)]:-ml-5 [&>*:not(:first-child)]:rounded-bl-full">
            <Input
              placeholder="Cari produk yang anda inginkan disini"
              className="bg-card w-full rounded-full placeholder:max-sm:text-xs"
            />
            <Button className="rounded-full border-t border-r border-b">
              <Icon icon="lucide:search" className="size-4" />
            </Button>
          </ButtonGroup>
        </div>

        <div className="flex h-10 items-center gap-2 max-sm:hidden">
          <div className="flex items-center">
            <Link href="/promo">
              <Button variant={"link"} className="text-white">
                Promo
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size={"icon"}
                  className="p-0 text-white"
                  variant={"ghost"}
                >
                  <Icon icon="lucide:shopping-basket" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card text-accent-foreground">
                <DropdownMenuLabel className="text-muted-foreground">
                  Keranjang Belanja
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="h-80 overflow-y-auto">
                  {[...Array.from({ length: 5 })].map((_, index) => (
                    <DropdownMenuItem key={index}>
                      <Link href={`/detail/produk-${index + 1}`}>
                        <Item>
                          <ItemMedia variant={"image"}>
                            <Image
                              src={`https://placehold.co/100?text=Produk${index + 1}`}
                              alt={`gambar produk ${index + 1}`}
                              width={100}
                              height={100}
                              unoptimized
                            />
                          </ItemMedia>
                          <ItemContent className="w-60">
                            <ItemTitle className="line-clamp-2 w-36">
                              Produk {index + 1}
                            </ItemTitle>
                            <ItemDescription>
                              Deskripsi produk {index + 1}
                            </ItemDescription>
                            <ItemFooter className="text-muted-foreground">
                              Rp 10.000
                            </ItemFooter>
                          </ItemContent>
                          <ItemContent>
                            <ItemDescription>Qty: 1</ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <Button>Checkout</Button>
                          </ItemActions>
                        </Item>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <Button variant={"link"}>Lihat semua keranjang</Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator orientation="vertical" />
          {!isLoggedIn ? (
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
                <Button
                  variant={"ghost"}
                  className="text-primary-foreground"
                >
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
