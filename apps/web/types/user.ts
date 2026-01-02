import {
  addAddressFormSchema,
  addAddressSchema,
  addressSchema,
  customerProfileSchema,
  editAddressFormSchema,
  editAddressSchema,
  userSchema,
} from "@/app/(modul 1 - user management)/_schema/user.schema";
import z from "zod";

export type User = z.infer<typeof userSchema>;

export type Customer = z.infer<typeof customerProfileSchema>;

export type AddressSchema = z.infer<typeof addressSchema>;

export type AddAddressSchema = z.infer<typeof addAddressSchema>;

export type EditAddressSchema = z.infer<typeof editAddressSchema>;

export type AddAddressFormSchema = z.infer<typeof addAddressFormSchema>;

export type EditAddressFormSchema = z.infer<typeof editAddressFormSchema>;
