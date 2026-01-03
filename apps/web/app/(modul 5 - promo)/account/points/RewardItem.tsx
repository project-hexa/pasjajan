"use client";

import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

export interface RewardProps {
  title: string;
  points: number;
  image: string;
  imageClassName?: string;
}

export default function RewardItem({
  title,
  points,
  image,
  imageClassName,
}: RewardProps) {
  return (
    <div className="rounded-lg border bg-white p-3 shadow transition hover:shadow-lg">
      {/* Voucher Image */}
      <div className="overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          width={500}
          height={200}
          className={cn("h-30 w-full object-scale-down", imageClassName)}
        />
      </div>

      {/* Title */}
      <p className="mt-3 text-sm font-semibold text-gray-800">{title}</p>

      {/* Point Button */}
      <button className="mt-3 w-full rounded-lg border border-green-700 py-2 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white">
        {points}
      </button>
    </div>
  );
}
