export const metadata = {
  title: "Pomodoki",
};

export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-4 py-10 transition-colors duration-200">
      {children}
    </main>
  );
}
