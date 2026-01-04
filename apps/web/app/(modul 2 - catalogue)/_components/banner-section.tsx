"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import Image from "next/image";
import { AspectRatio } from "@workspace/ui/components/aspect-ratio";
import { Button } from "@workspace/ui/components/button";
import { useEffect, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

export const BannerSection = () => {
  const [listCarousel, setListCarousel] = useState<CarouselApi>();
  const [currentListShow, setCurrentListShow] = useState<number>(0);
  const [countCurrent, setCountCurrent] = useState(0);

  useEffect(() => {
    if (!listCarousel) return;

    setCountCurrent(listCarousel.scrollSnapList().length);
    setCurrentListShow(listCarousel.selectedScrollSnap() + 1);

    listCarousel.on("select", () => {
      setCurrentListShow(listCarousel.selectedScrollSnap() + 1);
    });
  }, [listCarousel]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Carousel className="w-full" setApi={setListCarousel}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden p-0">
                <CardContent className="relative p-0">
                  <AspectRatio ratio={16 / 9} className="relative">
                    <Image
                      src={`https://placehold.co/600x300/png?text=Banner-${index + 1}`}
                      alt="banner"
                      fill
                      priority
                    />
                  </AspectRatio>
                  <Button
                    variant={"secondary"}
                    className="absolute inset-x-0 bottom-0 w-full"
                  >
                    Klik disini
                  </Button>
                  <div className="border-card text-primary-foreground absolute right-5 bottom-0 flex flex-col rounded-t-2xl border-2 bg-red-800 px-4 py-2 text-center uppercase shadow-[-15px_5px_10px_-5px_rgba(0,0,0,0.3)]">
                    <span className="text-xs font-bold">Bebas Ongkir</span>
                    <span className="text-xs font-bold">Sepuasnya!!!</span>
                    <span className="text-[0.5rem]">Dikirm dari PasjaJan</span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-5" />
        <CarouselNext className="right-5" />
      </Carousel>
      <div className="flex gap-1 self-start">
        {Array.from({ length: countCurrent }).map((_, i) => (
          <Button
            key={i}
            size={"icon"}
            className={cn(
              "size-3 rounded-full",
              currentListShow === i + 1 ? "bg-primary" : "bg-muted",
            )}
            onClick={() => {
              listCarousel?.scrollTo(i);
            }}
          />
        ))}
      </div>
    </div>
  );
};
