import env from "@/config/env.js";

export class OpenAIService {
  async breakdownTask(taskTitle) {
    const prompt = `Kamu adalah asisten produktivitas. Breakdown task berikut
menjadi 3-5 subtask konkret yang masing-masing bisa
diselesaikan dalam satu sesi Pomodoro (25 menit).
Task: ${taskTitle}
Balas HANYA dengan JSON array of strings, tanpa penjelasan
tambahan, tanpa markdown code block.
Contoh format: ["subtask 1", "subtask 2", "subtask 3"]`;

    let response;

    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });
    } catch {
      throw new Error("AI service unavailable");
    }

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid AI response format");
    }

    const content = data?.choices?.[0]?.message?.content?.trim();

    try {
      const subtasks = JSON.parse(content);

      if (!Array.isArray(subtasks) || !subtasks.every((item) => typeof item === "string")) {
        throw new Error("Invalid AI response format");
      }

      return subtasks;
    } catch {
      throw new Error("Invalid AI response format");
    }
  }
}

export const openaiService = new OpenAIService();

export default openaiService;
