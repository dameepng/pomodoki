"use client";

import Link from "next/link";

import StatsOverview from "@/presentation/components/stats/StatsOverview.jsx";
import ProductivityChart from "@/presentation/components/stats/ProductivityChart.jsx";
import StreakDisplay from "@/presentation/components/stats/StreakDisplay.jsx";
import Button from "@/presentation/components/ui/Button.jsx";
import ErrorBoundary from "@/presentation/components/ui/ErrorBoundary.jsx";
import Spinner from "@/presentation/components/ui/Spinner.jsx";
import useStats from "@/presentation/hooks/useStats.js";

const PERIOD_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "all", label: "All Time" },
];

export default function StatsPage() {
  const { stats, isLoading, period, setPeriod } = useStats();

  return (
    <ErrorBoundary>
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-red-500">
            Progress
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Statistics
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => {
            const isActive = period === option.id;

            return (
              <Button
                key={option.id}
                size="sm"
                variant={isActive ? "primary" : "secondary"}
                className="rounded-full"
                onClick={() => setPeriod(option.id)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4 text-red-500">
            <Spinner size="md" />
          </div>
        ) : null}

        <StreakDisplay
          currentStreak={stats?.currentStreak || 0}
          longestStreak={stats?.longestStreak || 0}
        />

        <StatsOverview stats={stats} />

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Focus Time Chart
            </h2>
            <p className="text-sm text-slate-500">Daily Focus Time</p>
          </div>

          <ProductivityChart dailyFocusTime={stats?.dailyFocusTime || []} />
        </section>

        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-red-500 transition hover:text-red-600"
          >
            ← Back to Timer
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
}
