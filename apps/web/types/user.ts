import { userSchema } from "@/lib/schema/user.schema";
import z from "zod";

export type User = z.infer<typeof userSchema> & {
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
