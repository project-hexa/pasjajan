"use client";

import { useEffect } from "react";
import { useCategoryStore } from "../_stores/useCategoryStore";
import { categoryService } from "../_service/category.service";

export const CategoryProvider = () => {
  const setCategory = useCategoryStore((state) => state.setCategory);
  const setLoading = useCategoryStore((state) => state.setLoading);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await categoryService.getCategory();

      if (res.ok) {
        setCategory(res.data?.data || []);
      }
      setLoading(false);
    })();
  }, [setCategory, setLoading]);

  return null;
};
