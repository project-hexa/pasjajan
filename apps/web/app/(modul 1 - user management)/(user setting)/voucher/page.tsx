import { Badge } from "@workspace/ui/components/badge";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemHeader
} from "@workspace/ui/components/item";
import Image from "next/image";

export default function VoucherPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Tukar Poin</h1>

      <Badge className="bg-card rounded-md text-xl text-black shadow-2xl">
        <Image
          src="/img/icon-poin.png"
          alt="icon poin"
          width={32}
          height={32}
        />
        4.000
      </Badge>

      <ItemGroup className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Item key={i} variant={"outline"} className="p-0">
            <ItemHeader>
              <Image
                src={"https://placehold.co/300x200/png?text=voucher%20ongkir"}
                alt="voucher ongkir"
                width={300}
                height={200}
                className="aspect-video w-full object-cover"
              />
            </ItemHeader>
            <ItemContent className="flex-row justify-between p-4">
              <span>Gratis Ongkir Minimal Belanja 100RB</span>
              <Badge
                variant={"outline"}
                className="border-primary text-primary rounded-xs text-xl"
              >
                500
              </Badge>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </>
  );
}
