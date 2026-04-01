import TimerProvider from "@/presentation/providers/TimerProvider.jsx";
import Navbar from "@/presentation/components/ui/Navbar.jsx";

export default function MainLayout({ children }) {
  return (
    <TimerProvider>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
        {children}
      </main>
    </TimerProvider>
  );
}
