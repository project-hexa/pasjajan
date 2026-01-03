"use client";

import { Icon } from "@workspace/ui/components/icon";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import { useCategoryStore } from "../_stores/useCategoryStore";
import { Button } from "@workspace/ui/components/button";
import { useNavigate } from "@/hooks/useNavigate";

export const Category = () => {
  const categories = useCategoryStore((state) => state.category);
  const loading = useCategoryStore((state) => state.loading);
  const navigate = useNavigate();

  const handleClickCategory = (link: string) => navigate.push(link);

  console.log(categories)

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        <Icon
          icon="lucide:layout-grid"
          width="24"
          height="24"
          className="relative top-px mr-2 shrink-0 stroke-[2.5px]"
        />
        Kategori
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={"outline"}
            onClick={() => handleClickCategory(category.slug)}
          >
            {category.name}
          </Button>
        ))}
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
