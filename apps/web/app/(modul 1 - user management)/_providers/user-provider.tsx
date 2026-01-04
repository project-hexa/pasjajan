"use client";

import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { userService } from "@/app/(modul 1 - user management)/_services/user.service";

export const UserProvider = () => {
  const token = Cookies.get("token");
  const { setUser, isLoggedIn } = useUserStore();

  useEffect(() => {
    if (!token) {
      useUserStore.setState({ user: null, isLoggedIn: false });
      useUserStore.persist.clearStorage();
      Cookies.remove("role");
    }
  }, [token]);

  useEffect(() => {
    if (!isLoggedIn) return;

    (async () => {
      const res = await userService.getUserProfile();

      if (res.ok && res.data?.user) {
        setUser(res.data.user);
      }
    })();

    return () => {};
  }, [setUser, isLoggedIn]);

  return null;
};
