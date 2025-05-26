import axios from "axios";
import { signIn } from "next-auth/react";

// Define types for responses
interface NafathLoginResponse {
  user: any;
  token: string;
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  async nafathLogin(code: string): Promise<{ data: NafathLoginResponse }> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/nafath`, {
        code,
      });
      return response;
    } catch (error) {
      console.error("Nafath login error:", error);
      throw error;
    }
  }

  async regularLogin(
    username: string,
    password: string,
    captchaToken: string,
    guid: string
  ) {
    return signIn("credentials", {
      username,
      password,
      captchaToken,
      guid,
      redirect: false,
    });
  }
}

const authService = new AuthService();
export default authService;
