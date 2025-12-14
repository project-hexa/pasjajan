"use client";

import { useAuthStore } from "@/stores/useAuthStore";
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
import { useRouter } from "next/navigation";

export const Logout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleClick = async () => {
    const result = await logout();

    if (result.ok) {
      toast.success(result.message, {
        toasterId: "global",
      });
      router.push("/login");
    } else {
      toast.error(result.message, {
        toasterId: "global",
      });
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
