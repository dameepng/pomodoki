"use client";

import Link from "next/link";
import { useState } from "react";

import PasswordField from "@/presentation/components/auth/PasswordField.jsx";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registrasi gagal");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-[var(--bg-card)] p-8 shadow-card border border-[var(--border-default)] transition-colors duration-200">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Buat akun Pomodoki
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Mulai kebiasaan fokusmu dengan akun baru.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[var(--text-secondary)]"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--border-subtle)]"
              placeholder="Buat username"
              autoComplete="username"
            />
          </div>

          <PasswordField
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Buat password"
            autoComplete="new-password"
          />

          {error ? (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#E85D3F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d4512f] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Sudah punya akun?{" "}
          <Link className="font-semibold text-[var(--text-primary)]" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
