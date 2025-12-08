"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

interface Category {
  id: string | number;
  name: string;
  icon: string;
  slug: string;
}

interface CategoryNavigationProps {
  categories: Category[];
  onCategoryClick?: (category: Category) => void;
  activeCategory?: string | number;
}

export function CategoryNavigation({
  categories,
  onCategoryClick,
  activeCategory,
}: CategoryNavigationProps) {
  return (
    <div className="w-full overflow-x-auto bg-background border-y">
      <div className="flex items-center gap-2 px-4 py-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category)}
            className={cn(
              "flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-colors min-w-[100px]",
              "hover:bg-accent hover:text-accent-foreground",
              activeCategory === category.id && "bg-accent text-accent-foreground"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">{category.icon}</span>
            </div>
            <span className="text-xs font-medium text-center whitespace-nowrap">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
