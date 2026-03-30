"use client";

function formatDuration(seconds) {
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

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200"
        >
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-28 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export default function StatsOverview({ stats }) {
  if (!stats) {
    return <StatsSkeleton />;
  }

  const focusSessions = stats?.sessionCount?.focus || 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Total Focus Time"
        value={formatDuration(stats.totalFocusTime || 0)}
        icon="⏱️"
      />
      <StatCard label="Pomodoros" value={focusSessions} icon="🍅" />
      <StatCard
        label="Current Streak"
        value={`${stats.currentStreak || 0} 🔥`}
        icon="🔥"
      />
      <StatCard
        label="Longest Streak"
        value={`${stats.longestStreak || 0} 🏆`}
        icon="🏆"
      />
      <StatCard
        label="Most Productive Day"
        value={stats.mostProductiveDay?.date || "No data yet"}
        icon="📅"
      />
      <StatCard label="Focus Sessions" value={focusSessions} icon="📈" />
    </div>
  );
}
