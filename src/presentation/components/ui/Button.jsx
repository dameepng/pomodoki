"use client";

import { cn } from "@/lib/utils.js";

const VARIANT_CLASSES = {
  primary:
    "bg-[#E85D3F] text-white hover:-translate-y-0.5 hover:text-white",
  secondary:
    "border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:-translate-y-0.5 hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]",
  ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
};

const SIZE_CLASSES = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-10 py-3.5 text-base",
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  onClick,
  type = "button",
  className,
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E85D3F]/20 active:translate-y-px",
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
        SIZE_CLASSES[size] || SIZE_CLASSES.md,
        isDisabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {isLoading ? <Spinner /> : null}
      <span>{children}</span>
    </button>
  );
}
