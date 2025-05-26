import apiClient from "@/lib/apiClient";

export async function getCaptcha() {
  try {
    const res = await apiClient.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/captcha`
    );
    return { success: true, data: res };
  } catch (error) {
    console.log(error);
    return { success: false, error: "captchaFailedToGet" };
  }
}
