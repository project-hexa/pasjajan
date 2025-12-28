import { passwordStrength } from "check-password-strength";
import z from "zod";

export const token = z.string({ message: "Credentials Dibutuhkan" });

export const emailSchema = z.string().email("Email tidak Valid");

export const phoneSchema = z
  .string()
  .min(10, "Nomor telepon minimal 10 digit")
  .max(15, "Nomor telepon maksimal 15 digit")
  .regex(/^[0-9+]+$/, "Nomor telepon hanya boleh berisi angka");

export const passwordSchema = z.string().superRefine((val, ctx) => {
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

export const passwordValidation = (
  val: {
    password?: z.infer<typeof passwordSchema>;
    password_confirmation?: z.infer<typeof passwordSchema>;
  },
  ctx: z.RefinementCtx,
) => {
  if (val.password || val.password_confirmation) {
    if (val.password !== val.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Konfirmasi password tidak sesuai dengan password sebelumnya.",
        path: ["password_confirmation"],
      });
    }
  }
};

export const timestampFields = {
  created_at: z.string(),
  updated_at: z.string(),
};

export const userSchema = z.object({
  id: z.number(),
  full_name: z
    .string()
    .min(3, "Nama lengkap minimal harus 3 karakter")
    .max(30, "Nama lengkap maksimal 30 karakter"),
  email: emailSchema,
  phone_number: phoneSchema,
  birth_date: z.object({
    day: z.number().int().min(1).max(31),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(1900),
  }),
  gender: z.enum(["Laki-Laki", "Perempuan"]),
  avatar: z.string(),
  role: z.enum(["Admin", "Staff", "Customer"]),
  status_account: z.enum(["Active", "Inactive", "Pending"]),
  ...timestampFields,
  deleted_at: z.string(),
});

export const addressSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  label: z
    .string()
    .min(5, "Label Alamart minimal harus 5 karakter")
    .max(20, "Label Alamart maksimal 20 karakter"),
  detail_address: z
    .string()
    .min(10, "Alamat minimal harus 10 karakter")
    .max(200, "Alamat maksimal 200 karakter"),
  notes_address: z
    .string()
    .min(10, "Note Alamat minimal harus 10 karakter")
    .max(50, "Alamat maksimal 50 karakter"),
  recipient_name: userSchema.shape.full_name,
  phone_number: userSchema.shape.phone_number,
  latitude: z.string(),
  longitude: z.string(),
  is_default: z.coerce.boolean(),
  ...timestampFields,
});

export const addAddressSchema = addressSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    customer_id: true,
  })
  .extend({
    email: emailSchema,
  });

export const addAddressFormSchema = addAddressSchema
  .omit({
    email: true,
    latitude: true,
    longitude: true,
  })
  .extend({
    pinpoint: z.string({ message: "Pinpoint harus diisi!" }),
  });

export const editAddressSchema = addAddressSchema.partial();
export const editAddressFormSchema = editAddressSchema
  .omit({ email: true })
  .extend({
    pinpoint: addAddressFormSchema.shape.pinpoint,
  });

export const editProfileSchema = userSchema
  .pick({
    email: true,
    full_name: true,
    phone_number: true,
  })
  .extend({
    gender: userSchema.shape.gender.nullable().optional(),
    birth_date: userSchema.shape.birth_date.nullable().optional(),
    avatar: z.string().nullable().optional(),
  })
  .partial();

export const editUserSchema = userSchema
  .pick({
    full_name: true,
    email: true,
    phone_number: true,
    role: true,
    status_account: true,
  })
  .extend({
    // gak pake passwordSchema karna ini optional kalo pas edit user
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .partial()
  .extend({
    token,
  })
  .superRefine((val, ctx) => passwordValidation(val, ctx));

export const customerProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  point: z.number(),
  ...timestampFields,
  addresses: z.array(addressSchema),
});
