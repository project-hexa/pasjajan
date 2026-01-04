"use client"

import { AspectRatio } from "@workspace/ui/components/aspect-ratio";
import {
  Card,
  CardContent
} from "@workspace/ui/components/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@workspace/ui/components/item";
import Image from "next/image";

export const RestoTopRatingSection = () => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-black">Resto Top Rating</h2>

      <div className="grid grid-cols-6 gap-4 pl-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden p-0">
            <CardContent className="p-0">
              <Item className="p-0">
                <ItemHeader className="bg-black">
                  <AspectRatio
                    ratio={16 / 9}
                    className="flex items-center justify-center"
                  >
                    <div className="relative h-16 w-20">
                      <Image
                        src={"/img/logo3.png"}
                        alt="logo-pasjajan"
                        fill
                        priority
                      />
                    </div>
                  </AspectRatio>
                </ItemHeader>
                <ItemContent className="px-4 pb-4">
                  <ItemTitle>PasJajan - Setiabudhi</ItemTitle>
                  <ItemDescription className="flex justify-between">
                    <span>Diskon 25%</span>
                    <span>Diskon Ongkir</span>
                  </ItemDescription>
                </ItemContent>
              </Item>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
