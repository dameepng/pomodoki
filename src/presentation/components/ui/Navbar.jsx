"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils.js";
import { useAuth } from "@/presentation/providers/AuthProvider.jsx";
import { useTheme } from "@/presentation/providers/ThemeProvider.jsx";

const NAV_ITEMS = [
  { label: "Timer", href: "/" },
  { label: "Stats", href: "/stats" },
  { label: "Settings", href: "/settings" },
];

function SunIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);

  const isActiveLink = (href) => {
    if (href === "/") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    if (isMobileMenuOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        setUser(null);
        router.push("/login");
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoggingOut(false);
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    }
  }, [setUser, router]);

  // Get initials from username
  const getInitials = (username) => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-navbar)] backdrop-blur-lg transition-colors duration-200">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6" ref={menuRef}>
        <div className="flex min-h-14 items-center gap-3 py-2">
          <Link href="/" className="min-w-0 text-[13px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-sm">
            pomodoki
          </Link>

          <div className="hidden flex-1 items-center gap-2 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-[13px] transition-colors",
                    isActive
                      ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              id="theme-toggle"
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <div className="transition-transform duration-300" style={{ transform: theme === "dark" ? "rotate(-90deg)" : "rotate(0deg)" }}>
                {theme === "dark" ? <MoonIcon /> : <SunIcon />}
              </div>
            </button>

            {user ? (
              <div className="relative hidden lg:block">
                <button
                  id="user-menu-button"
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsUserMenuOpen((currentState) => !currentState);
                  }}
                  className="flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] py-1 pl-1 pr-3 transition-colors hover:bg-[var(--bg-elevated)]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[11px] font-semibold text-white shadow-sm shadow-violet-500/25">
                    {getInitials(user.username)}
                  </div>
                  <span className="max-w-28 truncate text-[13px] text-[var(--text-secondary)]">
                    {user.username}
                  </span>
                  <svg
                    className={cn(
                      "h-3 w-3 text-[var(--text-muted)] transition-transform duration-200",
                      isUserMenuOpen && "rotate-180",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-1.5 shadow-xl"
                    style={{ animation: "dropdownIn 150ms ease-out" }}
                  >
                    <div className="mb-1.5 border-b border-[var(--border-default)] px-3 py-2.5">
                      <p className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                        {user.username}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                        Logged in
                      </p>
                    </div>

                    <button
                      id="logout-button"
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                      </svg>
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen(false);
                setIsMobileMenuOpen((currentState) => !currentState);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="border-t border-[var(--border-default)] pb-4 pt-3 lg:hidden"
            style={{ animation: "dropdownIn 150ms ease-out" }}
          >
            <div className="grid gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = isActiveLink(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {user ? (
              <div className="mt-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-semibold text-white shadow-sm shadow-violet-500/25">
                    {getInitials(user.username)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {user.username}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Logged in</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-[var(--border-default)] px-3 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </nav>
    </header>
  );
}
