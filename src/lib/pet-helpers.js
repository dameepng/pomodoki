export const PET_TYPES = ["cat", "dog", "bird", "plant"];

export const PET_STATES = {
  HAPPY: "happy",
  NEUTRAL: "neutral",
  SAD: "sad",
  SLEEPING: "sleeping",
};

const PET_ASSET_STATE_OVERRIDES = {
  dog: {
    sleeping: "sleep",
  },
};

const BREAK_MODES = ["short_break", "long_break"];
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

function toStartOfDay(date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

function getInactiveDayDifference(lastActiveDate) {
  if (!lastActiveDate) {
    return Infinity;
  }

  const parsedDate = new Date(lastActiveDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return Infinity;
  }

  const today = toStartOfDay(new Date());
  const lastActiveDay = toStartOfDay(parsedDate);

  return Math.floor((today.getTime() - lastActiveDay.getTime()) / MILLISECONDS_PER_DAY);
}

export function getPetState({
  currentStreak,
  lastActiveDate,
  isRunning,
  mode,
}) {
  if (isRunning === false && BREAK_MODES.includes(mode)) {
    return PET_STATES.SLEEPING;
  }

  const inactiveDayDifference = getInactiveDayDifference(lastActiveDate);

  if (currentStreak === 0 || inactiveDayDifference > 2) {
    return PET_STATES.SAD;
  }

  if (currentStreak >= 3) {
    return PET_STATES.HAPPY;
  }

  return PET_STATES.NEUTRAL;
}

export function getPetImagePath(petType, petState) {
  const safePetType = PET_TYPES.includes(petType) ? petType : "cat";
  const safePetState = Object.values(PET_STATES).includes(petState)
    ? petState
    : PET_STATES.NEUTRAL;
  const assetPetState =
    PET_ASSET_STATE_OVERRIDES[safePetType]?.[safePetState] ?? safePetState;

  return `/pets/${safePetType}-${assetPetState}.png`;
}

export function getPetMessage(petState, currentStreak) {
  if (petState === PET_STATES.HAPPY && currentStreak >= 7) {
    return `Unstoppable! ${currentStreak} day streak! 🔥`;
  }

  if (petState === PET_STATES.HAPPY) {
    return "I'm so proud of you! 🎉 Keep it up!";
  }

  if (petState === PET_STATES.SAD) {
    return "I miss you... come back and focus! 😢";
  }

  if (petState === PET_STATES.SLEEPING) {
    return "Zzz... resting while you take a break 💤";
  }

  return "Let's focus together! 💪";
}
