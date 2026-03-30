"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Button from "@/presentation/components/ui/Button.jsx";
import useAuth from "@/presentation/hooks/useAuth.js";

const NAV_ITEMS = [
  { label: "🍅 Timer", href: "/" },
  { label: "📊 Stats", href: "/stats" },
  { label: "⚙️ Settings", href: "/settings" },
];

function splitNavLabel(label) {
  const [emoji, ...textParts] = label.split(" ");

  return {
    emoji,
    text: textParts.join(" "),
  };
}

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-900 transition hover:text-red-500"
        >
          Pomodoki
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const { emoji, text } = splitNavLabel(item.label);
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span aria-hidden="true">{emoji}</span>
                <span className="hidden sm:inline">{text}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden max-w-32 truncate text-sm font-medium text-slate-600 sm:inline">
            {user?.username || "User"}
          </span>
          <Button
            size="sm"
            variant="ghost"
            isLoading={isLoggingOut}
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
