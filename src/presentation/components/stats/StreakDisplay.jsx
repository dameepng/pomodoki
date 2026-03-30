"use client";

export default function StreakDisplay({ currentStreak, longestStreak }) {
  const isResting = currentStreak === 0;

  return (
    <div className="flex gap-4">
      <div
        className={`flex-1 rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 ${
          isResting ? "text-slate-400" : "text-slate-900"
        }`}
      >
        <div className="mb-3 text-2xl" aria-hidden="true">
          {isResting ? "💤" : "🔥"}
        </div>
        <div className="text-4xl font-bold">{currentStreak}</div>
        <p className="mt-1 text-sm font-medium">day streak</p>
      </div>

      <div className="flex-1 rounded-2xl bg-white p-5 text-slate-900 shadow-md ring-1 ring-slate-200">
        <div className="mb-3 text-2xl" aria-hidden="true">
          🏆
        </div>
        <div className="text-4xl font-bold">{longestStreak}</div>
        <p className="mt-1 text-sm font-medium">best streak</p>
      </div>
    </div>
  );
}
