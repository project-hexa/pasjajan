import { editProfileSchema } from "@/lib/schema/user.schema";
import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";
import { User } from "@/types/user";
import z from "zod";

export const userService = {
  getUserProfile: async (email: string) =>
    await handleApiResponse(
      async () =>
        await handleApiRequest.get("/user/profile", {
          params: { email },
          withAuth: true,
        }),
    ),
  editUserProfile: async (
    email_before: string,
    payload: Omit<z.infer<typeof editProfileSchema>, "birth_date"> & {
      birth_date?: string;
    },
  ) =>
    await handleApiResponse(
      async () =>
        await handleApiRequest.patch(
          "/user/change-profile",
          {
            email_before,
            ...payload,
          },
          {
            defaultErrorMessage: "Profile Gagal diubah!",
            withAuth: true,
          },
        ),
    ),
  getUserByID: async (id: User["id"]) =>
    await handleApiRequest.get("/admin/users", {
      params: { id },
      withAuth: true,
    }),
  getUserByRole: async (role: User["role"]) =>
    await handleApiResponse<{ users: User }>(
      async () =>
        await handleApiRequest.get<{ users: User }>(`/admin/users/${role}`, {
          withAuth: true,
        }),
    ),
};
