"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Item, ItemContent, ItemMedia } from "@workspace/ui/components/item";
import Image from "next/image";

export default function AllOrderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="sr-only">All Order</CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <span className="text-sm">25 November 2025</span>
            <Badge variant={"secondary"} className="rounded-md">
              Selesai
            </Badge>
          </div>
          <span className="text-sm">INV/2025/PPL/123456789</span>
        </div>
      </CardHeader>

      <CardContent>
        <Item>
          <ItemMedia>
            <Image
              src="/img/catalogue/Screenshot 2025-10-25 190505.png"
              alt="produk"
              width={32}
              height={32}
            />
          </ItemMedia>
          <ItemContent>
            <span>Teh Kotak</span>
            <span>Total: 2 Pesanan</span>
          </ItemContent>
          <span>Total Belanja Rp.30.000</span>
        </Item>
      </CardContent>

      <CardFooter className="justify-between">
        <Button variant={"link"}>Lihat Detail Pesanan</Button>
        <Button>Beli Lagi</Button>
      </CardFooter>
    </Card>
  );
}
