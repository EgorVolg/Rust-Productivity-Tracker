import { useCallback, useEffect, useState } from "react";
import { DEFAULT_FILTERS, Filters, ParseResult } from "../types";
import { api } from "../api";

export function useJournal(filters: Filters = DEFAULT_FILTERS) {
  const [journal, setJournal] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJournal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Если есть активные фильтры, используем loadFilteredJournal
      const hasActiveFilters =
        filters.category !== "all" ||
        filters.from !== "" ||
        filters.to !== "" ||
        filters.top !== 10;

      const result = hasActiveFilters
        ? await api.loadFilteredJournal(filters)
        : await api.loadJournal();

      setJournal(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

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
