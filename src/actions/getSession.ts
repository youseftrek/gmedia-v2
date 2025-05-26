"use server";

import { auth } from "@/auth";

export async function getSession() {
  try {
    const session = await auth();
    return { seccess: true, session };
  } catch (error) {
    console.error(error);
    return { seccess: false, session: null };
  }
}
