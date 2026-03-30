import { and, eq, gte, lte, sql } from "drizzle-orm";

import db from "@/infrastructure/database/drizzle.js";
import { pomodoroSessions } from "@/infrastructure/database/schema.js";

const buildSessionFilters = (userId, options = {}) => {
  const conditions = [eq(pomodoroSessions.userId, userId)];

  if (options.from) {
    conditions.push(gte(pomodoroSessions.completedAt, options.from));
  }

  if (options.to) {
    conditions.push(lte(pomodoroSessions.completedAt, options.to));
  }

  return conditions;
};

export class SessionRepository {
  async create({ userId, taskId, duration, type }) {
    const [session] = await db
      .insert(pomodoroSessions)
      .values({
        userId,
        taskId: taskId ?? null,
        duration,
        type,
      })
      .returning();

    return session ?? null;
  }

  async findByUserId(userId, options = {}) {
    const conditions = buildSessionFilters(userId, options);

    return db
      .select()
      .from(pomodoroSessions)
      .where(and(...conditions));
  }

  async getTotalFocusTime(userId, options = {}) {
    const conditions = [
      ...buildSessionFilters(userId, options),
      eq(pomodoroSessions.type, "focus"),
    ];

    const [result] = await db
      .select({
        totalDuration: sql`coalesce(sum(${pomodoroSessions.duration}), 0)`,
      })
      .from(pomodoroSessions)
      .where(and(...conditions));

    return Number(result?.totalDuration ?? 0);
  }

  async getSessionCountByType(userId, options = {}) {
    const conditions = buildSessionFilters(userId, options);

    const rows = await db
      .select({
        type: pomodoroSessions.type,
        count: sql`count(*)`,
      })
      .from(pomodoroSessions)
      .where(and(...conditions))
      .groupBy(pomodoroSessions.type);

    const counts = {
      focus: 0,
      short_break: 0,
      long_break: 0,
    };

    for (const row of rows) {
      counts[row.type] = Number(row.count ?? 0);
    }

    return counts;
  }

  async getDailyFocusTime(userId, options = {}) {
    const day = sql`date(${pomodoroSessions.completedAt})`;
    const conditions = [
      ...buildSessionFilters(userId, options),
      eq(pomodoroSessions.type, "focus"),
    ];

    const rows = await db
      .select({
        date: day,
        totalDuration: sql`coalesce(sum(${pomodoroSessions.duration}), 0)`,
      })
      .from(pomodoroSessions)
      .where(and(...conditions))
      .groupBy(day)
      .orderBy(day);

    return rows.map((row) => ({
      date: String(row.date),
      totalDuration: Number(row.totalDuration ?? 0),
    }));
  }
}

export const sessionRepository = new SessionRepository();

export default sessionRepository;
