"use client";

import { useState } from "react";

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

function getDateLabel(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return String(dateString).split("-").pop() || String(dateString);
  }

  return date.toLocaleDateString("en-US", { day: "2-digit" });
}

export default function ProductivityChart({ dailyFocusTime }) {
  const [activeLabel, setActiveLabel] = useState(null);
  const dataPoints = Array.isArray(dailyFocusTime)
    ? dailyFocusTime.slice(-7)
    : [];

  if (dataPoints.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md ring-1 ring-slate-200">
        No data for this period
      </div>
    );
  }

  const maxDuration = Math.max(
    ...dataPoints.map((item) => Number(item.totalDuration || 0)),
    1,
  );
  const fallbackPoint = dataPoints[dataPoints.length - 1];
  const summaryLabel =
    activeLabel ||
    `${fallbackPoint.date} • ${formatDuration(
      Number(fallbackPoint.totalDuration || 0),
    )}`;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Productivity Trend
          </h3>
          <p className="text-sm text-slate-500">{summaryLabel}</p>
        </div>
      </div>

      <div className="flex h-56 items-end gap-3">
        {dataPoints.map((item) => {
          const totalDuration = Number(item.totalDuration || 0);
          const barHeight = Math.max((totalDuration / maxDuration) * 100, 4);
          const tooltip = `${item.date} • ${formatDuration(totalDuration)}`;

          return (
            <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-44 w-full items-end">
                <div
                  title={tooltip}
                  onMouseEnter={() => setActiveLabel(tooltip)}
                  onMouseLeave={() => setActiveLabel(null)}
                  className="w-full rounded-t-xl bg-red-500 transition-opacity hover:opacity-85"
                  style={{ height: `${barHeight}%`, minHeight: "4px" }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {getDateLabel(item.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
