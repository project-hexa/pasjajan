import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import { Icon } from "@workspace/ui/components/icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Cart = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} className="p-0 text-white" variant={"ghost"}>
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
        <Link href="/cart">
          <Button variant={"link"}>Lihat semua keranjang</Button>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};