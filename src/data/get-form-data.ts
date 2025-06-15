import { LOCALE_CODE } from "@/constants/locale";
import apiClient from "@/lib/apiClient";
import { Session } from "@/lib/auth";

export async function getFormData(
  documentTypeBaseId: number,
  session: Session,
  locale: string
) {
  try {
    const res = await apiClient.get(
      `/request/form?documentTypeBaseId=${documentTypeBaseId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
          "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
        },
      }
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Error while getting form data:", error);
    return {
      success: false,
      error: {
        message: "Failed to retrieve form data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
