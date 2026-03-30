"use client";

import { useState } from "react";

import Button from "@/presentation/components/ui/Button.jsx";
import useTimer from "@/presentation/hooks/useTimer.js";

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onSelect,
}) {
  const { setCurrentTaskId } = useTimer();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelect = () => {
    onSelect(task.id);
    setCurrentTaskId(task.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="h-4 w-4 rounded border-slate-300 text-red-500 focus:ring-red-200"
        aria-label={`Toggle task ${task.title}`}
      />

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium text-slate-900 ${
            task.completed ? "line-through" : ""
          }`}
        >
          {task.title}
        </p>
      </div>

      {task.pomodoroCount > 0 ? (
        <span className="whitespace-nowrap rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
          {`🍅 × ${task.pomodoroCount}`}
        </span>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleSelect}
      >
        Focus
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        isLoading={isDeleting}
        disabled={isDeleting}
        className="px-3 text-slate-500 hover:text-red-500"
      >
        {!isDeleting ? "×" : "Deleting"}
      </Button>
    </div>
  );
}
