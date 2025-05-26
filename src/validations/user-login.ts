import { z } from "zod";

export const UserLoginSchema = z.object({
  username: z.string().min(1, { message: "requiredUsername" }),
  password: z.string().min(1, { message: "requiredPassword" }),
  captchaToken: z.string().min(1, { message: "requiredCaptcha" }),
  guid: z.string().min(1, { message: "requiredGuid" }),
});
