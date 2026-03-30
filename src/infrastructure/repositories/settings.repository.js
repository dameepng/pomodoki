import { eq } from "drizzle-orm";

import { DEFAULT_SETTINGS } from "@/core/entities/settings.entity.js";
import db from "@/infrastructure/database/drizzle.js";
import { userSettings } from "@/infrastructure/database/schema.js";

const pickDefinedFields = (data) =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

export class SettingsRepository {
  async findByUserId(userId) {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    return settings ?? null;
  }

  async upsert(userId, data) {
    const updateData = pickDefinedFields(data);

    if (Object.keys(updateData).length === 0) {
      const [insertedSettings] = await db
        .insert(userSettings)
        .values({
          userId,
          ...DEFAULT_SETTINGS,
        })
        .onConflictDoNothing()
        .returning();

      return insertedSettings ?? this.findByUserId(userId);
    }

    const [settings] = await db
      .insert(userSettings)
      .values({
        userId,
        ...DEFAULT_SETTINGS,
        ...updateData,
      })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: updateData,
      })
      .returning();

    return settings ?? null;
  }
}

export const settingsRepository = new SettingsRepository();

export default settingsRepository;
