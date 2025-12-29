"use client";

import { editProfileSchema } from "@/lib/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/ui/components/sonner";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { userService } from "../_services/user.service";
import { useUserStore } from "../_stores/useUserStore";

export const useEditProfile = () => {
  const [editingFields, setEditingFields] = useState<
    Set<keyof z.infer<typeof editProfileSchema>>
  >(new Set());
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<File[] | undefined>();
  const { user, setUser } = useUserStore();

  const profileForm = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      gender: null,
      birth_date: null,
    },
  });

  const changeAvatarForm = useForm<{ avatar: File | null }>({
    resolver: zodResolver(
      z.object({
        avatar: z.instanceof(File).nullable(),
      }),
    ),
    defaultValues: {
      avatar: null,
    },
  });

  useEffect(() => {
    if (!user) return;

    let birthDateObj = null;
    if (user.birth_date && typeof user.birth_date === "string") {
      const [year, month, day] = (user.birth_date as string)
        .split("-")
        .map(Number);
      birthDateObj = { year, month, day };
    } else if (user.birth_date) {
      birthDateObj = user.birth_date;
    }

    profileForm.reset({
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      gender: user.gender ? user.gender : null,
      birth_date: birthDateObj,
    });
  }, [user, profileForm]);

  const handleUploadAvatar = async (data: { avatar: File | null }) => {
    if (data.avatar) {
      const res = await userService.changeAvatar(
        user?.email || "",
        data.avatar,
      );

      if (res.ok) {
        toast.success(res.message || "Berhasil mengubah Avatar!", {
          toasterId: "global",
        });
        setCroppedImageUrl("");
        if (res.data?.avatar) {
          setUser({
            ...user!,
            avatar: res.data.avatar,
          });
        }
      } else {
        toast.success("Gagal mengubah Avatar!", {
          toasterId: "global",
        });
      }
    }
  };

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
      const payload: Omit<
        z.infer<typeof editProfileSchema>,
        "birth_date" | "avatar"
      > & {
        birth_date?: string;
        avatar?: string;
      } = {};

      if (Object.keys(dirtyFields).length === 0) {
        toast.info("Tidak ada perubahan untuk disimpan", {
          toasterId: "global",
        });
        return;
      }

      Object.keys(dirtyFields).forEach((key) => {
        if (key === "birth_date" && data.birth_date) {
          const { year, month, day } = data.birth_date;
          payload.birth_date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        } else if (key === "gender" && data.gender) {
          payload.gender = data.gender;
        } else if (key === "phone_number" && data.phone_number) {
          payload.phone_number = data.phone_number.startsWith("0")
            ? data.phone_number.slice(1)
            : data.phone_number;
        } else {
          payload[
            key as keyof Omit<
              z.infer<typeof editProfileSchema>,
              "birth_date" | "gender" | "avatar"
            >
          ] = data[key as keyof typeof data] as string;
        }
      });

      const result = await userService.editUserProfile(
        user?.email ?? "",
        payload,
      );

      if (result.ok) {
        toast.success(result.message || "Berhasil mengubah Profile!", {
          toasterId: "global",
        });

        setEditingFields(new Set());
        setUser({
          ...user!,
          ...result.data?.user,
        });
      } else {
        toast.error(result.message || "Gagal Mengubah Profile!", {
          toasterId: "global",
        });
      }
    },
    [profileForm, user, setUser],
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
    handleUploadAvatar,
    changeAvatarForm,
  };
};
