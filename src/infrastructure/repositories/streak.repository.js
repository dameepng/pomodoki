import { eq } from "drizzle-orm";

import db from "@/infrastructure/database/drizzle.js";
import { streaks } from "@/infrastructure/database/schema.js";

const pickDefinedFields = (data) =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

export class StreakRepository {
  async findByUserId(userId) {
    const [streak] = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, userId))
      .limit(1);

    return streak ?? null;
  }

  async upsert(userId, { currentStreak, longestStreak, lastActiveDate }) {
    const updateData = pickDefinedFields({
      currentStreak,
      longestStreak,
      lastActiveDate,
    });

    const [streak] = await db
      .insert(streaks)
      .values({
        userId,
        ...updateData,
      })
      .onConflictDoUpdate({
        target: streaks.userId,
        set: updateData,
      })
      .returning();

    return streak ?? null;
  }
}

export const streakRepository = new StreakRepository();

export default streakRepository;
