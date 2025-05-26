import { Session } from "next-auth";
import axios from "axios";
import apiClient from "@/lib/apiClient";

/**
 * Checks if a request has an associated bill
 * @param session The user session with authentication token
 * @param requestId The ID of the request to check
 * @returns A promise that resolves to an object with the check result
 */
export const checkHasBill = async (
  session: Session,
  requestId: number
): Promise<{
  data: boolean;
  success: boolean;
  message: string | null;
}> => {
  try {
    if (!session?.token) {
      return {
        data: false,
        success: false,
        message: "Authentication token is missing",
      };
    }

    const response = await apiClient.get(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/bills/${requestId}/has-bill`,
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/basic-info?documentId=${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error checking bill status:", error);
    return {
      data: false,
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Unknown error occurred",
    };
  }
};
