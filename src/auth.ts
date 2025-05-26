import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import apiClient from "./lib/apiClient";
import { AxiosError } from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Captcha Token", type: "text" },
        guid: { label: "guid", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.username ||
          !credentials?.password ||
          !credentials?.captchaToken ||
          !credentials?.guid
        ) {
          return null;
        }

        try {
          const res = await apiClient.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`,
            {
              username: credentials.username,
              password: credentials.password,
              captchaToken: credentials.captchaToken,
              guid: credentials.guid,
            }
          );

          console.log("Response received:", res);

          if (res.status !== 200 || !res.data.data.token)
            throw new Error("Invalid credentials");

          const { token, user } = res.data.data;

          return {
            ...user,
            token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          if (error instanceof AxiosError && error.response) {
            console.error("Error response:", {
              status: error.response.status,
              data: error.response.data,
            });
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.id = user.id;
        token.iamId = user.iamId;
        token.user = { ...user };

        // Store token in session storage on client side
        if (typeof window !== "undefined" && user.token) {
          sessionStorage.setItem("token", user.token);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.token = token.token as string;
      session.user = token.user as any;
      return session;
    },
  },
  // secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
});
