"use client";

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (safeSeconds % 60).toString().padStart(2, "0");

  return `${mins}:${secs}`;
};

const MODE_STROKE_COLORS = {
  focus: "#E54B4B",
  short_break: "#4CAF50",
  long_break: "#2196F3",
};

export default function TimerProgress({ timeLeft, totalTime, mode }) {
  const radius = 85;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * radius;
  const safeTotalTime = Math.max(totalTime || 0, 1);
  const progressRatio = Math.max(0, Math.min(timeLeft / safeTotalTime, 1));
  const strokeDashoffset = circumference * (1 - progressRatio);
  const strokeColor = MODE_STROKE_COLORS[mode] || MODE_STROKE_COLORS.focus;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="h-72 w-72 -rotate-90 drop-shadow-sm"
        aria-hidden="true"
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="12"
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-5xl font-semibold tracking-tight text-slate-900">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}
