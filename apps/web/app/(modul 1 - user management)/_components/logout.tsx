"use client";

import { useNavigate } from "@/hooks/useNavigate";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import { toast } from "@workspace/ui/components/sonner";
import Cookies from "js-cookie";
import { authService } from "../_services/auth.service";
import { useUserStore } from "../_stores/useUserStore";
import { useState } from "react";

export const Logout = () => {
  const navigate = useNavigate();
  const role = Cookies.get("token");
  const { setIsLoggedIn } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setIsLoading(true);
    const result = await authService.logout();

    if (result.ok) {
      toast.success("Berhasil Logout", {
        toasterId: "global",
      });

      setIsLoggedIn(false);
      Cookies.remove("token");

      setIsLoading(false);

      if (role === "admin") navigate.push("/login/admin");
      navigate.push("/login");
    } else {
      toast.error("Ada kesalahan ketika logout!", {
        toasterId: "global",
      });

      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start px-2 py-0">
          <Icon icon="lucide:log-out" /> Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <Icon icon="lucide:log-out" className="text-primary text-6xl" />
          <AlertDialogTitle>Apakah anda yakin ingin keluar?</AlertDialogTitle>
          <AlertDialogDescription className="sr-only" />
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center! gap-20">
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button
            variant={"destructive"}
            disabled={isLoading}
            onClick={handleClick}
          >
            {isLoading ? (
              <Icon
                icon={"lucide:loader-circle"}
                width={24}
                className="animate-spin"
              />
            ) : (
              "Keluar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
