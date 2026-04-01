"use client";

import { useState } from "react";

import { cn } from "@/lib/utils.js";
import AIBreakdown from "@/presentation/components/tasks/AIBreakdown.jsx";
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
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors group cursor-pointer",
        task.completed && "opacity-60",
      )}
      onClick={handleSelect}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggleComplete(task.id);
        }}
        className="w-5 h-5 rounded-md border-2 border-[var(--border-subtle)] flex-shrink-0 bg-transparent accent-[#E85D3F]"
        style={{
          accentColor: "#E85D3F",
        }}
        aria-label={`Toggle task ${task.title}`}
      />

      <p
        className={cn(
          "text-sm font-medium text-[var(--text-secondary)] flex-1",
          task.completed && "text-[var(--text-muted)] line-through",
        )}
      >
        {task.title}
      </p>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed ? (
          <AIBreakdown taskTitle={task.title} onComplete={() => {}} />
        ) : null}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isDeleting}
          className="px-3 py-1 rounded-lg text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors"
        >
          {isDeleting ? "..." : "✕"}
        </button>
      </div>
    </div>
  );
}
