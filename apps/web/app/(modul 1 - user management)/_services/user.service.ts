import { editProfileSchema } from "@/lib/schema/user.schema";
import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";
import {
  AddAddressSchema,
  AddressSchema,
  Customer,
  EditAddressSchema,
  User,
} from "@/types/user";
import z from "zod";

export const userService = {
  getUserProfile: async (opts?: { ssr: boolean }) =>
    await handleApiResponse<{ user: User & { customer: Customer } }>(
      async () =>
        await handleApiRequest.get("/user/profile", {
          ssr: opts?.ssr,
        }),
    ),
  editUserProfile: async (
    email_before: string,
    payload: Omit<z.infer<typeof editProfileSchema>, "birth_date"> & {
      birth_date?: string;
    },
    opts?: { ssr: boolean },
  ) =>
    await handleApiResponse<{ user: User }>(
      async () =>
        await handleApiRequest.patch(
          "/user/change-profile",
          {
            email_before,
            ...payload,
          },
          {
            defaultErrorMessage: "Profile Gagal diubah!",
            ssr: opts?.ssr ?? false,
          },
        ),
    ),
  getUserByID: async (id: User["id"], opts?: { ssr: boolean }) =>
    await handleApiResponse<{ user_data: User }>(
      async () =>
        await handleApiRequest.get("/admin/users", {
          params: { id },
          ssr: opts?.ssr ?? true,
        }),
    ),
  getUserByRole: async (role: User["role"], opts?: { ssr: boolean }) =>
    await handleApiResponse<{ users: User }>(
      async () =>
        await handleApiRequest.get<{ users: User }>(`/admin/users/${role}`, {
          ssr: opts?.ssr ?? true,
        }),
    ),
  addAddresses: async (payload: AddAddressSchema, opts?: { ssr: boolean }) =>
    await handleApiResponse<AddressSchema>(
      async () =>
        await handleApiRequest.post<AddressSchema>(
          "/user/add-address",
          payload,
          {
            ssr: opts?.ssr ?? false,
          },
        ),
    ),
  editAddresses: async (
    id: number,
    payload: EditAddressSchema,
    opts?: { ssr: boolean },
  ) =>
    await handleApiResponse<AddressSchema>(
      async () =>
        await handleApiRequest.patch<AddressSchema>(
          `/user/change-address/${id}`,
          payload,
          {
            ssr: opts?.ssr ?? false,
          },
        ),
    ),
  changeAvatar: async (email: string, avatar: File, opts?: { ssr: boolean }) =>
    await handleApiResponse<{ avatar: string }>(
      async () =>
        await handleApiRequest.post<{ avatar: string }>(
          "/user/upload-avatar",
          {
            email,
            avatar,
          },
          {
            ssr: opts?.ssr ?? false,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        ),
    ),
};
