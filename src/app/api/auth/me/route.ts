import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const user = request.cookies.get("user")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", success: false, session: null },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      message: "Session found",
      success: true,
      session: { token, user: JSON.parse(user || "{}") },
    },
    { status: 200 }
  );
}
