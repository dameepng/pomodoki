"use client";

import Timer from "@/presentation/components/timer/Timer.jsx";
import AmbientPlayer from "@/presentation/components/ambient/AmbientPlayer.jsx";
import PixelPet from "@/presentation/components/pet/PixelPet.jsx";
import TaskList from "@/presentation/components/tasks/TaskList.jsx";
import Card from "@/presentation/components/ui/Card.jsx";
import ErrorBoundary from "@/presentation/components/ui/ErrorBoundary.jsx";

export default function MainPage() {
  return (
    <ErrorBoundary>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
        <Card className="overflow-hidden">
          <Timer />
        </Card>

        <div className="flex justify-center">
          <PixelPet />
        </div>

        <AmbientPlayer />

        <TaskList />
      </div>
    </ErrorBoundary>
  );
}
