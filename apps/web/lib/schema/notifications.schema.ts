import { z } from "zod";

export const sendEmailNotificationSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong"),
  body: z.string().min(1, "Isi notifikasi tidak boleh kosong"),
});

export const notificationsMetricsSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    total_notifications: z.object({
      value: z.number(),
      trend: z.string(),
      description: z.string(),
    }),
    active_users: z.object({
      value: z.number(),
      trend: z.string(),
      description: z.string(),
    }),
  }),
});

export type NotificationsMetricsResponse = z.infer<
  typeof notificationsMetricsSchema
>;

export const notificationsSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    notifications: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        body: z.string(),
        from_user_id: z.number(),
        to_user_id: z.number(),
        created_at: z.string(),
        updated_at: z.string(),
        status: z.string(),
        from_user: z.object({
          id: z.number(),
          full_name: z.string(),
          email: z.string(),
        }),
        to_user: z.object({
          id: z.number(),
          full_name: z.string(),
          email: z.string(),
        }),
      }),
    ),
    pagination: z.object({
      current_page: z.number(),
      per_page: z.number(),
      total: z.number(),
      last_page: z.number(),
    }),
  }),
});
