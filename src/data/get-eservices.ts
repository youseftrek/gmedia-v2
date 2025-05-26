import { LOCALE_CODE } from "@/constants/locale";
import apiClient from "@/lib/apiClient";

export async function getEservices(locale: string) {
  try {
    const res = await apiClient.get("/eservices/anonymous", {
      headers: {
        "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
      },
    });

    console.log("API CLIENT RES: ", res);
    return { success: true, data: res };
  } catch (error) {
    console.log(error);
    return { success: false, error: "servicesFailedToGet" };
  }
}
