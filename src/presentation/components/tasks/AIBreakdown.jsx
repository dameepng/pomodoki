"use client";

import { useState } from "react";
import Button from "@/presentation/components/ui/Button.jsx";
import Modal from "@/presentation/components/ui/Modal.jsx";
import { useToast } from "@/presentation/components/ui/Toast.jsx";
import useTasks from "@/presentation/hooks/useTasks.js";

async function getErrorMessage(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

function LoadingState({ message }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
      <svg
        className="h-4 w-4 animate-spin text-red-500"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default function AIBreakdown({ taskTitle, onComplete }) {
  const { addToast } = useToast();
  const { createTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [error, setError] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleBreakdown = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskTitle }),
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to breakdown task"),
        );
      }

      const data = await response.json();
      setSubtasks(Array.isArray(data.subtasks) ? data.subtasks : []);
      setHasGenerated(true);
    } catch (breakdownError) {
      setError(breakdownError.message || "Failed to breakdown task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAll = async () => {
    setIsLoading(true);
    setError(null);

    try {
      for (const subtask of subtasks) {
        await createTask(subtask);
      }

      setIsModalOpen(false);
      setSubtasks([]);
      setHasGenerated(false);
      addToast({
        message: `${subtasks.length} tasks added!`,
        type: "success",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (addError) {
      setError(addError.message || "Failed to add subtasks");
      addToast({ message: "Failed to add tasks", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsModalOpen(true);

    if (!hasGenerated) {
      void handleBreakdown();
    }
  };

  return (
    <>
      <Button size="sm" variant="ghost" onClick={handleOpen}>
        ✨ AI Breakdown
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="AI Task Breakdown"
      >
        <div className="space-y-4">
          {isLoading && !hasGenerated ? (
            <LoadingState message="Generating subtasks..." />
          ) : null}

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          {hasGenerated ? (
            <>
              {subtasks.length > 0 ? (
                <ol className="space-y-2 pl-5 text-sm text-slate-700">
                  {subtasks.map((subtask, index) => (
                    <li key={`${subtask}-${index}`} className="list-decimal">
                      {subtask}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-500">
                  No subtasks generated. Try again.
                </p>
              )}

              {isLoading ? <LoadingState message="Working..." /> : null}

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Close
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    void handleBreakdown();
                  }}
                  disabled={isLoading}
                >
                  Regenerate
                </Button>
                <Button onClick={() => void handleAddAll()} disabled={isLoading}>
                  Add All Tasks
                </Button>
              </div>
            </>
          ) : (
            !isLoading && (
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            )
          )}
        </div>
      </Modal>
    </>
  );
}
