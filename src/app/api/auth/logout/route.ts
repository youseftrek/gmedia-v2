import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  cookieStore.delete("user");

  return NextResponse.json({
    message: "Logged out successfully",
    success: true,
  });
}
