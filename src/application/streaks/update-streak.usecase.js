import streakRepository from "@/infrastructure/repositories/streak.repository.js";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeDateString = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return formatDate(value);
};

export class UpdateStreakUseCase {
  async execute(userId) {
    const streak = await streakRepository.findByUserId(userId);
    const now = new Date();
    const today = formatDate(now);

    if (!streak) {
      return streakRepository.upsert(userId, {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
      });
    }

    const lastActiveDate = normalizeDateString(streak.lastActiveDate);

    if (lastActiveDate === today) {
      return streak;
    }

    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = formatDate(yesterdayDate);

    const currentStreak =
      lastActiveDate === yesterday ? streak.currentStreak + 1 : 1;
    const longestStreak = Math.max(currentStreak, streak.longestStreak);

    return streakRepository.upsert(userId, {
      currentStreak,
      longestStreak,
      lastActiveDate: today,
    });
  }
}

const updateStreakUseCase = new UpdateStreakUseCase();

export default updateStreakUseCase;
