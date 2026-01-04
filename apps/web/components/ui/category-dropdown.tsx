"use client";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Icon } from "@workspace/ui/components/icon";
import { api } from "@/lib/utils/axios";
import { useNavigate } from "@/hooks/useNavigate";
import React from "react";

interface Category {
  id: number;
  name: string;
  slug?: string;
  products_count?: number;
}

export const CategoryDropdown = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/categories");
        if (response.data?.success && response.data?.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleCategoryClick = (category: Category) => {
    setOpen(false);
    // Navigate to catalogue with category filter
    navigate.push(`/catalogue?category=${category.id}`);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center text-white transition-all hover:scale-105 hover:bg-white/10 hover:text-white max-sm:hidden"
        >
          <Icon
            icon="lucide:layout-grid"
            width="24"
            height="24"
            className="relative top-px mr-2 shrink-0 stroke-[2.5px]"
          />
          <span className="pt-1 font-medium">Kategori</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white p-0" align="start">
        <DropdownMenuLabel className="border-b border-gray-200 px-4 py-3 text-gray-700">
          Pilih Kategori
        </DropdownMenuLabel>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Icon
                icon="lucide:loader-circle"
                className="h-5 w-5 animate-spin text-gray-400"
              />
            </div>
          ) : categories.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              Tidak ada kategori tersedia
            </div>
          ) : (
            categories.length > 0 &&
            categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                className="cursor-pointer px-4 py-3 hover:bg-gray-50"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium text-gray-700">
                    {category.name}
                  </span>
                  {category.products_count !== undefined && (
                    <span className="text-xs text-gray-400">
                      ({category.products_count})
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
