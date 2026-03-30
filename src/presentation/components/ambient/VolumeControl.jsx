"use client";

export default function VolumeControl({
  volume,
  onVolumeChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg leading-none" aria-hidden="true">
        🔊
      </span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        disabled={disabled}
        onChange={(event) => onVolumeChange(parseFloat(event.target.value))}
        className="w-full accent-red-500"
      />
      <span className="w-12 text-right text-sm font-medium text-slate-600">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}
