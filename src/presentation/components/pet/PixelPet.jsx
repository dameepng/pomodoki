"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
    // The current stats API does not expose lastActiveDate yet, so we keep a
    // safe fallback that still allows the pet to react to an active streak.
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
  const imagePath = getPetImagePath(PET_TYPE, petState);
  const [imageSrc, setImageSrc] = useState(imagePath);

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
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative h-32 w-32 overflow-hidden rounded-2xl bg-white/70 shadow-md transition-opacity ${getAnimationClassName(
          petState,
        )} ${isFetchingStreak ? "opacity-80" : "opacity-100"}`}
      >
        <Image
          src={imageSrc}
          alt={`${PET_TYPE} is ${petState}`}
          fill
          sizes="128px"
          unoptimized={imageSrc.startsWith("data:")}
          className="object-contain"
          style={{ imageRendering: "pixelated" }}
          onError={() => {
            setImageSrc((currentSrc) =>
              currentSrc === FALLBACK_IMAGE ? currentSrc : FALLBACK_IMAGE,
            );
          }}
        />
      </div>

      <PetStatus
        petState={petState}
        currentStreak={streakData.currentStreak}
      />
    </div>
  );
}
