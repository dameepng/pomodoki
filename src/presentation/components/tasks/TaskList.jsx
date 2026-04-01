"use client";

import { useState } from "react";

import EmptyState from "@/presentation/components/ui/EmptyState.jsx";
import Spinner from "@/presentation/components/ui/Spinner.jsx";
import { useToast } from "@/presentation/components/ui/Toast.jsx";
import useTasks from "@/presentation/hooks/useTasks.js";

import TaskForm from "./TaskForm.jsx";
import TaskItem from "./TaskItem.jsx";

export default function TaskList() {
  const { addToast } = useToast();
  const { tasks, isLoading, createTask, toggleComplete, deleteTask } =
    useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (title) => {
    setIsSubmitting(true);

    try {
      const task = await createTask(title);
      addToast({ message: "Task added!", type: "success" });
      return task;
    } catch (error) {
      addToast({
        message: error.message || "Failed to add task",
        type: "error",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (taskId) => {
    try {
      await toggleComplete(taskId);
    } catch {}
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      addToast({ message: "Task deleted", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to delete task", type: "error" });
    }
  };

  const handleSelect = () => {};
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const sortedTasks = [...incompleteTasks, ...completedTasks];

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] p-6 transition-colors duration-200">
      <div className="space-y-1 mb-4">
        <p className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--text-muted)] mb-4">
          Task Queue
        </p>
        <h2 className="pt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Tasks
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Capture your next step and keep unfinished work visible.
        </p>
      </div>

      <TaskForm onSubmit={handleCreate} isLoading={isSubmitting} />

      {isLoading ? (
        <div className="flex justify-center py-8 text-[#E85D3F]">
          <Spinner size="md" />
        </div>
      ) : null}

      {!isLoading && sortedTasks.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No tasks yet"
          description="Add a task above to get started"
        />
      ) : null}

      {!isLoading && sortedTasks.length > 0 ? (
        <div className="flex flex-col gap-2 mt-4">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggle}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
