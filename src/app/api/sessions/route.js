import { NextResponse } from "next/server";

import createSessionUseCase from "@/application/sessions/create-session.usecase.js";
import { ValidationError } from "@/core/errors/domain.errors.js";
import { getAuthUser } from "@/lib/api-helpers.js";

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, duration, type } = await request.json();
    const session = await createSessionUseCase.execute({
      userId: authUser.userId,
      taskId: taskId || null,
      duration,
      type,
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
