import { ValidationError } from "@/core/errors/domain.errors.js";
import taskRepository from "@/infrastructure/repositories/task.repository.js";

export class CreateTaskUseCase {
  async execute({ userId, title }) {
    const normalizedTitle = String(title ?? "").trim();

    if (!normalizedTitle) {
      throw new ValidationError("Title tidak boleh kosong");
    }

    if (normalizedTitle.length > 200) {
      throw new ValidationError("Title maksimal 200 karakter");
    }

    return taskRepository.create({
      userId,
      title: normalizedTitle,
    });
  }
}

const createTaskUseCase = new CreateTaskUseCase();

export default createTaskUseCase;
