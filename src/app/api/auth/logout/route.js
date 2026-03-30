import { NextResponse } from "next/server";

import { COOKIE_NAME } from "@/core/constants/index.js";

export async function POST(request) {
  void request;

  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
