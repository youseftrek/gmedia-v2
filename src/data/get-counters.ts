import { Session } from "@/lib/auth";
import { redirect } from "next/navigation";
import axios from "axios";
import { AxiosError } from "axios";

export async function getCounters(session: Session) {
  try {
    const countersRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/counters`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    return {
      success: true,
      data: countersRes.data.data,
    };
  } catch (error) {
    console.error("Error while getting Counters data:", error);

    // Handle 401 Unauthorized errors
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      redirect("/auth/login?callbackUrl=/dashboard&error=session_expired");
    }

    return {
      success: false,
      data: null,
    };
  }
}
