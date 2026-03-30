import { ValidationError } from "@/core/errors/domain.errors.js";
import openaiService from "@/infrastructure/services/openai.service.js";

export class BreakdownTaskUseCase {
  async execute({ taskTitle }) {
    const normalizedTaskTitle = taskTitle?.trim();

    if (!normalizedTaskTitle) {
      throw new ValidationError("Task title is required");
    }

    if (normalizedTaskTitle.length > 200) {
      throw new ValidationError("Task title must be 200 characters or less");
    }

    const subtasks = await openaiService.breakdownTask(normalizedTaskTitle);

    return { subtasks };
  }
}

export const breakdownTaskUseCase = new BreakdownTaskUseCase();

export default breakdownTaskUseCase;
