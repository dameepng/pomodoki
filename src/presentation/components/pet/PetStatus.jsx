"use client";

import { getPetMessage, PET_STATES } from "@/lib/pet-helpers.js";

const STATE_TEXT_COLORS = {
  [PET_STATES.HAPPY]: "text-green-600",
  [PET_STATES.NEUTRAL]: "text-slate-500",
  [PET_STATES.SAD]: "text-sky-400",
  [PET_STATES.SLEEPING]: "text-violet-400",
};

export default function PetStatus({ petState, currentStreak }) {
  const message = getPetMessage(petState, currentStreak);
  const textColorClassName =
    STATE_TEXT_COLORS[petState] ?? STATE_TEXT_COLORS[PET_STATES.NEUTRAL];

  return (
    <p className={`text-center text-sm italic ${textColorClassName}`}>
      {message}
    </p>
  );
}
