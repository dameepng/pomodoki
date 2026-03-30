export const metadata = {
  title: "Pomodoki",
};

export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      {children}
    </main>
  );
}
