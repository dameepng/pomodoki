import { DEFAULT_SETTINGS } from "@/core/entities/settings.entity.js";
import settingsRepository from "@/infrastructure/repositories/settings.repository.js";

export class GetSettingsUseCase {
  async execute(userId) {
    const settings = await settingsRepository.findByUserId(userId);

    if (settings) {
      return settings;
    }

    return {
      ...DEFAULT_SETTINGS,
      userId,
    };
  }
}

const getSettingsUseCase = new GetSettingsUseCase();

export default getSettingsUseCase;
