import { LOCALE_CODE } from "@/constants/locale";
import { Session } from "@/lib/auth";
import axios from "axios";

export async function getCertificate(
  id: number,
  session: Session,
  locale: string
) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/certificate/${id}/download`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
          "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
        },
        responseType: "arraybuffer",
      }
    );

    // Convert ArrayBuffer to Base64 string for safe passage to client components
    const base64Data = Buffer.from(res.data).toString("base64");

    return { success: true, data: base64Data };
  } catch (error) {
    return { success: false, error: "certificateFailedToGet" };
  }
}
