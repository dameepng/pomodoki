"use client";

import Timer from "@/presentation/components/timer/Timer.jsx";
import Card from "@/presentation/components/ui/Card.jsx";

export default function MainPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-red-500">
            Focus Companion
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
            Pomodoki
          </h1>
        </div>

        <Card className="overflow-hidden">
          <Timer />
        </Card>

        <Card className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
          <p className="mt-2 text-sm text-slate-500">Tasks coming soon</p>
        </Card>

        <Card className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Ambient</h2>
          <p className="mt-2 text-sm text-slate-500">Ambient coming soon</p>
        </Card>
      </div>
    </div>
  );
}
