import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/core/errors/domain.errors.js";
import taskRepository from "@/infrastructure/repositories/task.repository.js";

export class UpdateTaskUseCase {
  constructor() {
    this.errors = {
      ValidationError,
      NotFoundError,
      ForbiddenError,
    };
  }

  async execute({ taskId, userId, data }) {
    const { ValidationError, NotFoundError } = this.errors;
    const updateData = { ...data };

    if (updateData.title !== undefined) {
      updateData.title = String(updateData.title ?? "").trim();

      if (!updateData.title) {
        throw new ValidationError("Title tidak boleh kosong");
      }

      if (updateData.title.length > 200) {
        throw new ValidationError("Title maksimal 200 karakter");
      }
    }

    if (updateData.pomodoroCount !== undefined) {
      if (
        !Number.isFinite(updateData.pomodoroCount) ||
        updateData.pomodoroCount < 0
      ) {
        throw new ValidationError("pomodoroCount harus angka >= 0");
      }
    }

    const task = await taskRepository.update(taskId, userId, updateData);

    if (!task) {
      throw new NotFoundError("Task");
    }

    return task;
  }
}

const updateTaskUseCase = new UpdateTaskUseCase();

export default updateTaskUseCase;
