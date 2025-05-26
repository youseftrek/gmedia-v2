import apiClient from "@/lib/apiClient";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";

export const getCalendar = async (session: Session) => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/certificate/due-dates`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while getting calendar:", error);

    // Handle 401 Unauthorized errors
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      console.log("Authentication failed, redirecting to login");
      redirect("/auth/login?callbackUrl=/dashboard&error=session_expired");
    }

    // Return empty data on error
    return {
      success: false,
      data: {},
      message: "Failed to fetch calendar data",
    };
  }
};
