"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const TimerContext = createContext(null);

const DEFAULT_SETTINGS = {
  focusDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
};

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

function playCompletionSound() {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
  oscillator.type = "sine";
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
    audioContext.close();
  };

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

export default function TimerProvider({ children }) {
  const [mode, setModeState] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const intervalRef = useRef(null);

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
          const nextSettings = {
            ...DEFAULT_SETTINGS,
            ...data.settings,
          };

          setSettings(nextSettings);
          setTimeLeft(nextSettings.focusDuration);
          return;
        }
      } catch {
      }

      if (!isMounted) {
        return;
      }

      setSettings(DEFAULT_SETTINGS);
      setTimeLeft(DEFAULT_SETTINGS.focusDuration);
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
  }, []);

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

  const handleSessionComplete = useCallback(async () => {
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

    try {
      playCompletionSound();
    } catch {
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
    handleSessionComplete();
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
        settings,
        isLoadingSettings,
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
