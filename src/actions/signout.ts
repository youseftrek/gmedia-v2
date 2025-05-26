"use server";

import { signOut } from "@/auth";

export async function logOut() {
  try {
    await signOut({ redirectTo: "/auth/login" });
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
