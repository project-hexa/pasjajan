"use client";

import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const StoreProvider = () => {
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      useUserStore.setState({ user: null, isLoggedIn: false });
      useUserStore.persist.clearStorage();
      Cookies.remove("role");
    }
  }, [token]);

  return null;
};
