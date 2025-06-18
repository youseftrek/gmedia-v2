import { LOCALE_CODE } from "@/constants/locale";
import axios from "axios";

export async function getEservices(locale: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/eservices/anonymous`,
      {
        headers: {
          "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
        },
      }
    );

    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: "servicesFailedToGet" };
  }
}
