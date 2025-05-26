"use server";

import { signIn } from "@/auth";
import { UserLoginSchema } from "@/validations/user-login";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const login = async (
  values: z.infer<typeof UserLoginSchema>,
  locale: string
) => {
  const validatedFields = UserLoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password, captchaToken, guid } = validatedFields.data;

  try {
    const res = await signIn("credentials", {
      username,
      password,
      captchaToken,
      guid,
      redirect: false,
    });

    if (res?.error) {
      return { error: "Invalid email or password!" };
    }

    // The token will be available in the session
    // We'll handle saving it to sessionStorage in the client component

    revalidatePath(`${locale}/dashboard`);
    return { success: "success-login" };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: "Invalid email or password!" };
  }
};
