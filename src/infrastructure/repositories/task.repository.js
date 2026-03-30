import { and, desc, eq, sql } from "drizzle-orm";

import db from "@/infrastructure/database/drizzle.js";
import { tasks } from "@/infrastructure/database/schema.js";

const pickDefinedFields = (data) =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

const buildTaskOwnershipFilter = (id, userId) =>
  and(eq(tasks.id, id), eq(tasks.userId, userId));

export class TaskRepository {
  async findById(id) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);

    return task ?? null;
  }

  async findByUserId(userId) {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async create({ userId, title }) {
    const [task] = await db
      .insert(tasks)
      .values({
        userId,
        title,
        completed: false,
        pomodoroCount: 0,
      })
      .returning();

    return task ?? null;
  }

  async update(id, userId, data) {
    const updateData = pickDefinedFields(data);

    if (Object.keys(updateData).length === 0) {
      const [task] = await db
        .select()
        .from(tasks)
        .where(buildTaskOwnershipFilter(id, userId))
        .limit(1);

      return task ?? null;
    }

    const [task] = await db
      .update(tasks)
      .set(updateData)
      .where(buildTaskOwnershipFilter(id, userId))
      .returning();

    return task ?? null;
  }

  async delete(id, userId) {
    const [deletedTask] = await db
      .delete(tasks)
      .where(buildTaskOwnershipFilter(id, userId))
      .returning({ id: tasks.id });

    return Boolean(deletedTask);
  }

  async incrementPomodoro(id, userId) {
    const [task] = await db
      .update(tasks)
      .set({
        pomodoroCount: sql`${tasks.pomodoroCount} + 1`,
      })
      .where(buildTaskOwnershipFilter(id, userId))
      .returning();

    return task ?? null;
  }
}

export const taskRepository = new TaskRepository();

export default taskRepository;
