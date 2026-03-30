"use client";

import useTimer from "@/presentation/hooks/useTimer.js";

const MODE_BUTTON_CLASSES = {
  focus: "bg-red-500 hover:bg-red-600",
  short_break: "bg-green-500 hover:bg-green-600",
  long_break: "bg-blue-500 hover:bg-blue-600",
};

export default function TimerControls() {
  const { isRunning, mode, start, pause, reset, skip } = useTimer();
  const primaryButtonClass =
    MODE_BUTTON_CLASSES[mode] || MODE_BUTTON_CLASSES.focus;

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={isRunning ? pause : start}
        className={`min-w-36 rounded-2xl px-6 py-3 text-base font-semibold text-white shadow-sm transition ${primaryButtonClass}`}
      >
        {isRunning ? "Pause" : "Start"}
      </button>

      <button
        type="button"
        onClick={reset}
        className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
      >
        Reset
      </button>

      <button
        type="button"
        onClick={skip}
        className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
      >
        Skip
      </button>
    </div>
  );
}
