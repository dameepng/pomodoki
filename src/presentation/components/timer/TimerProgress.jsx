"use client";

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (safeSeconds % 60).toString().padStart(2, "0");

  return `${mins}:${secs}`;
};

const MODE_COLORS = {
  focus: "#E85D3F",
  short_break: "#4ECCA3",
  long_break: "#6C8EBF",
};

const MODE_BADGES = {
  focus: "Focus Session",
  short_break: "Short Break",
  long_break: "Long Break",
};

const CRITICAL_THRESHOLD_SECONDS = 10;

export default function TimerProgress({
  timeLeft,
  totalTime,
  mode,
  isRunning = false,
}) {
  const svgSize = 260;
  const center = svgSize / 2;
  const radius = 112;
  const circumference = 2 * Math.PI * radius;
  const safeTotalTime = Math.max(totalTime || 0, 1);
  const progressRatio = Math.max(0, Math.min(timeLeft / safeTotalTime, 1));
  const elapsedRatio = 1 - progressRatio;
  const strokeDashoffset = circumference * elapsedRatio;
  const strokeColor = MODE_COLORS[mode] || MODE_COLORS.focus;
  const ringOpacity =
    progressRatio === 0 ? 0 : Math.min(1, 0.24 + progressRatio * 0.76);
  const ringStrokeWidth = 7 + progressRatio * 5;
  const criticalThreshold = Math.min(CRITICAL_THRESHOLD_SECONDS, safeTotalTime);
  const isCritical = isRunning && timeLeft > 0 && timeLeft <= criticalThreshold;
  const ringTransition = isRunning
    ? "stroke-dashoffset 1000ms linear, opacity 1000ms linear, stroke-width 1000ms ease, filter 350ms ease"
    : "stroke-dashoffset 500ms ease, opacity 300ms ease, stroke-width 500ms ease, filter 300ms ease";

  return (
    <div
      className={`relative flex items-center justify-center ${
        isCritical ? "timer-countdown-ring" : ""
      }`}
      style={{ width: svgSize, height: svgSize }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--ring-color)"
          strokeWidth="8"
          opacity="0.9"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={ringStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            opacity: ringOpacity,
            transition: ringTransition,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex flex-col items-center text-center"
          style={{
            transform: `scale(${0.96 + progressRatio * 0.04})`,
            transition: "transform 1000ms linear",
          }}
        >
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--text-muted)] mb-3">
            {MODE_BADGES[mode] || MODE_BADGES.focus}
          </span>
          <span
            className={`font-mono text-[56px] font-medium leading-none tracking-tight ${
              isCritical ? "timer-countdown-text" : ""
            }`}
            style={{ color: strokeColor }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
}
