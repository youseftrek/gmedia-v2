import { LOCALE_CODE } from "@/constants/locale";
import apiClient from "@/lib/apiClient";
import { Session } from "next-auth";

export async function getClosedRequests(
  session: Session,
  currentPage = 0,
  pageSize = 10,
  locale: string
) {
  try {
    const response = await apiClient.get(
      `/request/my-requests?status=3&startIndex=${currentPage}&pageSize=${pageSize}`,
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
    console.error("Requests API error:", error);
    return {
      success: false,
      error: "requestsFailedToGet",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
