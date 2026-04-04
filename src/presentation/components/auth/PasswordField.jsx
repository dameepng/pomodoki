"use client";

import { useState } from "react";

function EyeIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.73 5.08A10.94 10.94 0 0112 5.25c6.75 0 9.75 6.75 9.75 6.75a16.96 16.96 0 01-4.06 4.95M6.1 6.1A16.97 16.97 0 002.25 12S5.25 18.75 12 18.75c1.82 0 3.37-.49 4.69-1.23M9.88 9.88A3 3 0 0014.12 14.12"
      />
    </svg>
  );
}

export default function PasswordField({
  id = "password",
  label = "Password",
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-[var(--text-secondary)]"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-4 py-3 pr-14 text-[var(--text-primary)] outline-none transition focus:border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--border-subtle)]"
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setIsVisible((currentState) => !currentState)}
          className="absolute inset-y-0 right-2 my-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          aria-label={isVisible ? "Sembunyikan password" : "Tampilkan password"}
          aria-pressed={isVisible}
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}
