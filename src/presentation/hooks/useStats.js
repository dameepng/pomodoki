import { useCallback, useEffect, useState } from "react";

async function getErrorMessage(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export default function useStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("week");

  const fetchStats = useCallback(async () => {
    setError(null);

    try {
      const response = await fetch(`/api/sessions/stats?period=${period}`);

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to load stats"));
      }

      const data = await response.json();
      setStats(data?.stats ?? null);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    setIsLoading(true);
    void fetchStats();
  }, [period, fetchStats]);

  return {
    stats,
    isLoading,
    error,
    period,
    setPeriod,
    refetch: fetchStats,
  };
}
