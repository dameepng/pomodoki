"use client";

export default function VolumeControl({
  volume,
  onVolumeChange,
  disabled = false,
  accentColor = "#E85D3F",
}) {
  const percent = Math.round(volume * 100);

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-[var(--text-muted)]">Volume</span>
        <span className="text-xs tabular-nums text-[var(--text-muted)]">
          {percent}%
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          disabled={disabled}
          onChange={(event) => onVolumeChange(parseFloat(event.target.value))}
          className="volume-slider w-full"
          style={{
            "--slider-color": accentColor,
            "--slider-percent": `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}
