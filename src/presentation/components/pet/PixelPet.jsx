"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils.js";
import useTimer from "@/presentation/hooks/useTimer.js";
import {
  getPetImagePath,
  getPetState,
  PET_STATES,
} from "@/lib/pet-helpers.js";
import PetStatus from "./PetStatus.jsx";

const PET_TYPE = "cat";
const DEFAULT_STREAK_DATA = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
};
const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><rect width='128' height='128' rx='24' fill='#f8fafc'/><text x='50%' y='52%' font-size='56' text-anchor='middle'>🐱</text></svg>",
)}`;

const MODE_COLORS = {
  focus: "#E85D3F",
  short_break: "#4ECCA3",
  long_break: "#6C8EBF",
};

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function normalizeStreakData(stats) {
  const currentStreak =
    typeof stats?.currentStreak === "number" ? stats.currentStreak : 0;
  const longestStreak =
    typeof stats?.longestStreak === "number" ? stats.longestStreak : 0;

  return {
    currentStreak,
    longestStreak,
    lastActiveDate:
      stats?.lastActiveDate ?? (currentStreak > 0 ? getTodayDateString() : null),
  };
}

async function fetchStreakData() {
  const response = await fetch("/api/sessions/stats?period=today");

  if (!response.ok) {
    throw new Error("Failed to fetch streak data");
  }

  const data = await response.json();
  return normalizeStreakData(data?.stats);
}

function getAnimationClassName(petState) {
  if (petState === PET_STATES.HAPPY) {
    return "animate-bounce";
  }

  if (petState === PET_STATES.SAD) {
    return "animate-pulse";
  }

  if (petState === PET_STATES.SLEEPING) {
    return "opacity-60";
  }

  return "";
}

export default function PixelPet() {
  const { isRunning, mode, pomodoroCount } = useTimer();
  const [streakData, setStreakData] = useState(DEFAULT_STREAK_DATA);
  const [isFetchingStreak, setIsFetchingStreak] = useState(true);
  const petState = getPetState({
    currentStreak: streakData.currentStreak,
    lastActiveDate: streakData.lastActiveDate,
    isRunning,
    mode,
  });
  const imagePath = getPetImagePath(PET_TYPE, petState).replace(".png", ".svg");
  const [imageSrc, setImageSrc] = useState(imagePath);
  const accentColor = MODE_COLORS[mode] || MODE_COLORS.focus;
  const streakLabel =
    streakData.currentStreak > 0
      ? `🔥 ${streakData.currentStreak} day streak`
      : "Keep your streak alive";
  const xpPercent = Math.min((streakData.currentStreak + 1) / 5, 1) * 100;

  useEffect(() => {
    setImageSrc(imagePath);
  }, [imagePath]);

  useEffect(() => {
    let isMounted = true;

    const loadStreakData = async () => {
      try {
        const nextStreakData = await fetchStreakData();

        if (isMounted) {
          setStreakData(nextStreakData);
        }
      } catch {
        if (isMounted) {
          setStreakData(DEFAULT_STREAK_DATA);
        }
      } finally {
        if (isMounted) {
          setIsFetchingStreak(false);
        }
      }
    };

    loadStreakData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (pomodoroCount === 0) {
      return;
    }

    let isMounted = true;

    const refreshStreakData = async () => {
      if (isMounted) {
        setIsFetchingStreak(true);
      }

      try {
        const nextStreakData = await fetchStreakData();

        if (isMounted) {
          setStreakData(nextStreakData);
        }
      } catch {
        if (isMounted) {
          setStreakData(DEFAULT_STREAK_DATA);
        }
      } finally {
        if (isMounted) {
          setIsFetchingStreak(false);
        }
      }
    };

    refreshStreakData();

    return () => {
      isMounted = false;
    };
  }, [pomodoroCount]);

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] p-5 flex items-center gap-4 transition-colors duration-200">
      {/* Pet image */}
      <div
        className={cn(
          "w-16 h-16 rounded-2xl overflow-hidden bg-[var(--bg-elevated)] flex-shrink-0 flex items-center justify-center transition-opacity",
          getAnimationClassName(petState),
          isFetchingStreak ? "opacity-80" : "opacity-100",
        )}
      >
        <Image
          src={imageSrc}
          alt={`${PET_TYPE} is ${petState}`}
          width={128}
          height={128}
          unoptimized={imageSrc.startsWith("data:")}
          className="h-12 w-12 object-contain [image-rendering:pixelated]"
          onError={() => {
            setImageSrc((currentSrc) =>
              currentSrc === FALLBACK_IMAGE ? currentSrc : FALLBACK_IMAGE,
            );
          }}
        />
      </div>

      {/* Pet info */}
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Pixel Pet</p>
        <span className="text-xs text-orange-400 font-medium">
          {streakLabel}
        </span>

        <PetStatus
          petState={petState}
          currentStreak={streakData.currentStreak}
        />

        {/* XP bar */}
        <div className="h-1 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${xpPercent}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>
    </div>
  );
}
