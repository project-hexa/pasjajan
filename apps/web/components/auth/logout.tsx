"use client";

import { useAuth } from "@/hooks/contollers/useAuth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import { cn } from "@workspace/ui/lib/utils";
import { ComponentProps } from "react";

export const Logout = (props: ComponentProps<"button">) => {
  const { logout, isLoggedIn } = useAuth();

  const handleClick = () => {
    isLoggedIn && logout();
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
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center gap-20">
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button variant={"destructive"} onClick={handleClick}>
            Keluar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
