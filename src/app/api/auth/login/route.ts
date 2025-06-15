import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserLoginSchema } from "@/validations/user-login";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = UserLoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields!" }, { status: 400 });
    }

    const { username, password, captchaToken, guid } = validatedFields.data;

    // Make the API call to your auth endpoint
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`,
      {
        username,
        password,
        captchaToken,
        guid,
      }
    );

    if (res.status !== 200 || !res.data.data.token) {
      return NextResponse.json(
        { error: "Invalid email or password!" },
        { status: 401 }
      );
    }

    const { token, user } = res.data.data;

    // Set the token in an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 5, // 5 hours
      path: "/",
    });

    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 5, // 5 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      session: {
        user,
        token,
      },
    });
  } catch (error: any) {
    console.error("Auth error:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    return NextResponse.json(
      { error: error?.message || "Invalid email or password!" },
      { status: 401 }
    );
  }
}
