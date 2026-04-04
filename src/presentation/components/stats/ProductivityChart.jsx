"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  CartesianGrid,
} from "recharts";

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

// Custom minimal tooltip matching Shadcn UI aesthetics
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 shadow-xl">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          {data.date}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-[#E85D3F]" />
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {formatDuration(data.totalDuration)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProductivityChart({ dailyFocusTime }) {
  const chartData = useMemo(() => {
    const dataPoints = Array.isArray(dailyFocusTime)
      ? dailyFocusTime.slice(-7)
      : [];

    return dataPoints.map((point) => ({
      ...point,
      displayDate: getDateLabel(point.date),
    }));
  }, [dailyFocusTime]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl bg-[var(--bg-card)] p-6 text-sm text-[var(--text-secondary)] shadow-card border border-[var(--border-default)]">
        No data for this period
      </div>
    );
  }

  const fallbackPoint = chartData[chartData.length - 1];
  const summaryLabel = `${fallbackPoint.date} • ${formatDuration(
    Number(fallbackPoint.totalDuration || 0),
  )}`;

  return (
    <div className="min-w-0 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-card transition-colors duration-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] transition-colors">
          Productivity Trend
        </h3>
        <p className="text-sm text-[var(--text-secondary)] transition-colors">
          {summaryLabel}
        </p>
      </div>

      <div className="h-[220px] min-w-0 w-full sm:h-[240px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={220}
          debounce={50}
          initialDimension={{ width: 520, height: 220 }}
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border-default)" strokeDasharray="3 3" />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--bg-elevated)", opacity: 0.5 }}
            />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              fontSize={12}
              stroke="var(--text-muted)"
            />
            <Bar
              dataKey="totalDuration"
              fill="#E85D3F"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
              activeBar={{ fill: "#d4512f" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
