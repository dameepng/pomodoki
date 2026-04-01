"use client";

import { cn } from "@/lib/utils.js";

export default function Input({ label, error, className, ...rest }) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      ) : null}

      <input
        className={cn(
          "w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-subtle)] focus:ring-1 focus:ring-[var(--border-subtle)] transition-all",
          error && "border-[#E85D3F] focus:border-[#E85D3F] focus:ring-[#E85D3F]/20",
          className,
        )}
        {...rest}
      />

      {error ? <p className="text-sm text-[#E85D3F]">{error}</p> : null}
    </div>
  );
}
