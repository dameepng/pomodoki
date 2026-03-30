import { useCallback, useEffect, useRef, useState } from "react";
import { getAudioPath } from "@/lib/ambient-helpers.js";

export default function useAmbient() {
  const [currentSound, setCurrentSound] = useState("none");
  const [volume, setVolumeState] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const howlRef = useRef(null);

  const stopCurrent = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current = null;
    }
  }, []);

  const play = useCallback(
    async (soundId) => {
      if (soundId === "none" || !soundId) {
        stopCurrent();
        setIsPlaying(false);
        return;
      }

      if (soundId === currentSound && isPlaying) {
        return;
      }

      stopCurrent();

      const audioPath = getAudioPath(soundId);
      const { Howl } = await import("howler");
      const nextHowl = new Howl({
        src: [audioPath],
        loop: true,
        volume,
        html5: true,
      });

      howlRef.current = nextHowl;
      howlRef.current.play();
      setCurrentSound(soundId);
      setIsPlaying(true);
    },
    [currentSound, isPlaying, stopCurrent, volume],
  );

  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
    }

    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.play();
    }

    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    stopCurrent();
    setIsPlaying(false);
    setCurrentSound("none");
  }, [stopCurrent]);

  const setVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));

    setVolumeState(clampedVolume);

    if (howlRef.current) {
      howlRef.current.volume(clampedVolume);
    }
  }, []);

  const changeSound = useCallback(
    async (soundId) => {
      if (soundId === "none") {
        stop();
        return;
      }

      await play(soundId);
    },
    [play, stop],
  );

  useEffect(() => {
    return () => {
      stopCurrent();
    };
  }, [stopCurrent]);

  return {
    currentSound,
    volume,
    isPlaying,
    play,
    pause,
    resume,
    stop,
    setVolume,
    changeSound,
  };
}
