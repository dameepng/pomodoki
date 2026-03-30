import { NextResponse } from "next/server";

import createTaskUseCase from "@/application/tasks/create-task.usecase.js";
import getTasksUseCase from "@/application/tasks/get-tasks.usecase.js";
import { ValidationError } from "@/core/errors/domain.errors.js";
import { getAuthUser } from "@/lib/api-helpers.js";

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await getTasksUseCase.execute(authUser.userId);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await request.json();
    const task = await createTaskUseCase.execute({
      userId: authUser.userId,
      title,
    });

    return NextResponse.json({ task }, { status: 201 });
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
