const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

export default function Card({ children, className }) {
  return (
    <div
      className={joinClasses(
        "rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200",
        className,
      )}
    >
      {children}
    </div>
  );
}
