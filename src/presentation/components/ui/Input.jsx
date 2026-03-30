"use client";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

export default function Input({ label, error, className, ...rest }) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <input
        className={joinClasses(
          "w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
          className,
        )}
        {...rest}
      />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
