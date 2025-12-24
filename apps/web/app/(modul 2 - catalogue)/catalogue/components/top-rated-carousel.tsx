"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@workspace/ui/components/icon";

interface RestaurantCard {
  id: string | number;
  slug?: string;
  title: string;
  image: string;
  offers?: string[];
}

interface TopRatedCarouselProps {
  restaurants: RestaurantCard[];
  showHeading?: boolean;
}

export function TopRatedCarousel({ restaurants, showHeading = true }: TopRatedCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [items, setItems] = React.useState<RestaurantCard[]>(restaurants ?? []);

  const scrollBy = (direction: "left" | "right") => {
    const node = scrollContainerRef.current;
    if (!node) return;

    const cardWidth = node.firstElementChild?.clientWidth ?? 240;
    const offset = direction === "left" ? -cardWidth * 2 : cardWidth * 2;

    node.scrollTo({ left: node.scrollLeft + offset, behavior: "smooth" });
  };

  // keep local items in sync with props
  React.useEffect(() => setItems(restaurants ?? []), [restaurants]);

  // when no restaurants provided, attempt to fetch top-rated stores from API
  React.useEffect(() => {
    if ((items || []).length > 0) return;

    let mounted = true;
    (async () => {
      try {
        const apiRoot = (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:8000/api";
        const candidates = [
          `${apiRoot}/stores/top-rated`,
          `${apiRoot}/stores?top_rated=1`,
          `${apiRoot}/top-rated/stores`,
          `${apiRoot}/stores`,
        ];

        for (const url of candidates) {
          try {
            const r = await fetch(url);
            if (!r.ok) continue;
            const payload = await r.json();
            const arr = Array.isArray(payload)
              ? payload
              : Array.isArray(payload.data)
              ? payload.data
              : Array.isArray(payload.data?.data)
              ? payload.data.data
              : Array.isArray(payload.stores)
              ? payload.stores
              : [];

            if (arr.length === 0) continue;

            const mapped: RestaurantCard[] = arr.map((s: unknown, idx: number) => {
              const obj = s as Record<string, unknown>;
              return {
                id: obj.id ?? obj.code ?? idx,
                slug: (obj.slug ?? String(obj.id ?? obj.code ?? idx)) as string,
                title: (obj.name ?? obj.title ?? "") as string,
                image: (obj.image_url ?? obj.logo_url ?? obj.image ?? "/img/logo2.png") as string,
                offers: (obj.offers ?? obj.discounts ?? []) as string[],
              } as RestaurantCard;
            });

            if (mounted) {
              setItems(mapped);
              break;
            }
          } catch {
            // try next candidate
          }
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items]);

  if ((items || []).length === 0) return null;

  return (
    <section className="relative">
      {showHeading && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[26px] font-semibold text-[#33363F]">Cabang Pilihan</h2>
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => scrollBy("left")}
          className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#E3E6EF] bg-white p-2 text-[#373A43] shadow-sm transition hover:border-[#009F4D] md:inline-flex z-40"
          aria-label="Scroll left"
        >
          <Icon icon={"lucide:chevron-right"} className="h-4 w-4 rotate-180" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-4 md:pl-1"
        >
          {items.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={restaurant.slug ? `/store/${restaurant.slug}` : '#'}
              prefetch={false}
              className="group min-w-[200px] max-w-[220px] rounded-[20px] border border-[#EFF1F7] bg-white shadow-[0_15px_40px_-28px_rgba(18,28,45,0.45)] transition-shadow hover:shadow-[0_25px_50px_-24px_rgba(18,28,45,0.35)] block"
              aria-label={`Buka ${restaurant.title}`}
            >
              <div>
                <div className="relative h-[140px] overflow-hidden rounded-[20px] rounded-b-none">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scrollBy("right")}
          className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#E3E6EF] bg-white p-2 text-[#373A43] shadow-sm transition hover:border-[#009F4D] md:inline-flex z-40"
          aria-label="Scroll right"
        >
          <Icon icon={"lucide:chevron-right"} className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}