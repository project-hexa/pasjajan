import z from "zod";

export const editProfileSchema = z.object({
  email_before: z.string().email("Email tidak valid"),
  token: z.string({ message: "Credentials Dibutuhkan" }),
  full_name: z
    .string()
    .min(3, "Nama lengkap minimal harus 3 karakter")
    .max(30, "Nama lengkap maksimal 30 karakter")
    .optional(),
  email: z.string().email("Email tidak Valid").optional(),
  phone_number: z.string().optional(),
  gender: z.enum(["Laki-Laki", "Perempuan"]).nullable().optional(),
  birth_date: z
    .object({
      day: z.number().int().min(1).max(31),
      month: z.number().int().min(1).max(12),
      year: z.number().int().min(1900),
    })
    .nullable()
    .optional()
});
