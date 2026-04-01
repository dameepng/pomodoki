"use client";

import Timer from "@/presentation/components/timer/Timer.jsx";
import AmbientPlayer from "@/presentation/components/ambient/AmbientPlayer.jsx";
import PixelPet from "@/presentation/components/pet/PixelPet.jsx";
import TaskList from "@/presentation/components/tasks/TaskList.jsx";
import ErrorBoundary from "@/presentation/components/ui/ErrorBoundary.jsx";

export default function MainPage() {
  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
        <div className="flex flex-col gap-4">
          <Timer />
          <PixelPet />
        </div>

        <div className="flex flex-col gap-4">
          <TaskList />
          <AmbientPlayer />
        </div>
      </div>
    </ErrorBoundary>
  );
}
