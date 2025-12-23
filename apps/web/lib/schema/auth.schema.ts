import { z } from "zod";
import { passwordStrength } from "check-password-strength";

const emailSchema = z.string().email("Email tidak Valid");

const phoneSchema = z
  .string()
  .min(10, "Nomor telepon minimal 10 digit")
  .max(15, "Nomor telepon maksimal 15 digit")
  .regex(/^[0-9+]+$/, "Nomor telepon hanya boleh berisi angka");

const passwordSchema = z.string().superRefine((val, ctx) => {
  const strength = passwordStrength(val);

  if (val.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password minimal harus 8 karakter",
    });
  }

  if (!strength.contains.includes("uppercase")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password harus mengandung huruf besar",
    });
  }

  if (!strength.contains.includes("lowercase")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password harus mengandung huruf kecil",
    });
  }

  if (!strength.contains.includes("symbol")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password harus mengandung setidaknya 1 simbol",
    });
  }
});

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(3, "Nama lengkap minimal harus 3 karakter")
      .max(30, "Nama lengkap maksimal 30 karakter"),
    email: emailSchema,
    phone_number: phoneSchema,
    address: z
      .string()
      .min(10, "Alamat minimal harus 10 karakter")
      .max(200, "Alamat maksimal 200 karakter"),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Konfirmasi password tidak sesuai dengan password sebelumnya.",
        path: ["password_confirmation"],
      });
    }
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
  role: z.enum(["Admin", "Staff", "Customer"]),
});

export const verifyOTPSchema = z.object({
  email: emailSchema,
  otp: z.string().min(6, {
    message: "OTP anda harus terdiri dari 6 karakter.",
  }),
});

export const sendOTPSchema = z.object({
  email: emailSchema,
  context: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Konfirmasi password tidak sesuai dengan password sebelumnya.",
        path: ["password_confirmation"],
      });
    }
  });

export const addAddressSchema = z.object({
  pinpoint: z
    .string()
    .min(3, "Pinpoint minimal harus 3 karakter")
    .max(200, "Pinpoint maksimal 200 karakter"),
  label_address: z
    .string()
    .min(3, "Label alamat minimal harus 3 karakter")
    .max(50, "Label alamat maksimal 50 karakter"),
  address: z
    .string()
    .min(10, "Alamat minimal harus 10 karakter")
    .max(200, "Alamat maksimal 200 karakter"),
  reciper_name: z
    .string()
    .min(3, "Nama penerima minimal harus 3 karakter")
    .max(50, "Nama penerima maksimal 50 karakter"),
  phone_number: z
    .string()
    .min(10, "Nomor telepon minimal harus 10 karakter")
    .max(15, "Nomor telepon maksimal 15 karakter"),
});
