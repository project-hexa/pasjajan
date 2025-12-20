import z from "zod";

export const editProfileSchema = z.object({
  token: z.string({ message: "Credentials Dibutuhkan" }),
  new_full_name: z
    .string()
    .min(3, "Nama lengkap minimal harus 3 karakter")
    .max(30, "Nama lengkap maksimal 30 karakter"),
  new_phone_number: z.string(),
  new_address: z
    .string()
    .min(10, "Alamat minimal harus 10 karakter")
    .max(200, "Alamat maksimal 200 karakter"),
  email: z.string().email("Email tidak Valid"),
  new_email: z.string().email("Email tidak Valid"),
});
