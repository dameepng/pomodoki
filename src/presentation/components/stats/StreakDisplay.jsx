"use client";

export default function StreakDisplay({ currentStreak, longestStreak }) {
  const isResting = currentStreak === 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Current Streak */}
      <div className={`flex flex-col rounded-2xl bg-[var(--bg-card)] p-6 shadow-card border border-[var(--border-default)] transition-colors duration-200 ${
        isResting ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">
            Current Streak
          </h3>
          <span className="text-xl" aria-hidden="true">
            {isResting ? "💤" : "🔥"}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold tracking-tight">{currentStreak}</div>
          <p className="text-sm font-medium opacity-80">days</p>
        </div>
      </div>

      {/* Longest Streak */}
      <div className="flex flex-col rounded-2xl bg-[var(--bg-card)] p-6 shadow-card border border-[var(--border-default)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">
            Longest Streak
          </h3>
          <span className="text-xl" aria-hidden="true">🏆</span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold tracking-tight">{longestStreak}</div>
          <p className="text-sm font-medium opacity-80">days</p>
        </div>
      </div>
    </div>
  );
}
