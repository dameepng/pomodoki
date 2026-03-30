import { NextResponse } from "next/server";

import getSettingsUseCase from "@/application/settings/get-settings.usecase.js";
import updateSettingsUseCase from "@/application/settings/update-settings.usecase.js";
import { ValidationError } from "@/core/errors/domain.errors.js";
import { getAuthUser } from "@/lib/api-helpers.js";

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getSettingsUseCase.execute(authUser.userId);

    return NextResponse.json({ settings }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const settings = await updateSettingsUseCase.execute(authUser.userId, data);

    return NextResponse.json({ settings }, { status: 200 });
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
