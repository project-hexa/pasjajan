"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

interface RestaurantCard {
  id: string | number;
  title: string;
  image: string;
  offers?: string[];
}

interface TopRatedCarouselProps {
  restaurants: RestaurantCard[];
  showHeading?: boolean;
  showSeeAll?: boolean;
}

export function TopRatedCarousel({ restaurants, showHeading = true, showSeeAll = true }: TopRatedCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    const node = scrollContainerRef.current;
    if (!node) return;

    const cardWidth = node.firstElementChild?.clientWidth ?? 240;
    const offset = direction === "left" ? -cardWidth * 2 : cardWidth * 2;

    node.scrollTo({ left: node.scrollLeft + offset, behavior: "smooth" });
  };

  if (restaurants.length === 0) return null;

  return (
    <section className="relative">
      {showHeading && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[26px] font-semibold text-[#33363F]">Resto Top Rating</h2>
          </div>
          {showSeeAll && (
            <button
              onClick={() => scrollBy("right")}
              className="hidden h-11 items-center gap-2 rounded-full border border-[#DADDE6] bg-white px-5 text-sm font-medium text-[#009F4D] transition hover:border-[#009F4D]/50 hover:shadow md:inline-flex"
            >
              Lihat Semua
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => scrollBy("left")}
          className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#E3E6EF] bg-white p-2 text-[#373A43] shadow-sm transition hover:border-[#009F4D] md:inline-flex"
          aria-label="Scroll left"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-4 md:pl-1"
        >
          {restaurants.map((restaurant) => (
            <article
              key={restaurant.id}
              className="group min-w-[200px] max-w-[220px] rounded-[20px] border border-[#EFF1F7] bg-white shadow-[0_15px_40px_-28px_rgba(18,28,45,0.45)] transition-shadow hover:shadow-[0_25px_50px_-24px_rgba(18,28,45,0.35)]"
            >
              <div className="relative h-[140px] overflow-hidden rounded-[20px] rounded-b-none">
                <img
                  src={restaurant.image}
                  alt={restaurant.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 px-4 py-4">
                <h3 className="text-sm font-semibold text-[#1F2027] line-clamp-2">
                  {restaurant.title}
                </h3>
                <div className="flex flex-col gap-1 text-xs text-[#7B7F8F]">
                  {restaurant.offers?.map((offer, index) => (
                    <span key={`${restaurant.id}-offer-${index}`}>{offer}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          onClick={() => scrollBy("right")}
          className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#E3E6EF] bg-white p-2 text-[#373A43] shadow-sm transition hover:border-[#009F4D] md:inline-flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
