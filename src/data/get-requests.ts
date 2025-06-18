import { LOCALE_CODE } from "@/constants/locale";
import { Session } from "@/lib/auth";
import axios from "axios";

export async function getRequests(
  session: Session,
  currentPage = 0,
  pageSize = 10
) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/my-requests?startIndex=${currentPage}&pageSize=${pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
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

export async function getMyRequests(
  session: Session,
  currentPage = 0,
  pageSize = 10,
  locale: string
) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/inbox?startIndex=${currentPage}&pageSize=${pageSize}`,
      {
        headers: {
          "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
          Authorization: `Bearer ${session?.token}`,
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
