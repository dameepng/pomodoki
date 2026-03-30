import { NextResponse } from "next/server";

import deleteTaskUseCase from "@/application/tasks/delete-task.usecase.js";
import updateTaskUseCase from "@/application/tasks/update-task.usecase.js";
import {
  NotFoundError,
  ValidationError,
} from "@/core/errors/domain.errors.js";
import { getAuthUser } from "@/lib/api-helpers.js";

export async function PATCH(request, { params }) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;
    const data = await request.json();
    const task = await updateTaskUseCase.execute({
      taskId,
      userId: authUser.userId,
      data,
    });

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;
    await deleteTaskUseCase.execute({
      taskId,
      userId: authUser.userId,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
