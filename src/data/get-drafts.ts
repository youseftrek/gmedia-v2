import { LOCALE_CODE } from "@/constants/locale";
import apiClient from "@/lib/apiClient";
import axios from "axios";
import { Session } from "next-auth";

export async function getDrafts(
  session: Session,
  currentPage = 0,
  pageSize = 10,
  locale: string
) {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/drafts?startIndex=${currentPage}&pageSize=${pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
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
      console.error("Drafts API error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } else {
      console.error("Drafts API unknown error:", error);
    }

    return {
      success: false,
      error: "draftsFailedToGet",
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Unknown error",
    };
  }
}
