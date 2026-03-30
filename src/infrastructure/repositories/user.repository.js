import { eq } from "drizzle-orm";

import { DEFAULT_SETTINGS } from "@/core/entities/settings.entity.js";
import db from "@/infrastructure/database/drizzle.js";
import {
  streaks,
  userSettings,
  users,
} from "@/infrastructure/database/schema.js";

export class UserRepository {
  async findById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return user ?? null;
  }

  async findByUsername(username) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return user ?? null;
  }

  async existsByUsername(username) {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return Boolean(user);
  }

  async create({ username, password }) {
    return db.transaction(async (tx) => {
      const [createdUser] = await tx
        .insert(users)
        .values({ username, password })
        .returning({
          id: users.id,
          username: users.username,
          createdAt: users.createdAt,
        });

      if (!createdUser) {
        return null;
      }

      await tx.insert(userSettings).values({
        userId: createdUser.id,
        ...DEFAULT_SETTINGS,
      });

      await tx.insert(streaks).values({
        userId: createdUser.id,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
      });

      return createdUser;
    });
  }

  async findByIdWithoutPassword(id) {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }
}

export const userRepository = new UserRepository();

export default userRepository;
