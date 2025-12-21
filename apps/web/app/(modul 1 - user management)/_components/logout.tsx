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
import Cookies from "js-cookie";
import { useNavigate } from "@/hooks/useNavigate";
import { useForm } from "react-hook-form";

export const Logout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const role = Cookies.get("token");

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

      if (role === "admin") navigate.push("/login/admin");
      navigate.push("/login");
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
