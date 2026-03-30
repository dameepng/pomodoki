import { useCallback, useEffect, useState } from "react";

const getErrorMessage = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    return data.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Gagal memuat tasks"));
      }

      const data = await response.json();
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (fetchError) {
      setError(fetchError.message || "Gagal memuat tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (title) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Gagal membuat task"));
    }

    const data = await response.json();

    setTasks((currentTasks) => [data.task, ...currentTasks]);

    return data.task;
  }, []);

  const updateTask = useCallback(async (taskId, data) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Gagal mengupdate task"));
    }

    const result = await response.json();

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? result.task : task,
      ),
    );

    return result.task;
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Gagal menghapus task"));
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  }, []);

  const toggleComplete = useCallback(
    async (taskId) => {
      const task = tasks.find((item) => item.id === taskId);

      if (!task) {
        throw new Error("Task tidak ditemukan");
      }

      return updateTask(taskId, {
        completed: !task.completed,
      });
    },
    [tasks, updateTask],
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refetch: fetchTasks,
  };
}
