"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils.js";
import useTimer from "@/presentation/hooks/useTimer.js";

const MODE_COLORS = {
  focus: "#E85D3F",
  short_break: "#4ECCA3",
  long_break: "#6C8EBF",
};

const BUILT_IN_AUDIO_SOURCES = {
  forest: "/sounds/forest.mp3",
  ocean: "/sounds/ocean.mp3",
  coffee_shop: "/sounds/coffee_shop.mp3",
};

const SOUND_OPTIONS = [
  {
    id: "bell",
    label: "Bell",
    description: "Default timer tone",
  },
  {
    id: "forest",
    label: "Forest",
    description: "Built-in MP3",
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Built-in MP3",
  },
  {
    id: "coffee_shop",
    label: "Coffee Shop",
    description: "Built-in MP3",
  },
  {
    id: "none",
    label: "Silent",
    description: "No timeout sound",
  },
];

const PREVIEW_DURATION_MS = 8000;
const CUSTOM_SOUND_NOTE = "Custom MP3 aktif selama tab ini masih terbuka.";
const TIMEOUT_VOLUME = 1;

function playBell(volume) {
  if (typeof window === "undefined") {
    return 0;
  }

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return 0;
  }

  const audioContext = new AudioContextClass();
  const gainNode = audioContext.createGain();
  const now = audioContext.currentTime;
  const toneLength = 0.18;
  const gapLength = 0.22;

  gainNode.gain.setValueAtTime(Math.max(0.05, volume * 0.2), now);
  gainNode.connect(audioContext.destination);

  [659.25, 880].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const startAt = now + index * gapLength;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    oscillator.connect(gainNode);
    oscillator.start(startAt);
    oscillator.stop(startAt + toneLength);
    oscillator.onended = () => {
      oscillator.disconnect();
    };
  });

  window.setTimeout(() => {
    gainNode.disconnect();
    void audioContext.close();
  }, 900);

  return 900;
}

