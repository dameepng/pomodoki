import { cn } from "@/lib/utils.js";

export default function Card({ children, className }) {
  return (
    <div className={cn("bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] p-6 shadow-card transition-colors duration-200", className)}>
      {children}
    </div>
  );
}
