"use client";

import useTimer from "@/presentation/hooks/useTimer.js";

const MODE_COLORS = {
  focus: "#E85D3F",
  short_break: "#4ECCA3",
  long_break: "#6C8EBF",
};

const MODE_SHADOWS = {
  focus: "0 0 32px rgba(232,93,63,0.3)",
  short_break: "0 0 32px rgba(78,204,163,0.3)",
  long_break: "0 0 32px rgba(108,142,191,0.3)",
};

export default function TimerControls() {
  const { isRunning, mode, start, pause, reset, skip } = useTimer();
  const accentColor = MODE_COLORS[mode] || MODE_COLORS.focus;
  const glowShadow = MODE_SHADOWS[mode] || MODE_SHADOWS.focus;

  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-3 sm:max-w-none sm:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <button
        type="button"
        onClick={isRunning ? pause : start}
        className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0 sm:col-span-1 sm:px-8"
        style={{
          backgroundColor: accentColor,
          boxShadow: glowShadow,
        }}
      >
        {isRunning ? "Pause" : "Start"}
      </button>

      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
      >
        Reset
      </button>

      <button
        type="button"
        onClick={skip}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
      >
        Skip
      </button>
    </div>
  );
}
