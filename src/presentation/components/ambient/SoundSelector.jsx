"use client";

import { AMBIENT_SOUNDS } from "@/lib/ambient-helpers.js";

export default function SoundSelector({
  currentSound,
  onSelect,
  disabled = false,
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {AMBIENT_SOUNDS.map((sound) => {
        const isActive = currentSound === sound.id;

        return (
          <button
            key={sound.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(sound.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left transition ${
              isActive
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <span className="text-lg leading-none">{sound.emoji}</span>
            <span className="text-sm font-medium">{sound.label}</span>
          </button>
        );
      })}
    </div>
  );
}
