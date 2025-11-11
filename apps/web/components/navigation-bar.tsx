"use client";

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
import { Input } from "@workspace/ui/components/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle
} from "@workspace/ui/components/item";
import { ModeToggle } from "@workspace/ui/components/mode-toggle";
import { Separator } from "@workspace/ui/components/separator";
import { Grid2X2, Search, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <header className={`bg-primary h-20 w-full border-2 ${className}`}>
      <nav className="flex h-full items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src={"/logo.png"} alt="logo" width={64} height={64} />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="p-0">
                <Grid2X2 />
                Kategori
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card text-accent-foreground">
              <DropdownMenuItem>Category 1</DropdownMenuItem>
              <DropdownMenuItem>Category 2</DropdownMenuItem>
              <DropdownMenuItem>Category 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ButtonGroup>
            <Input
              placeholder="Cari produk yang anda inginkan disini"
              className="bg-card w-96"
            />
            <Button variant={"secondary"} size={"icon"}>
              <Search />
            </Button>
          </ButtonGroup>
        </div>

        <div className="flex h-10 items-center gap-2">
          <ModeToggle />
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
                  <ShoppingBasket />
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
          <ButtonGroup>
            <Button
              variant={"outline"}
              onClick={() => router.push("/register")}
            >
              Daftar
            </Button>
            <Button variant={"secondary"} onClick={() => router.push("/login")}>
              Masuk
            </Button>
          </ButtonGroup>
        </div>
      </nav>
    </header>
  );
};
