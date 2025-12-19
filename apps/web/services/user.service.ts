import { editProfileSchema } from "@/lib/schema/user-profile.schema";
import { api } from "@/lib/utils/axios";
import { isAxiosError } from "axios";
import z from "zod";

export const userService = {
  getUserProfile: async (email: string) => {
    try {
      const { data } = await api.get("/user/profile", {
        params: {
          email,
        },
      });

      return {
        ok: true,
        data: data.data,
        message: data.message || "Profile Berhasil diambil!",
      };
    } catch (error) {
      let message = "Profile Gagal diambil!";

      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }

      return {
        ok: false,
        message,
      };
    }
  },
  editUserProfile: async (payload: z.infer<typeof editProfileSchema>) => {
    try {
      const { data } = await api.post("/user/change-profile", {
        payload,
      });

      return {
        ok: true,
        data: data.data,
        message: data.message || "Profile Berhasil diubah",
      };
    } catch (error) {
      let message = "Profile Gagal diubah";

      if (isAxiosError(error)) {
        message = error.response?.data.message ?? message;
      }

      return {
        ok: false,
        message,
      };
    }
  },
};
