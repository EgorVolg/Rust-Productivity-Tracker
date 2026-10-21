import { useCallback, useEffect, useState } from "react";
import { ParseResult } from "./types";
import { api } from "./api";

export function useJournal() {
  const [journal, setJournal] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJournal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.loadJournal();
      setJournal(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJournal();
  }, [loadJournal]);

  return {
    journal,
    loading,
    error,
    loadJournal,
  };
}
