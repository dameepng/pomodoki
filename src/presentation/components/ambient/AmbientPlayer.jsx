"use client";

import useAmbient from "@/presentation/hooks/useAmbient.js";
import useTimer from "@/presentation/hooks/useTimer.js";
import SoundSelector from "./SoundSelector.jsx";
import VolumeControl from "./VolumeControl.jsx";

const MODE_COLORS = {
  focus: "#E85D3F",
  short_break: "#4ECCA3",
  long_break: "#6C8EBF",
};

export default function AmbientPlayer() {
  const { mode, settings } = useTimer();
  const {
    currentSound,
    volume,
    isPlaying,
    changeSound,
    pause,
    resume,
    setVolume,
  } = useAmbient(settings?.ambientSound ?? "rain");
  const accentColor = MODE_COLORS[mode] || MODE_COLORS.focus;

  return (
    <section className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] p-6 transition-colors duration-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--text-muted)]">
            Ambient
          </p>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Ambient Sound
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Choose a background sound for your focus session.
          </p>
        </div>

        <button
          type="button"
          disabled={currentSound === "none"}
          onClick={() => {
            if (isPlaying) {
              pause();
              return;
            }

            resume();
          }}
          className="px-5 py-2.5 rounded-full text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)] transition-colors border border-[var(--border-default)] w-full sm:w-auto disabled:opacity-50"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <SoundSelector
          currentSound={currentSound}
          onSelect={changeSound}
          disabled={false}
          accentColor={accentColor}
        />
      </div>

      <VolumeControl
        volume={volume}
        onVolumeChange={setVolume}
        disabled={currentSound === "none"}
        accentColor={accentColor}
      />
    </section>
  );
}
