import { NextResponse } from "next/server";

import loginUseCase from "@/application/auth/login.usecase.js";
import { COOKIE_NAME } from "@/core/constants/index.js";
import {
  AuthenticationError,
  ValidationError,
} from "@/core/errors/domain.errors.js";

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const { user, token } = await loginUseCase.execute({
      username,
      password,
    });

    const response = NextResponse.json({ user }, { status: 200 });

    response.cookies.set(COOKIE_NAME, token, authCookieOptions);

    return response;
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
