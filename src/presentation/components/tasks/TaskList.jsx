"use client";

import { useState } from "react";

import Card from "@/presentation/components/ui/Card.jsx";
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
    <Card className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Tasks
        </h2>
        <p className="text-sm text-slate-500">
          Pilih fokus berikutnya dan tandai saat selesai.
        </p>
      </div>

      <TaskForm onSubmit={handleCreate} isLoading={isSubmitting} />

      {isLoading ? (
        <div className="flex justify-center py-8 text-red-500">
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
        <div className="space-y-3">
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
    </Card>
  );
}
