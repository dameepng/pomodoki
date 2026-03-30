import { SESSION_TYPES } from "@/core/entities/session.entity.js";
import { ValidationError } from "@/core/errors/domain.errors.js";
import updateStreakUseCase from "@/application/streaks/update-streak.usecase.js";
import sessionRepository from "@/infrastructure/repositories/session.repository.js";

export class CreateSessionUseCase {
  async execute({ userId, taskId, duration, type }) {
    if (!Object.values(SESSION_TYPES).includes(type)) {
      throw new ValidationError("Tipe session tidak valid");
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new ValidationError("Duration harus angka positif lebih dari 0");
    }

    const session = await sessionRepository.create({
      userId,
      taskId,
      duration,
      type,
    });

    if (type === SESSION_TYPES.FOCUS) {
      await updateStreakUseCase.execute(userId);
    }

    return session;
  }
}

const createSessionUseCase = new CreateSessionUseCase();

export default createSessionUseCase;
