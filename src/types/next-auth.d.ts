import "next-auth";

declare module "next-auth" {
  interface User {
    token?: string;
    user: {
      fullnameAr?: string;
      fullnameEn?: string;
      language?: number;
      email?: string;
      iamId?: 20;
    };
    id?: string;
  }

  interface Session {
    token: string;
    user: User;
  }
}
