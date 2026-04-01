"use client";

import { AMBIENT_SOUNDS } from "@/lib/ambient-helpers.js";
import { cn } from "@/lib/utils.js";

export default function SoundSelector({
  currentSound,
  onSelect,
  disabled = false,
  accentColor = "#E85D3F",
}) {
  return (
    <>
      {AMBIENT_SOUNDS.map((sound) => {
        const isActive = currentSound === sound.id;

        return (
          <button
            key={sound.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(sound.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer",
              isActive
                ? "text-white"
                : "text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)]",
              disabled && "cursor-not-allowed opacity-60",
            )}
            style={isActive ? { backgroundColor: accentColor } : undefined}
          >
            <span className="leading-none">{sound.emoji}</span>
            <span>{sound.label}</span>
          </button>
        );
      })}
    </>
  );
}
