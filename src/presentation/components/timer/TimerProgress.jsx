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

export default function TimerProgress({ timeLeft, totalTime, mode }) {
  const svgSize = 260;
  const center = svgSize / 2;
  const radius = 112;
  const circumference = 2 * Math.PI * radius;
  const safeTotalTime = Math.max(totalTime || 0, 1);
  const progressRatio = Math.max(0, Math.min(timeLeft / safeTotalTime, 1));
  const strokeDashoffset = circumference * (1 - progressRatio);
  const strokeColor = MODE_COLORS[mode] || MODE_COLORS.focus;

  return (
    <div className="relative flex items-center justify-center" style={{ width: svgSize, height: svgSize }}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--ring-color)"
          strokeWidth="6"
        />
        {/* Progress ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ filter: "drop-shadow(0 0 10px currentColor)", transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>

      {/* Center content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--text-muted)] mb-3">
            {MODE_BADGES[mode] || MODE_BADGES.focus}
          </span>
          <span
            className="font-mono text-[56px] font-medium leading-none tracking-tight"
            style={{ color: strokeColor }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
}
