"use client";

import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "../_stores/useUserStore";
import { editProfileSchema } from "@/lib/schema/user.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { userService } from "../_services/user.service";
import { toast } from "@workspace/ui/components/sonner";

export const useEditProfile = () => {
  const [editingFields, setEditingFields] = useState<
    Set<keyof z.infer<typeof editProfileSchema>>
  >(new Set());
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<File[] | undefined>();

  const { user } = useUserStore();

  const profileForm = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      gender: null,
      birth_date: null,
      avatar: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    profileForm.reset({
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      gender: user.gender ? user.gender : null,
      birth_date: user.birth_date ? user.birth_date : null,
      avatar: user.avatar,
    });
  }, [user, profileForm]);

  const handleBtnEdit = useCallback(
    (field: keyof z.infer<typeof editProfileSchema>) => {
      setEditingFields((prev) => new Set(prev).add(field));
      profileForm.setFocus(field);
    },
    [profileForm],
  );

  const handleBtnCancelEdit = useCallback(
    (field: keyof z.infer<typeof editProfileSchema>) => {
      setEditingFields((prev) => {
        const next = new Set(prev);
        next.delete(field);
        return next;
      });
      setFiles(undefined);
      setCroppedImageUrl(null);
      profileForm.resetField(field);
    },
    [profileForm],
  );

  const handleOnSubmit = useCallback(
    async (data: z.infer<typeof editProfileSchema>) => {
      const dirtyFields = profileForm.formState.dirtyFields;
      const payload: Omit<z.infer<typeof editProfileSchema>, "birth_date"> & {
        birth_date?: string;
      } = {};

      if (Object.keys(dirtyFields).length === 0) {
        toast.info("Tidak ada perubahan untuk disimpan", {
          toasterId: "global",
        });
        return;
      }

      Object.keys(dirtyFields).forEach((key) => {
        if (key === "birth_date" && data.birth_date) {
          payload.birth_date = new Date(
            data.birth_date.year!,
            data.birth_date.month! - 1,
            data.birth_date.day!,
          )
            .toISOString()
            .split("T")[0];
        } else if (key === "gender" && data.gender) {
          payload.gender = data.gender;
        } else {
          payload[
            key as keyof Omit<
              z.infer<typeof editProfileSchema>,
              "birth_date" | "gender"
            >
          ] = data[key as keyof typeof data] as string;
        }
      });

      const result = await userService.editUserProfile(
        user?.email ?? "",
        payload,
      );

      if (result.ok) {
        toast.success(result.message, {
          toasterId: "global",
        });

        setEditingFields(new Set());
      } else {
        toast.error(result.message, {
          toasterId: "global",
        });
      }
    },
    [profileForm, user],
  );

  return {
    profileForm,
    handleOnSubmit,
    handleBtnEdit,
    handleBtnCancelEdit,
    editingFields,
    croppedImageUrl,
    setCroppedImageUrl,
    files,
  };
};
