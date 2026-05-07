import { z } from "zod";
import { ROLE, IsActive } from "../interface/user.interface";

const authProviderValidation = z.object({
  provider: z.string().min(1, "Provider is required"),
  providerId: z.string().min(1, "Provider ID is required"),
});

export const createUserValidation = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "Password must include uppercase, lowercase, number and special character",
      ),

    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),

    //role: z.enum([...Object.values(ROLE)] as [string, ...string[]]).optional(),

    phone: z.string().optional(),

    picture: z.string().url("Picture must be a valid URL").optional(),

    address: z.string().optional(),

    isDeleted: z.boolean().optional(),

    isActive: z
      .enum([...Object.values(IsActive)] as [string, ...string[]])
      .optional(),

    isVerified: z.boolean().optional(),

    auths: z.array(authProviderValidation).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const updateUserValidation = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum([...Object.values(ROLE)] as [string, ...string[]]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.enum([...Object.values(IsActive)] as [string, ...string[]]).optional(),
  picture: z.string().url().optional(),
});