export default function TimeoutSoundPanel() {
  const { mode, sessionCompletionCount } = useTimer();
  const accentColor = MODE_COLORS[mode] || MODE_COLORS.focus;
  const [selectedSound, setSelectedSound] = useState("bell");
  const [customSoundName, setCustomSoundName] = useState("");
  const [customSoundUrl, setCustomSoundUrl] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const audioRef = useRef(null);
  const customSoundUrlRef = useRef(null);
  const playbackTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMountedRef = useRef(true);

  const stopCurrentAudio = useCallback(() => {
    if (playbackTimeoutRef.current !== null) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }

    if (audioRef.current !== null) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (isMountedRef.current) {
      setIsPreviewing(false);
    }
  }, []);

  const schedulePlaybackStop = useCallback(
    (durationMs = PREVIEW_DURATION_MS) => {
      if (playbackTimeoutRef.current !== null) {
        window.clearTimeout(playbackTimeoutRef.current);
      }

      playbackTimeoutRef.current = window.setTimeout(() => {
        stopCurrentAudio();
      }, durationMs);
    },
    [stopCurrentAudio],
  );

  const playSelectedSound = useCallback(async () => {
    stopCurrentAudio();

    if (selectedSound === "none") {
      return;
    }

    if (selectedSound === "bell") {
      const bellDuration = playBell(TIMEOUT_VOLUME);

      if (bellDuration > 0) {
        setIsPreviewing(true);
        schedulePlaybackStop(bellDuration);
      }

      return;
    }

    const selectedSource =
      selectedSound === "custom"
        ? customSoundUrl
        : BUILT_IN_AUDIO_SOURCES[selectedSound] ?? null;

    if (selectedSource == null) {
      const bellDuration = playBell(TIMEOUT_VOLUME);

      if (bellDuration > 0) {
        setIsPreviewing(true);
        schedulePlaybackStop(bellDuration);
      }

      return;
    }

    const nextAudio = new Audio(selectedSource);
    nextAudio.preload = "auto";
    nextAudio.volume = TIMEOUT_VOLUME;
    nextAudio.onended = () => {
      if (audioRef.current === nextAudio) {
        audioRef.current = null;
      }

      if (isMountedRef.current) {
        setIsPreviewing(false);
      }
    };

    audioRef.current = nextAudio;

    try {
      await nextAudio.play();
      setIsPreviewing(true);
      schedulePlaybackStop();
    } catch {
      audioRef.current = null;
      setIsPreviewing(false);
    }
  }, [
    customSoundUrl,
    schedulePlaybackStop,
    selectedSound,
    stopCurrentAudio,
  ]);

  const handleCustomSoundChange = useCallback((event) => {
    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      return;
    }

    if (customSoundUrlRef.current !== null) {
      URL.revokeObjectURL(customSoundUrlRef.current);
    }

    const nextSoundUrl = URL.createObjectURL(nextFile);

    customSoundUrlRef.current = nextSoundUrl;
    setCustomSoundName(nextFile.name);
    setCustomSoundUrl(nextSoundUrl);
    setSelectedSound("custom");
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    if (typeof window === "undefined") {
      return () => {
        isMountedRef.current = false;
      };
    }

    const savedSound = window.localStorage.getItem("pomodoki.timeoutSound");

    if (savedSound && SOUND_OPTIONS.some((sound) => sound.id === savedSound)) {
      setSelectedSound(savedSound);
    }

    window.localStorage.removeItem("pomodoki.timeoutVolume");

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (selectedSound !== "custom") {
      window.localStorage.setItem("pomodoki.timeoutSound", selectedSound);
    }
  }, [selectedSound]);

  useEffect(() => {
    stopCurrentAudio();
  }, [selectedSound, stopCurrentAudio]);

  useEffect(() => {
    if (sessionCompletionCount === 0) {
      return;
    }

    void playSelectedSound();
  }, [playSelectedSound, sessionCompletionCount]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopCurrentAudio();

      if (customSoundUrlRef.current !== null) {
        URL.revokeObjectURL(customSoundUrlRef.current);
      }
    };
  }, [stopCurrentAudio]);

  return (
    <section className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] p-6 transition-colors duration-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--text-muted)]">
            Timeout Sound
          </p>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Timer Alarm
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Pilih suara saat sesi focus atau break selesai.
          </p>
        </div>

        <button
          type="button"
          disabled={selectedSound === "custom" && customSoundUrl == null}
          onClick={() => {
            if (isPreviewing) {
              stopCurrentAudio();
              return;
            }

            void playSelectedSound();
          }}
          className="px-5 py-2.5 rounded-full text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)] transition-colors border border-[var(--border-default)] w-full sm:w-auto disabled:opacity-50"
        >
          {isPreviewing ? "Stop Preview" : "Preview"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {SOUND_OPTIONS.map((sound) => {
          const isActive = selectedSound === sound.id;

          return (
            <button
              key={sound.id}
              type="button"
              onClick={() => {
                setSelectedSound(sound.id);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium transition-colors border",
                isActive
                  ? "text-white border-transparent"
                  : "text-[var(--text-muted)] bg-[var(--bg-elevated)] border-[var(--border-default)] hover:text-[var(--text-secondary)]",
              )}
              style={isActive ? { backgroundColor: accentColor } : undefined}
            >
              {sound.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => {
            setSelectedSound("custom");
          }}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-medium transition-colors border",
            selectedSound === "custom"
              ? "text-white border-transparent"
              : "text-[var(--text-muted)] bg-[var(--bg-elevated)] border-[var(--border-default)] hover:text-[var(--text-secondary)]",
          )}
          style={
            selectedSound === "custom"
              ? { backgroundColor: accentColor }
              : undefined
          }
        >
          Custom MP3
        </button>
      </div>

      <div
        className={cn(
          "mt-4 rounded-2xl border p-4 bg-[var(--bg-elevated)] transition-colors duration-200",
          selectedSound === "custom" && "border-transparent",
        )}
        style={
          selectedSound === "custom"
            ? {
                boxShadow: `inset 0 0 0 1px ${accentColor}`,
              }
            : undefined
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Upload MP3 sendiri
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {customSoundName || "Belum ada file dipilih."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-card)] hover:text-[var(--text-secondary)] transition-colors border border-[var(--border-default)]"
          >
            Pilih file
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3"
            onChange={handleCustomSoundChange}
            className="sr-only"
          />
        </div>

        <p className="text-[11px] text-[var(--text-muted)] mt-3">
          {CUSTOM_SOUND_NOTE}
        </p>
      </div>
    </section>
  );
}
