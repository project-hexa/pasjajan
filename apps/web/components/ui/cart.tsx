import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";

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
  const { token } = useAuthStore();

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
    return () => window.removeEventListener("cart_updated", handler as EventListener);
  }, [readCart, token]);

  const totalCount = items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} className="p-0 text-white" variant={"ghost"} suppressHydrationWarning>
          <div className="relative">
            <Icon icon="lucide:shopping-basket" />
            {totalCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {totalCount}
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card text-accent-foreground">
        <DropdownMenuLabel className="text-muted-foreground">
          Keranjang Belanja
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="h-80 w-96 overflow-y-auto p-2">
          {items.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">Keranjang kosong</div>
          )}

          {items.map((it, index) => (
            <DropdownMenuItem key={index} className="p-0">
              <Link href={`/detail/${it.id || ""}`} className="w-full">
                <Item>
                  <ItemMedia variant={"image"}>
                    <Image
                      src={it.image || `https://placehold.co/100?text=Produk`}
                      alt={it.name ?? ""}
                      width={80}
                      height={80}
                      unoptimized
                    />
                  </ItemMedia>
                  <ItemContent className="w-52">
                    <ItemTitle className="line-clamp-2 w-40">{it.name}</ItemTitle>
                    <ItemDescription className="text-sm">{it.variant}</ItemDescription>
                    <ItemFooter className="text-muted-foreground">Rp {Number(it.price).toLocaleString()}</ItemFooter>
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
        <DropdownMenuSeparator />
        <Link href="/cart">
          <Button variant={"link"}>Lihat semua keranjang</Button>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};