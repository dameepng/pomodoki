"use client";

import { createContext, useCallback, useContext, useState } from "react";

const TOAST_STYLES = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const addToast = useCallback(
    ({ message, type = "info", duration = 3000 }) => {
      const id = Date.now().toString();
      const toast = {
        id,
        message,
        type,
        duration,
      };

      setToasts((currentToasts) => [...currentToasts, toast]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex min-w-[260px] items-start justify-between gap-3 rounded-2xl px-4 py-3 text-sm text-white shadow-lg transition-opacity duration-200 ${
              TOAST_STYLES[toast.type] || TOAST_STYLES.info
            }`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-base leading-none text-white/90 transition hover:text-white"
              aria-label="Dismiss toast"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
