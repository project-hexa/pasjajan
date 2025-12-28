import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
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
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Cart = () => {
  type CartItem = {
    id?: string | number;
    name?: string;
    variant?: string;
    price?: number;
    quantity?: number;
    image?: string;
  };

  const [items, setItems] = React.useState<CartItem[]>([]);
  const token = Cookies.get("token");

  const readCart = React.useCallback(() => {
    try {
      const raw = localStorage.getItem("pasjajan_cart");
      if (!raw) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(raw) as CartItem[];
      setItems(parsed || []);
    } catch (err) {
      console.error("Failed to read cart", err);
      setItems([]);
    }
  }, []);

  React.useEffect(() => {
    // If logged out, clear displayed cart (badge) while keeping localStorage intact.
    if (!token) {
      setItems([]);
      return;
    }

    readCart();
    const handler = () => readCart();
    window.addEventListener("cart_updated", handler as EventListener);
    return () =>
      window.removeEventListener("cart_updated", handler as EventListener);
  }, [readCart, token]);

  const totalCount = items.reduce(
    (acc, it) => acc + (Number(it.quantity) || 0),
    0,
  );

  return (
    <DropdownMenu>
      {/* Hapus satu DropdownMenuTrigger yang dobel */}
      <DropdownMenuTrigger asChild>
        <Button
          size={"icon"}
          // Tambahkan focus-visible:ring-0 untuk menghapus outline saat diklik
          className="hover:bg-primary/80 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
          variant={"ghost"}
        >
          <span className="relative flex items-center justify-center pr-5">
            <Icon
              icon="lucide:shopping-basket"
              width="24"
              height="24"
              className="scale: relative top-[1px] shrink-0 rounded-md stroke-[2.5px] p-2.5 transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
            />

            {totalCount > 0 && (
              <span className="border-primary absolute -top-1.5 -right-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 bg-red-600 text-[10px] font-bold text-white">
                {totalCount}
              </span>
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 bg-white p-0">
        <DropdownMenuLabel className="px-4 py-3">
          Keranjang Belanja
        </DropdownMenuLabel>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-400">Keranjang kosong</p>
            </div>
          ) : (
            <div className="p-2">
              {items.map((it, index) => (
                <DropdownMenuItem key={index} className="p-0">
                  <Link href={`/detail/${it.id || ""}`} className="w-full">
                    <Item>
                      <ItemMedia variant={"image"}>
                        <Image
                          src={
                            it.image || `https://placehold.co/100?text=Produk`
                          }
                          alt={it.name ?? ""}
                          width={80}
                          height={80}
                          unoptimized
                        />
                      </ItemMedia>
                      <ItemContent className="w-52">
                        <ItemTitle className="line-clamp-2 w-40">
                          {it.name}
                        </ItemTitle>
                        <ItemDescription className="text-sm">
                          {it.variant}
                        </ItemDescription>
                        <ItemFooter className="text-muted-foreground">
                          Rp {Number(it.price).toLocaleString()}
                        </ItemFooter>
                      </ItemContent>
                      <ItemContent>
                        <ItemDescription>Qty: {it.quantity}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button size={"sm"}>Checkout</Button>
                      </ItemActions>
                    </Item>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <Link href="/cart">
            <Button
              variant={"link"}
              className="text-primary hover:text-primary/80 h-auto p-0"
            >
              Lihat semua keranjang
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
