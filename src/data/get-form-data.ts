import { LOCALE_CODE } from "@/constants/locale";
import { Session } from "@/lib/auth";
import axios from "axios";

export async function getFormData(
  documentTypeBaseId: number,
  session: Session,
  locale: string
) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/form?documentTypeBaseId=${documentTypeBaseId}`,
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
