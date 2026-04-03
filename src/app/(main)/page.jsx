"use client";

import Timer from "@/presentation/components/timer/Timer.jsx";
import TimeoutSoundPanel from "@/presentation/components/timer/TimeoutSoundPanel.jsx";
import AmbientPlayer from "@/presentation/components/ambient/AmbientPlayer.jsx";
import PixelPet from "@/presentation/components/pet/PixelPet.jsx";
import TaskList from "@/presentation/components/tasks/TaskList.jsx";
import ErrorBoundary from "@/presentation/components/ui/ErrorBoundary.jsx";

export default function MainPage() {
  return (
    <ErrorBoundary>
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-4 px-4 py-5 sm:gap-5 sm:px-5 sm:py-6 lg:grid-cols-[400px_1fr] lg:gap-6 lg:px-6 lg:py-8">
        <div className="flex flex-col gap-4 sm:gap-5">
          <Timer />
          <TimeoutSoundPanel />
          <PixelPet />
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          <TaskList />
          <AmbientPlayer />
        </div>
      </div>
    </ErrorBoundary>
  );
}
