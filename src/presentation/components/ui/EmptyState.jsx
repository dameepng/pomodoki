"use client";

export default function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="text-5xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-slate-700">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-slate-500">{description}</p>
      ) : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
