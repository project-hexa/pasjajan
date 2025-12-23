import { editProfileSchema } from "@/lib/schema/user.schema";
import { handleApiRequest } from "@/lib/utils/handle-api-request";
import z from "zod";
import Cookies from "js-cookie";

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
  getUserByID: async (id: User["id"]): Promise<{users: User}> =>
    await handleApiRequest.get("/admin/users", { params: { id } }),
  getUserByRole: async (role: User["role"]): Promise<{users: User}> => {
    const token = Cookies.get("token") ?? "";
    return await handleApiRequest.get<{users: User}>(`/admin/users/${role}`, {
      data: { token },
    });
  },
};
