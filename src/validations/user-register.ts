import { z } from "zod";

export const UserRegisterSchema = z
  .object({
    firstName: z.string().min(1),
    phoneNumber: z.string().min(1),
    lastName: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
