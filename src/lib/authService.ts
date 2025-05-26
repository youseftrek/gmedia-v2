import axios from "axios";

// API response type
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Nafath user and auth data type
interface NafathData {
  token: string;
  user: any;
}

/**
 * Handles Nafath login by sending the authorization code to the backend
 */
export async function handleNafathLogin(
  code: string
): Promise<ApiResponse<NafathData>> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/nafath`,
      { code }
    );

    if (response.status === 200 && response.data.data.token) {
      return response.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Nafath login error:", error);
    throw error;
  }
}

/**
 * Checks if the user is authenticated by looking for a token in session storage
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem("token");
}

/**
 * Gets the current user token
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
}

/**
 * Gets the current user data
 */
export function getUserData(): any | null {
  if (typeof window === "undefined") return null;
  const userData = sessionStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

/**
 * Logs the user out by clearing session storage
 */
export function logout(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}
