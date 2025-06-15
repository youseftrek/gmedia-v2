"use server";

import { redirect } from "@/i18n/routing";
import { cookies } from "next/headers";

export type Session = {
  token: string;
  user: {
    fullnameAr: string;
    fullnameEn: string;
    language: number;
    email: string;
    iamId: number;
  };
};

export async function getServerSession(): Promise<Session | null> {
  try {
    // Create an absolute URL for the API endpoint
    const response = await fetch(
      process.env.NEXT_PUBLIC_APP_URL + "/api/auth/me",
      {
        cache: "no-store",
        // Forward the cookies from the request
        headers: {
          cookie: (await cookies()).toString(),
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.session) {
      return null;
    }

    return data.session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

/**
 * Gets session without redirecting - safe to use on public pages
 */
export async function getSessionSafe(): Promise<Session | null> {
  return await getServerSession();
}

/**
 * Gets session and redirects to login if not authenticated
 * Only use this on protected routes
 */
export async function auth(): Promise<Session | null> {
  const session = await getServerSession();

  if (!session) {
    redirect({ href: "/auth/login", locale: "ar" });
  }

  return session;
}
