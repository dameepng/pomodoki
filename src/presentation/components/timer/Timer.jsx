"use client";

import { cn } from "@/lib/utils.js";
import useTimer from "@/presentation/hooks/useTimer.js";

import TimerControls from "./TimerControls.jsx";
import TimerProgress from "./TimerProgress.jsx";

const MODE_OPTIONS = [
  { value: "focus", label: "Focus" },
  { value: "short_break", label: "Break" },
  { value: "long_break", label: "Long Break" },
];

const MODE_COLORS = {
  focus: "#E85D3F",
  short_break: "#4ECCA3",
  long_break: "#6C8EBF",
};

const DEFAULT_SETTINGS = {
  focusDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
};

const getTotalTimeByMode = (mode, settings) => {
  if (mode === "short_break") {
    return settings.shortBreakDuration;
  }

  if (mode === "long_break") {
    return settings.longBreakDuration;
  }

  return settings.focusDuration;
};

export default function Timer() {
  const { mode, timeLeft, isRunning, pomodoroCount, settings, setMode } =
    useTimer();
  const activeSettings = settings ?? DEFAULT_SETTINGS;
  const totalTime = getTotalTimeByMode(mode, activeSettings);
  const completedDots = pomodoroCount % 4;
  const accentColor = MODE_COLORS[mode] || MODE_COLORS.focus;

  return (
    <section className="flex w-full flex-col items-center rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 transition-colors duration-200 sm:p-5 lg:p-6">
      {/* Mode tabs */}
      <div className="mb-5 flex w-full gap-1 rounded-xl bg-[var(--bg-input)] p-1 sm:mb-6">
        {MODE_OPTIONS.map((option) => {
          const isActive = mode === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={cn(
                "flex-1 rounded-lg px-2 py-2.5 text-center text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs",
                isActive
                  ? "text-[var(--text-primary)] bg-[var(--bg-elevated)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Timer ring + digits — this is the focal point */}
      <TimerProgress
        timeLeft={timeLeft}
        totalTime={totalTime}
        mode={mode}
        isRunning={isRunning}
      />

      {/* Session dots */}
      <div className="mt-4 flex gap-2 sm:mt-5">
        {Array.from({ length: 4 }, (_, index) => {
          const isCompleted = index < completedDots;

          return (
            <span
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                !isCompleted && "bg-[var(--bg-elevated)]",
              )}
              style={isCompleted ? { backgroundColor: accentColor } : undefined}
            />
          );
        })}
      </div>

      {/* Session info */}
      <p className="mb-4 mt-2 text-center text-[11px] text-[var(--text-muted)] sm:mb-5">
        {mode === "focus"
          ? `Session ${completedDots + 1} of 4`
          : "Take a break, you earned it"}
      </p>

      {/* Controls */}
      <TimerControls />
    </section>
  );
}
