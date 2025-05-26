// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
    expires: any;
    token: any;
  }

  interface User {
    fullnameAr: string;
    fullnameEn: string;
    language: number;
    email: string;
    iamId: number;
  }
}
