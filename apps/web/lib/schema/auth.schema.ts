import { z } from "zod";
import {
  addressSchema,
  passwordSchema,
  passwordValidation,
  userSchema,
} from "./user.schema";

export const otp = z.string().min(6, {
  message: "OTP anda harus terdiri dari 6 karakter.",
});

export const registerSchema = userSchema
  .pick({
    full_name: true,
    email: true,
    phone_number: true,
  })
  .extend({
    address: addressSchema,
    password: passwordSchema,
    password_confirmation: passwordSchema,
  })
  .superRefine((val, ctx) => passwordValidation(val, ctx));

export const loginSchema = userSchema
  .pick({
    email: true,
    role: true,
  })
  .extend({
    password: passwordSchema,
    rememberMe: z.boolean(),
  });

export const verifyOTPSchema = userSchema
  .pick({
    email: true,
  })
  .extend({
    otp,
  });

export const sendOTPSchema = userSchema
  .pick({
    email: true,
  })
  .extend({
    context: z.enum(["register", "forgot_password"]),
  });

export const forgotPasswordSchema = userSchema.pick({
  email: true,
});

export const resetPasswordSchema = userSchema
  .pick({
    email: true,
  })
  .extend({
    password: passwordSchema,
    password_confirmation: passwordSchema,
  })
  .superRefine((val, ctx) => passwordValidation(val, ctx));
