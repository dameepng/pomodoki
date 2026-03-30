import taskRepository from "@/infrastructure/repositories/task.repository.js";

export class GetTasksUseCase {
  async execute(userId) {
    return taskRepository.findByUserId(userId);
  }
}

const getTasksUseCase = new GetTasksUseCase();

export default getTasksUseCase;
