"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface Banner {
  id: string | number;
  image: string;
  title?: string;
  description?: string;
  link?: string;
}

interface HeroBannerProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
  itemsPerSlide?: number;
  hideOnSearch?: boolean;
}

export function HeroBanner({
  banners,
  autoPlay = true,
  interval = 5000,
  itemsPerSlide = 2,
  hideOnSearch = false,
}: HeroBannerProps) {
  const gridColsClass = React.useMemo(() => {
    switch (itemsPerSlide) {
      case 1:
        return "md:grid-cols-1";
      case 2:
        return "md:grid-cols-2";
      case 3:
        return "md:grid-cols-3";
      case 4:
        return "md:grid-cols-4";
      default:
        return "md:grid-cols-2";
    }
  }, [itemsPerSlide]);

  const slides = React.useMemo(() => {
    const chunkSize = Math.max(1, itemsPerSlide);
    const chunks: Banner[][] = [];

    for (let i = 0; i < banners.length; i += chunkSize) {
      chunks.push(banners.slice(i, i + chunkSize));
    }

    return chunks;
  }, [banners, itemsPerSlide]);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  }, [slides.length]);

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  React.useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [goToNext, autoPlay, interval, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full"
      aria-hidden={hideOnSearch}
    >
      <div
        className="w-full overflow-hidden rounded-2xl border border-white/40 bg-linear-to-br from-[#f9fbff] to-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)] transition-all duration-500 ease-in-out"
        style={{
          maxHeight: hideOnSearch ? "0px" : "720px",
          opacity: hideOnSearch ? 0 : 1,
          transform: hideOnSearch ? "translateY(-16px)" : "translateY(0)",
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div key={slideIndex} className="min-w-full">
              <div className={cn("grid grid-cols-1 gap-4 p-4 md:p-6", gridColsClass)}>
                {slide.map((banner) => (
                  <article
                    key={banner.id}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_15px_45px_-24px_rgba(0,0,0,0.5)]"
                  >
                    <img
                      src={banner.image}
                      alt={banner.title || "Banner"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {banner.link && (
                      <div className="absolute bottom-6 left-6">
                        <Button
                          asChild
                          className="bg-[#F9CF3D] text-[#1B1B1B] font-semibold tracking-wide hover:bg-[#f7c016]"
                        >
                          <a href={banner.link}>KLIK DI SINI</a>
                        </Button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 rounded-full border border-white/80 bg-white/90 p-3 shadow-md transition-all duration-500 ease-in-out hover:bg-white md:inline-flex",
              hideOnSearch && "opacity-0 -translate-y-4 pointer-events-none"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNext}
            className={cn(
              "absolute right-0 top-1/2 hidden -translate-y-1/2 -translate-x-1/2 rounded-full border border-white/80 bg-white/90 p-3 shadow-md transition-all duration-500 ease-in-out hover:bg-white md:inline-flex",
              hideOnSearch && "opacity-0 -translate-y-4 pointer-events-none"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      <div className={cn("mt-4 flex items-center gap-2 transition-all duration-500 ease-in-out", hideOnSearch && "opacity-0 -translate-y-2 pointer-events-none") }>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 bg-[#F54748]"
                : "w-2 bg-[#d9dbe0] hover:bg-[#c2c4c9]"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
