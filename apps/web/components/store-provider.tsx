"use client";

import { UserProvider } from "@/app/(modul 1 - user management)/_providers/user-provider";
import { CategoryProvider } from "@/app/(modul 2 - catalogue)/_providers/category-provider";

export const StoreProvider = () => {
  return (
    <>
      <UserProvider />
      <CategoryProvider />
    </>
  );
};
