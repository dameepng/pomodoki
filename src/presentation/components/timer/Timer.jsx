"use client";

import useTimer from "@/presentation/hooks/useTimer.js";

import TimerControls from "./TimerControls.jsx";
import TimerProgress from "./TimerProgress.jsx";

const MODE_LABELS = {
  focus: "Focus Time",
  short_break: "Short Break",
  long_break: "Long Break",
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
  const { mode, timeLeft, pomodoroCount, settings } = useTimer();
  const activeSettings = settings ?? DEFAULT_SETTINGS;
  const totalTime = getTotalTimeByMode(mode, activeSettings);
  const completedDots = pomodoroCount % 4;

  return (
    <section className="flex flex-col items-center gap-8 px-6 py-10">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Pomodoki Timer
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          {MODE_LABELS[mode] || MODE_LABELS.focus}
        </h2>
      </div>

      <TimerProgress timeLeft={timeLeft} totalTime={totalTime} mode={mode} />

      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: 4 }, (_, index) => {
          const isCompleted = index < completedDots;

          return (
            <span
              key={index}
              className={`h-3 w-3 rounded-full border transition ${
                isCompleted
                  ? "border-slate-900 bg-slate-900"
                  : "border-slate-300 bg-transparent"
              }`}
            />
          );
        })}
      </div>

      <TimerControls />
    </section>
  );
}
