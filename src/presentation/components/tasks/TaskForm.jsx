"use client";

import { useState } from "react";

import Button from "@/presentation/components/ui/Button.jsx";
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
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <div className="flex-1">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={placeholder}
          aria-label="Task title"
        />
      </div>

      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
        Add Task
      </Button>
    </form>
  );
}
