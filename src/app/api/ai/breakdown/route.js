import { NextResponse } from "next/server";

import breakdownTaskUseCase from "@/application/ai/breakdown-task.usecase.js";
import { ValidationError } from "@/core/errors/domain.errors.js";
import { getAuthUser } from "@/lib/api-helpers.js";

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskTitle } = await request.json();
    const { subtasks } = await breakdownTaskUseCase.execute({ taskTitle });

    return NextResponse.json({ subtasks }, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message === "AI service unavailable") {
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
