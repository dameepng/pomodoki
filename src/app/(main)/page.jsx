"use client";

import Timer from "@/presentation/components/timer/Timer.jsx";
import AmbientPlayer from "@/presentation/components/ambient/AmbientPlayer.jsx";
import PixelPet from "@/presentation/components/pet/PixelPet.jsx";
import TaskList from "@/presentation/components/tasks/TaskList.jsx";
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

        <PixelPet />

        <TaskList />

        <AmbientPlayer />
      </div>
    </div>
  );
}
