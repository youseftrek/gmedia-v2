import { Session } from "@/lib/auth";
import axios from "axios";

export async function changeLang(session: Session, language: number) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/language`,
      { language },
      { headers: { Authorization: `Bearer ${session?.token}` } }
    );

    return { success: true, data: res };
  } catch (error) {
    console.log(error);
    return { success: false, error: "changeLangFailedToGet" };
  }
}
