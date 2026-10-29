import { useMemo } from "react";
import { CATEGORIES, type Filters, type Cycle } from "./types";

/**
 * Вычисляет количество циклов по категориям для счётчиков в фильтре
 */
export function useCategoryCounts(cycles: Cycle[] | null) {
  return useMemo(() => {
    if (!cycles) return { all: 0 };
    const counts: Record<string, number> = { all: cycles.length };
    // Инициализируем все категории с 0
    CATEGORIES.forEach((cat) => {
      counts[cat] = 0;
    });
    // Считаем реальные циклы
    cycles.forEach((cycle) => {
      counts[cycle.category] = (counts[cycle.category] || 0) + 1;
    });
    return counts;
  }, [cycles]);
}

/**
 * Создаёт пресеты периодов на основе данных журнала
 */
export function usePeriodPresets(cycles: Cycle[] | null) {
  return useMemo(() => {
    if (!cycles) return [];
    const dates = cycles.map((c) => c.date).sort();
    if (dates.length === 0) return [];

    return [
      { label: "7 дней", active: false },
      { label: "14 дней", active: false },
      { label: "Октябрь", active: false },
      { label: "Всё время", active: true },
    ];
  }, [cycles]);
}

/**
 * Создаёт обработчики для фильтров
 */
export function useFilterHandlers(
  setFilters: React.Dispatch<React.SetStateAction<Filters>>,
  defaultFilters: Filters
) {
  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handlePeriodChange = (from: string, to: string) => {
    setFilters((prev) => ({ ...prev, from, to }));
  };

  const handleTopChange = (top: number) => {
    setFilters((prev) => ({ ...prev, top }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    handleCategoryChange,
    handlePeriodChange,
    handleTopChange,
    handleResetFilters,
  };
}
