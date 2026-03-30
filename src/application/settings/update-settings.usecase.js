import { ValidationError } from "@/core/errors/domain.errors.js";
import settingsRepository from "@/infrastructure/repositories/settings.repository.js";

const PET_TYPES = ["cat", "dog", "bird", "plant"];
const AMBIENT_SOUNDS = [
  "rain",
  "brown_noise",
  "coffee_shop",
  "forest",
  "ocean",
  "fireplace",
  "none",
];

const isValidDuration = (value, min, max) =>
  Number.isFinite(value) && value >= min && value <= max;

export class UpdateSettingsUseCase {
  async execute(userId, data) {
    if (
      data.focusDuration !== undefined &&
      !isValidDuration(data.focusDuration, 60, 7200)
    ) {
      throw new ValidationError(
        "focusDuration harus antara 60 dan 7200 detik",
      );
    }

    if (
      data.shortBreakDuration !== undefined &&
      !isValidDuration(data.shortBreakDuration, 60, 3600)
    ) {
      throw new ValidationError(
        "shortBreakDuration harus antara 60 dan 3600 detik",
      );
    }

    if (
      data.longBreakDuration !== undefined &&
      !isValidDuration(data.longBreakDuration, 60, 7200)
    ) {
      throw new ValidationError(
        "longBreakDuration harus antara 60 dan 7200 detik",
      );
    }

    if (
      data.petType !== undefined &&
      !PET_TYPES.includes(data.petType)
    ) {
      throw new ValidationError(
        "petType harus salah satu dari: cat, dog, bird, plant",
      );
    }

    if (
      data.ambientSound !== undefined &&
      !AMBIENT_SOUNDS.includes(data.ambientSound)
    ) {
      throw new ValidationError(
        "ambientSound harus salah satu dari: rain, brown_noise, coffee_shop, forest, ocean, fireplace, none",
      );
    }

    return settingsRepository.upsert(userId, data);
  }
}

const updateSettingsUseCase = new UpdateSettingsUseCase();

export default updateSettingsUseCase;
