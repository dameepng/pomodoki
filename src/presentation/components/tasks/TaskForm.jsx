"use client";

import { useState } from "react";

import Input from "@/presentation/components/ui/Input.jsx";

export default function TaskForm({
  onSubmit,
  isLoading,
  placeholder = "What do you want to focus on?",
}) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    try {
      await onSubmit(normalizedTitle);
      setTitle("");
    } catch {
    }
  };

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={placeholder}
        aria-label="Task title"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white bg-[#E85D3F] hover:bg-[#d4512f] transition-colors disabled:opacity-60"
      >
        {isLoading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
