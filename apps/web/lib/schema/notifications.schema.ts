import { z } from "zod";

export const sendEmailNotificationSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong"),
  body: z.string().min(1, "Isi notifikasi tidak boleh kosong"),
});
