import TimerProvider from "@/presentation/providers/TimerProvider.jsx";

export default function MainLayout({ children }) {
  return (
    <TimerProvider>
      <main className="min-h-screen bg-stone-100 text-slate-900">
        {children}
      </main>
    </TimerProvider>
  );
}
