import axios from "axios";
import { Session } from "next-auth";

export async function getCurrentUserLang(session: Session) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/current-language`,
      { headers: { Authorization: `Bearer ${session?.token}` } }
    );

    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: "changeLangFailedToGet" };
  }
}
