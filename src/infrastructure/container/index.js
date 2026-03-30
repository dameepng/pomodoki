import registerUseCase from "@/application/auth/register.usecase.js";
import loginUseCase from "@/application/auth/login.usecase.js";
import getCurrentUserUseCase from "@/application/auth/get-current-user.usecase.js";
import createSessionUseCase from "@/application/sessions/create-session.usecase.js";
import getStatsUseCase from "@/application/sessions/get-stats.usecase.js";
import getSettingsUseCase from "@/application/settings/get-settings.usecase.js";
import updateSettingsUseCase from "@/application/settings/update-settings.usecase.js";
import updateStreakUseCase from "@/application/streaks/update-streak.usecase.js";
import createTaskUseCase from "@/application/tasks/create-task.usecase.js";
import deleteTaskUseCase from "@/application/tasks/delete-task.usecase.js";
import getTasksUseCase from "@/application/tasks/get-tasks.usecase.js";
import updateTaskUseCase from "@/application/tasks/update-task.usecase.js";
import sessionRepository from "@/infrastructure/repositories/session.repository.js";
import settingsRepository from "@/infrastructure/repositories/settings.repository.js";
import streakRepository from "@/infrastructure/repositories/streak.repository.js";
import taskRepository from "@/infrastructure/repositories/task.repository.js";
import userRepository from "@/infrastructure/repositories/user.repository.js";
import hashService from "@/infrastructure/services/hash.service.js";
import jwtService from "@/infrastructure/services/jwt.service.js";

export {
  hashService,
  jwtService,
  settingsRepository,
  sessionRepository,
  streakRepository,
  taskRepository,
  userRepository,
  registerUseCase,
  loginUseCase,
  getCurrentUserUseCase,
  getSettingsUseCase,
  updateSettingsUseCase,
  createSessionUseCase,
  getStatsUseCase,
  updateStreakUseCase,
  createTaskUseCase,
  getTasksUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
};

export default {
  hashService,
  jwtService,
  settingsRepository,
  sessionRepository,
  streakRepository,
  taskRepository,
  userRepository,
  registerUseCase,
  loginUseCase,
  getCurrentUserUseCase,
  getSettingsUseCase,
  updateSettingsUseCase,
  createSessionUseCase,
  getStatsUseCase,
  updateStreakUseCase,
  createTaskUseCase,
  getTasksUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
};

// Phase 5 - Gamification
// No new services or use cases
// Pet logic handled via pet-helpers.js (pure functions)

// Phase 6 - Ambient
// No new services or use cases
// Ambient logic handled via ambient-helpers.js and useAmbient.js
