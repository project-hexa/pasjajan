import { editProfileSchema } from "@/lib/schema/user-profile.schema";
import { handleStore } from "@/lib/utils/handle-store";
import { userService } from "@/services/user.service";
import z from "zod";
import { create } from "zustand";

interface UserStore {
  editProfile: (
    payload: Omit<z.infer<typeof editProfileSchema>, "birth_date"> & { birth_date?: string},
  ) => Promise<ActionResult>;
}

export const useUserStore = create<UserStore>()(() => ({
  editProfile: async (payload) =>
    await handleStore(async () => {
      await userService.editUserProfile(payload);
    }, "Profile Berhasil diubah!"),
}));
