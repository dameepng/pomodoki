import { NotFoundError } from "@/core/errors/domain.errors.js";
import taskRepository from "@/infrastructure/repositories/task.repository.js";

export class DeleteTaskUseCase {
  async execute({ taskId, userId }) {
    const deleted = await taskRepository.delete(taskId, userId);

    if (!deleted) {
      throw new NotFoundError("Task");
    }

    return { success: true };
  }
}

const deleteTaskUseCase = new DeleteTaskUseCase();

export default deleteTaskUseCase;
