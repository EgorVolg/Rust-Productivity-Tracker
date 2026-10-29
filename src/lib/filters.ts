import { useMemo } from "react";
import { CATEGORIES, DEFAULT_FILTERS, type Filters, type Cycle } from "./types";

/**
 * Проверяет, есть ли активные фильтры
 * @param filters - объект фильтров
 * @returns true, если хотя бы один фильтр отличается от значения по умолчанию
 */
export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.category !== "all" ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.top !== DEFAULT_FILTERS.top
  );
}

/**
 * Вычисляет количество циклов по категориям для счётчиков в фильтре
 * @param cycles - массив циклов или null
 * @returns объект с количеством циклов для каждой категории и общего количества
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
 * Включает пресеты: 7 дней, 14 дней, текущий месяц, всё время
 * @param cycles - массив циклов или null
 * @returns массив пресетов с названиями и статусом активности
 */
export function usePeriodPresets(cycles: Cycle[] | null) {
  return useMemo(() => {
    if (!cycles) return [];
    const dates = cycles.map((c) => c.date).sort();
    if (dates.length === 0) return [];

    // Получаем название текущего месяца на русском
    const now = new Date();
    const monthName = now.toLocaleDateString("ru-RU", { month: "long" });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return [
      { label: "7 дней", active: false },
      { label: "14 дней", active: false },
      { label: capitalizedMonth, active: false },
      { label: "Всё время", active: true },
    ];
  }, [cycles]);
}

/**
 * Создаёт обработчики для изменения фильтров
 * @param setFilters - функция для обновления состояния фильтров
 * @param defaultFilters - фильтры по умолчанию для сброса
 * @returns объект с функциями-обработчиками для каждого типа фильтра
 */
export function useFilterHandlers(
  setFilters: React.Dispatch<React.SetStateAction<Filters>>,
  defaultFilters: Filters
): {
  handleCategoryChange: (category: string) => void;
  handlePeriodChange: (from: string, to: string) => void;
  handleTopChange: (top: number) => void;
  handleResetFilters: () => void;
} {
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
