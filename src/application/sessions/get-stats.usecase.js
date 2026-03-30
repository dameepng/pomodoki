import sessionRepository from "@/infrastructure/repositories/session.repository.js";
import streakRepository from "@/infrastructure/repositories/streak.repository.js";

const PERIODS = {
  TODAY: "today",
  WEEK: "week",
  MONTH: "month",
  ALL: "all",
};

const startOfDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const getStartOfWeek = (date) => {
  const nextDate = startOfDay(date);
  const day = nextDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  nextDate.setDate(nextDate.getDate() + diff);
  return nextDate;
};

const getStartOfMonth = (date) => {
  const nextDate = startOfDay(date);
  nextDate.setDate(1);
  return nextDate;
};

const resolvePeriod = (period) => {
  if (Object.values(PERIODS).includes(period)) {
    return period;
  }

  return PERIODS.ALL;
};

const getFromDate = (period) => {
  const now = new Date();

  if (period === PERIODS.TODAY) {
    return startOfDay(now);
  }

  if (period === PERIODS.WEEK) {
    return getStartOfWeek(now);
  }

  if (period === PERIODS.MONTH) {
    return getStartOfMonth(now);
  }

  return undefined;
};

export class GetStatsUseCase {
  async execute(userId, options = {}) {
    const period = resolvePeriod(options.period || PERIODS.ALL);
    const from = getFromDate(period);

    const [totalFocusTime, sessionCount, dailyFocusTime, streak, mostProductiveDay] =
      await Promise.all([
        sessionRepository.getTotalFocusTime(userId, { from }),
        sessionRepository.getSessionCountByType(userId, { from }),
        sessionRepository.getDailyFocusTime(userId, { from }),
        streakRepository.findByUserId(userId),
        sessionRepository.getMostProductiveDay(userId),
      ]);

    return {
      totalFocusTime,
      sessionCount,
      dailyFocusTime,
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      mostProductiveDay,
      period,
    };
  }
}

const getStatsUseCase = new GetStatsUseCase();

export default getStatsUseCase;
