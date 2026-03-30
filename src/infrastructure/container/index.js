import registerUseCase from "@/application/auth/register.usecase.js";
import loginUseCase from "@/application/auth/login.usecase.js";
import getCurrentUserUseCase from "@/application/auth/get-current-user.usecase.js";
import createSessionUseCase from "@/application/sessions/create-session.usecase.js";
import getStatsUseCase from "@/application/sessions/get-stats.usecase.js";
import getSettingsUseCase from "@/application/settings/get-settings.usecase.js";
import updateSettingsUseCase from "@/application/settings/update-settings.usecase.js";
import updateStreakUseCase from "@/application/streaks/update-streak.usecase.js";
import sessionRepository from "@/infrastructure/repositories/session.repository.js";
import settingsRepository from "@/infrastructure/repositories/settings.repository.js";
import streakRepository from "@/infrastructure/repositories/streak.repository.js";
import userRepository from "@/infrastructure/repositories/user.repository.js";
import hashService from "@/infrastructure/services/hash.service.js";
import jwtService from "@/infrastructure/services/jwt.service.js";

export {
  hashService,
  jwtService,
  settingsRepository,
  sessionRepository,
  streakRepository,
  userRepository,
  registerUseCase,
  loginUseCase,
  getCurrentUserUseCase,
  getSettingsUseCase,
  updateSettingsUseCase,
  createSessionUseCase,
  getStatsUseCase,
  updateStreakUseCase,
};

export default {
  hashService,
  jwtService,
  settingsRepository,
  sessionRepository,
  streakRepository,
  userRepository,
  registerUseCase,
  loginUseCase,
  getCurrentUserUseCase,
  getSettingsUseCase,
  updateSettingsUseCase,
  createSessionUseCase,
  getStatsUseCase,
  updateStreakUseCase,
};
