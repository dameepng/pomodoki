"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { DEFAULT_SETTINGS } from "@/core/entities/settings.entity.js";

export const TimerContext = createContext(null);

const getDurationByMode = (mode, settings) => {
  if (mode === "short_break") {
    return settings.shortBreakDuration;
  }

  if (mode === "long_break") {
    return settings.longBreakDuration;
  }

  return settings.focusDuration;
};

async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

function showNotification(title, body) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  new Notification(title, { body, icon: "/favicon.ico" });
}

export default function TimerProvider({ children }) {
  const [mode, setModeState] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.focusDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [sessionCompletionCount, setSessionCompletionCount] = useState(0);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const intervalRef = useRef(null);
  const isRunningRef = useRef(false);
  const modeRef = useRef("focus");

  const updateSettings = useCallback(
    (nextSettings, options = {}) => {
      const { resetTimeLeft = true } = options;
      const mergedSettings = {
        ...DEFAULT_SETTINGS,
        ...nextSettings,
      };

      setSettings(mergedSettings);

      if (!isRunningRef.current && resetTimeLeft) {
        setTimeLeft(getDurationByMode(modeRef.current, mergedSettings));
      }

      return mergedSettings;
    },
    [],
  );

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "GET",
        });

        if (!isMounted) {
          return;
        }

        if (response.ok) {
          const data = await response.json();
          updateSettings(data.settings, { resetTimeLeft: true });
          return;
        }
      } catch {
      }

      if (!isMounted) {
        return;
      }

      updateSettings(DEFAULT_SETTINGS, { resetTimeLeft: true });
    };

    void requestNotificationPermission();
    loadSettings().finally(() => {
      if (isMounted) {
        setIsLoadingSettings(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [updateSettings]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      return undefined;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((currentTimeLeft) => Math.max(currentTimeLeft - 1, 0));
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const handleSessionComplete = useCallback(async (reason = "timeout") => {
    const activeSettings = settings ?? DEFAULT_SETTINGS;
    const duration = getDurationByMode(mode, activeSettings);

    setIsRunning(false);

    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: currentTaskId,
          duration,
          type: mode,
        }),
      });
    } catch {
    }

    if (reason === "timeout") {
      setSessionCompletionCount((currentCount) => currentCount + 1);
    }

    if (mode === "focus") {
      showNotification(
        "Focus session done! 🍅",
        "Time for a break. Well done!",
      );
    }

    if (mode === "short_break" || mode === "long_break") {
      showNotification(
        "Break time over! ⏰",
        "Ready to focus again?",
      );
    }

    if (mode === "focus") {
      const newCount = pomodoroCount + 1;
      const nextMode = newCount % 4 === 0 ? "long_break" : "short_break";

      setPomodoroCount(newCount);
      setModeState(nextMode);
      setTimeLeft(getDurationByMode(nextMode, activeSettings));
      return;
    }

    setModeState("focus");
    setTimeLeft(activeSettings.focusDuration);
  }, [currentTaskId, mode, pomodoroCount, settings]);

  useEffect(() => {
    if (timeLeft > 0) {
      return;
    }

    if (!isRunning) {
      return;
    }

    handleSessionComplete();
  }, [timeLeft, isRunning, mode, handleSessionComplete]);

  const start = useCallback(() => {
    setIsRunning((currentIsRunning) => {
      if (timeLeft <= 0) {
        return currentIsRunning;
      }

      return true;
    });
  }, [timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    const activeSettings = settings ?? DEFAULT_SETTINGS;

    setIsRunning(false);
    setTimeLeft(getDurationByMode(mode, activeSettings));
  }, [mode, settings]);

  const skip = useCallback(() => {
    void handleSessionComplete("skip");
  }, [handleSessionComplete]);

  const setMode = useCallback(
    (nextMode) => {
      const activeSettings = settings ?? DEFAULT_SETTINGS;

      setIsRunning(false);
      setModeState(nextMode);
      setTimeLeft(getDurationByMode(nextMode, activeSettings));
    },
    [settings],
  );

  return (
    <TimerContext.Provider
      value={{
        mode,
        timeLeft,
        isRunning,
        pomodoroCount,
        currentTaskId,
        sessionCompletionCount,
        settings,
        isLoadingSettings,
        updateSettings,
        start,
        pause,
        reset,
        skip,
        setCurrentTaskId,
        setMode,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
