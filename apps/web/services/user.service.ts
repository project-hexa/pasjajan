import { editProfileSchema } from "@/lib/schema/user-profile.schema";
import { handleApiRequest } from "@/lib/utils/handle-api-request";
import z from "zod";

export const userService = {
  getUserProfile: async (email: string) =>
    await handleApiRequest.get("/user/profile", { params: { email } }),
  editUserProfile: async (
    payload: Omit<z.infer<typeof editProfileSchema>, "birth_date"> & {
      birth_date?: string;
    },
  ) =>
    await handleApiRequest.patch("/user/change-profile", payload, {
      defaultErrorMessage: "Profile Gagal diubah!",
    }),
};
