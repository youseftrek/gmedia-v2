import { LOCALE_CODE } from "@/constants/locale";
import apiClient from "@/lib/apiClient";

export async function getEservices(locale: string) {
  try {
    const res = await apiClient.get("/eservices/anonymous", {
      headers: {
        "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
      },
    });

    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: "servicesFailedToGet" };
  }
}
