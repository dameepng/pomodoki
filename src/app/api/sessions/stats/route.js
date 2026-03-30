import { NextResponse } from "next/server";

import getStatsUseCase from "@/application/sessions/get-stats.usecase.js";
import { getAuthUser } from "@/lib/api-helpers.js";

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const period = request.nextUrl.searchParams.get("period") || "all";
    const stats = await getStatsUseCase.execute(authUser.userId, { period });

    return NextResponse.json({ stats }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
