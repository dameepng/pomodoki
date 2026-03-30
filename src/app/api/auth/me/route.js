import { NextResponse } from "next/server";

import getCurrentUserUseCase from "@/application/auth/get-current-user.usecase.js";
import { COOKIE_NAME } from "@/core/constants/index.js";
import { AuthenticationError } from "@/core/errors/domain.errors.js";

export async function GET(request) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const user = await getCurrentUserUseCase.execute(token);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
