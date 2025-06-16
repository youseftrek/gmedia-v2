import { LOCALE_CODE } from "@/constants/locale";
import axios from "axios";

export async function getServiceDetails(id: number, locale: string) {
  console.log(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/eservices/${id}/catalog`
  );
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/eservices/${id}/catalog`
    );

    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, error: "serviceDetailsFailedToGet" };
  }
}
