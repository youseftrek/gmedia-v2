import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Missing code parameter" },
        { status: 400 }
      );
    }

    // Make the API call to your auth endpoint
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/nafath`,
      { code }
    );

    if (res.status !== 200 || !res.data.data.token) {
      return NextResponse.json(
        { error: "Nafath authentication failed!" },
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
    console.error("Nafath auth error:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    return NextResponse.json(
      { error: error?.message || "Nafath authentication failed!" },
      { status: 401 }
    );
  }
}
