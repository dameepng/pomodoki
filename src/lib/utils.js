export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return String(dateString);
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`;
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function startOfDay(date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

export function getDaysDiff(dateString) {
  const targetDate = new Date(dateString);

  if (Number.isNaN(targetDate.getTime())) {
    return Number.NaN;
  }

  const today = startOfDay(new Date());
  const targetDay = startOfDay(targetDate);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.floor((today.getTime() - targetDay.getTime()) / millisecondsPerDay);
}
