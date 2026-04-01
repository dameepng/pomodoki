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
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={isRunning ? pause : start}
        className="px-12 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
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
        className="px-5 py-2.5 rounded-full text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)] transition-colors border border-[var(--border-default)]"
      >
        Reset
      </button>

      <button
        type="button"
        onClick={skip}
        className="px-5 py-2.5 rounded-full text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)] transition-colors border border-[var(--border-default)]"
      >
        Skip
      </button>
    </div>
  );
}
