import axios from "axios";

export async function getCaptcha() {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/captcha`
    );
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: "captchaFailedToGet" };
  }
}
