import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Nama depan minimal harus 2 karakter")
      .max(20, "Nama depan maksimal 20 karakter"),
    lastName: z
      .string()
      .min(2, "Nama belakang minimal harus 2 karakter")
      .max(20, "Nama belakang maksimal 20 karakter")
      .optional(),
    userName: z
      .string()
      .min(3, "Username minimal harus 3 karakter")
      .max(10, "Username maksimal 10 karakter"),
    email: z.string().email("Email tidak valid").optional(),
    noTelepon: z
      .string()
      .min(10, "Nomor telepon minimal harus 10 digit")
      .max(15, "Nomor telepon maksimal 15 digit"),
    address: z
      .string()
      .min(10, "Alamat minimal harus 10 karakter")
      .max(200, "Alamat maksimal 200 karakter")
      .optional(),
    password: z.string().superRefine((val, ctx) => {
      const checks = [
        {
          condition: val.length >= 8,
          message: "Password minimal harus 8 karakter",
        },
        {
          condition: /[A-Z]/.test(val),
          message: "Password harus mengandung minimal satu huruf besar",
        },
        {
          condition: /[a-z]/.test(val),
          message: "Password harus mengandung minimal satu huruf kecil",
        },
        {
          condition: /[0-9]/.test(val),
          message: "Password harus mengandung minimal satu angka",
        },
        {
          condition: !/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/.test(val),
          message:
            "Tidak boleh memasukkan simbol selain simbol khusus yang diizinkan",
        },
        {
          condition: /[!@#$%^&*(),.?":{}|<>]/.test(val),
          message: "Password harus mengandung minimal satu simbol",
        },
        {
          condition: !/\s/.test(val),
          message: "Password tidak boleh mengandung spasi",
        },
        {
          condition: !/(.)\1\1/.test(val),
          message:
            "Password tidak boleh mengandung karakter yang sama lebih dari dua kali berturut-turut",
        },
        {
          condition:
            !/(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/.test(
              val
            ),
          message: "Password tidak boleh mengandung urutan angka berurutan",
        },
      ];

      checks.forEach((check) => {
        if (!check.condition) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: check.message,
          });
        }
      });
    }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password dan konfirmasi password tidak sesuai",
      });
    }
  });

export const loginSchema = z.object({
  userName: z
    .string()
    .min(3, "Username minimal harus 3 karakter")
    .max(10, "Username maksimal 10 karakter"),
  password: z.string().min(8, "Password minimal harus 8 karakter"),
});
