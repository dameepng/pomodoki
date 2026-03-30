"use client";

import useAmbient from "@/presentation/hooks/useAmbient.js";
import SoundSelector from "./SoundSelector.jsx";
import VolumeControl from "./VolumeControl.jsx";

export default function AmbientPlayer() {
  const {
    currentSound,
    volume,
    isPlaying,
    changeSound,
    pause,
    resume,
    setVolume,
  } = useAmbient();

  return (
    <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Ambient Sound
          </h2>
          <p className="text-sm text-slate-500">
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
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            currentSound === "none"
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>

      <SoundSelector
        currentSound={currentSound}
        onSelect={changeSound}
        disabled={false}
      />

      <VolumeControl
        volume={volume}
        onVolumeChange={setVolume}
        disabled={currentSound === "none"}
      />
    </section>
  );
}
