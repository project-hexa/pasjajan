import { z } from "zod";

export const logSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    logs: z.array(
      z.object({
        id: z.number(),
        user_id: z.number(),
        activity_type: z.string(),
        description: z.string(),
        timestamp: z.string(),
        ip_address: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        user: z.object({
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

export type LogResponse = z.infer<typeof logSchema>;
