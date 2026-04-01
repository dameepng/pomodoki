"use client";

import { formatDate } from "@/lib/utils";

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

function StatCard({ label, value, valueClass = "" }) {
  return (
    <div className="flex flex-col rounded-2xl bg-[var(--bg-card)] p-5 shadow-card border border-[var(--border-default)] transition-colors duration-200">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] truncate">
        {label}
      </h3>
      <div className={`mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] truncate ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col rounded-2xl bg-[var(--bg-card)] p-5 shadow-card border border-[var(--border-default)]"
        >
          <div className="mb-3 h-4 w-24 animate-pulse rounded bg-[var(--bg-elevated)]" />
          <div className="h-8 w-28 animate-pulse rounded bg-[var(--bg-elevated)]" />
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
      />
      <StatCard label="Pomodoros" value={focusSessions} />
      <StatCard
        label="Current Streak"
        value={stats.currentStreak || 0}
      />
      <StatCard
        label="Longest Streak"
        value={stats.longestStreak || 0}
      />
      <StatCard
        label="Most Productive Date"
        value={stats.mostProductiveDay?.date ? formatDate(stats.mostProductiveDay.date) : "No data"}
        valueClass="text-lg"
      />
      <StatCard label="Focus Sessions" value={focusSessions} />
    </div>
  );
}
