"use server";

export async function nafathLogin(formData: FormData) {
  const { username, password, captchaToken, guid } =
    Object.fromEntries(formData);
  if (
    username === "nafathLoginProvider" &&
    password === "nafathLoginProvider" &&
    captchaToken === "nafathLoginProvider" &&
    guid === "nafathLoginProvider"
  ) {
    return {
      success: true,
      message: "Login successful",
    };
  }
  return { success: false, message: "Login failed" };
}
