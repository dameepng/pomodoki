"use client";

import { getPetMessage, PET_STATES } from "@/lib/pet-helpers.js";
import { cn } from "@/lib/utils.js";

const STATE_TEXT_COLORS = {
  [PET_STATES.HAPPY]: "text-[#4ECCA3]",
  [PET_STATES.NEUTRAL]: "text-gray-400",
  [PET_STATES.SAD]: "text-[#6C8EBF]",
  [PET_STATES.SLEEPING]: "text-gray-500",
};

export default function PetStatus({ petState, currentStreak }) {
  const message = getPetMessage(petState, currentStreak);
  const textColorClassName =
    STATE_TEXT_COLORS[petState] ?? STATE_TEXT_COLORS[PET_STATES.NEUTRAL];

  return (
    <p
      className={cn(
        "text-xs leading-5",
        textColorClassName,
      )}
    >
      {message}
    </p>
  );
}
