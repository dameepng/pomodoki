import TimerProvider from "@/presentation/providers/TimerProvider.jsx";
import Navbar from "@/presentation/components/ui/Navbar.jsx";

export default function MainLayout({ children }) {
  return (
    <TimerProvider>
      <Navbar />
      <main className="min-h-screen bg-stone-100 pt-16 text-slate-900">
        {children}
      </main>
    </TimerProvider>
  );
}
