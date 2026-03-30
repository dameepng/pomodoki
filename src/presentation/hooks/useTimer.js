import { useContext } from "react";

import { TimerContext } from "@/presentation/providers/TimerProvider.jsx";

function useTimer() {
  const context = useContext(TimerContext);

  if (context === null) {
    throw new Error("useTimer must be used within TimerProvider");
  }

  return context;
}

export { useTimer };

export default useTimer;
