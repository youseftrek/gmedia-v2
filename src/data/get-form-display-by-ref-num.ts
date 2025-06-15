import axios from "axios";
import { Session } from "@/lib/auth";

export async function getFormDisplayByRefNum(session: Session, refId: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/form-display?documentId=${refId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected data structure
    if (response.data && response.status === 200) {
      // Assuming the API returns { success: boolean, data: any[] } structure
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || {},
      };
    } else {
      console.error("Unexpected response format:", response.data);
      return { success: false, error: "invalidResponseFormat" };
    }
  } catch (error) {
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      console.error("Form display error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } else {
      console.error("Form display unknown error:", error);
    }

    return {
      success: false,
      error: "formDisplayFailedToGet",
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Unknown error",
    };
  }
}
