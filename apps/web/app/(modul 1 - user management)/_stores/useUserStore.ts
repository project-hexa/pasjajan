import { editProfileSchema } from "@/lib/schema/user.schema";
import { handleStore } from "@/lib/utils/handle-store";
import { userService } from "@/app/(modul 1 - user management)/_services/user.service";
import z from "zod";
import { create } from "zustand";

interface UserStore {
  editProfile: (
    payload: Omit<z.infer<typeof editProfileSchema>, "birth_date"> & {
      birth_date?: string;
    },
  ) => Promise<ActionResult>;
  getUserByID: (id: User["id"]) => Promise<ActionResult<{ users: User }>>;
  getUserByRole: (role: User["role"]) => Promise<ActionResult<{ users: User }>>;
}

export const useUserStore = create<UserStore>()(() => ({
  editProfile: async (payload) =>
    await handleStore(async () => {
      await userService.editUserProfile(payload);
    }, "Profile Berhasil diubah!"),
  getUserByID: async (id) =>
    await handleStore<{ users: User }>(
      async () => await userService.getUserByID(id),
    ),
  getUserByRole: async (role) =>
    await handleStore<{ users: User }>(
      async () => await userService.getUserByRole(role),
    ),
}));
