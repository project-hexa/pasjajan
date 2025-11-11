import { z } from "zod";
import { passwordStrength } from "check-password-strength";

const usernameSchema = z
  .string()
  .min(3, "Username minimal 3 karakter")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username hanya boleh huruf, angka, dan underscore",
  );

const emailSchema = z.string().email("Email tidak Valid");

const phoneSchema = z.string();

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

  // if (!strength.contains.includes("number")) {
  //   ctx.addIssue({
  //     code: z.ZodIssueCode.custom,
  //     message: "Password harus mengandung angka",
  //   });
  // }
  //
  // if (!strength.contains.includes("symbol")) {
  //   ctx.addIssue({
  //     code: z.ZodIssueCode.custom,
  //     message: "Password harus mengandung simbol",
  //   });
  // }
  //
  // if (/\s/.test(val)) {
  //   ctx.addIssue({
  //     code: z.ZodIssueCode.custom,
  //     message: "Password tidak boleh mengandung spasi",
  //   });
  // }
  //
  // if (strength.id < 2) {
  //   ctx.addIssue({
  //     code: z.ZodIssueCode.custom,
  //     message: "Password masih terlalu lemah",
  //   });
  // }
});

export const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(2, "Nama lengkap minimal harus 3 karakter")
      .max(20, "Nama lengkap maksimal 30 karakter"),
    userName: usernameSchema,
    email: emailSchema,
    noTelepon: phoneSchema,
    address: z
      .string()
      .min(10, "Alamat minimal harus 10 karakter")
      .max(200, "Alamat maksimal 200 karakter"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Konfirmasi password tidak sesuai dengan password sebelumnya.",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z.object({
  UET: z
    .string()
    .min(1, "Field ini wajib diisi")
    .superRefine((val, ctx) => {
      const isValidUsername = usernameSchema.safeParse(val).success;
      const isValidEmail = emailSchema.safeParse(val).success;
      const isValidPhone = phoneSchema.safeParse(val).success;

      const inValidUsername = usernameSchema.safeParse(val).error;
      const inValidEmail = emailSchema.safeParse(val).error;
      const inValidPhone = phoneSchema.safeParse(val).error;

      if (isValidPhone || isValidUsername || isValidEmail) {
        return;
      }

      if (val.includes("@")) {
        if (inValidEmail) {
          const issue = inValidEmail.issues?.[0];
          if (issue) ctx.addIssue(issue);
          return;
        }
      }

      if (val.length > 0) {
        const first = val[0] || "";

        if (/[A-Za-z]/.test(first)) {
          if (inValidUsername) {
            const issue = inValidUsername.issues?.[0];
            if (issue) ctx.addIssue(issue);
          }
          return;
        }

        if (/\d|\+/.test(first)) {
          if (inValidPhone) {
            const issue = inValidPhone.issues?.[0];
            if (issue) ctx.addIssue(issue);
          }
          return;
        }
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Masukkan username, email, atau nomor telepon yang valid",
      });
    }),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "OTP anda harus terdiri dari 6 karakter.",
  }),
});

export const verificationCodeSchema = z.object({
  email: emailSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Konfirmasi password tidak sesuai dengan password sebelumnya.",
        path: ["confirmPassword"],
      });
    }
  });
