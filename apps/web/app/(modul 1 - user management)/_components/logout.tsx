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
import { useForm } from "react-hook-form";

export const Logout = () => {
  const { logout, token } = useAuthStore();
  const router = useRouter();

  const logoutForm = useForm({
    defaultValues: {
      token: token || "",
    },
  });

  const handleClick = async (data: { token: string }) => {
    const result = await logout(data.token);

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
          <form id="logout" onSubmit={logoutForm.handleSubmit(handleClick)}>
            <Button
              variant={"destructive"}
              form="logout"
              disabled={logoutForm.formState.isSubmitting}
            >
              {logoutForm.formState.isSubmitting ? (
                <Icon
                  icon={"lucide:loader-circle"}
                  width={24}
                  className="animate-spin"
                />
              ) : (
                "Keluar"
              )}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
