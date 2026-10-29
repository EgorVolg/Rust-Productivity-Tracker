import type { Cycle } from './types';
import type { CategoryStat, EnergyStat, LengthStat, Summary, WordStat } from './view';

// Компилируем regex один раз для производительности
const WORD_REGEX = /[^\p{L}\p{N}\s]/gu;
const WORD_SPLIT_REGEX = /\s+/;

/**
 * Вычисляет сводную статистику из циклов
 * @param cycles - массив циклов
 * @returns объект с общим количеством циклов, общим временем, количеством дней и средним временем в день
 */
export function calculateSummary(cycles: Cycle[]): Summary {
  const totalMinutes = cycles.reduce((sum, c) => sum + c.minutes, 0);

  // Вычисляем уникальные дни
  const uniqueDays = new Set(cycles.map(c => c.date)).size;

  return {
    cycles: cycles.length,

    totalMinutes,
    days: uniqueDays,
    avgPerDay: uniqueDays > 0 ? totalMinutes / uniqueDays : 0,
  };
}

/**
 * Вычисляет статистику по категориям
 * @param cycles - массив циклов
 * @returns массив статистики по каждой категории (количество циклов, время, доля в процентах)
 */
export function calculateCategoryStats(cycles: Cycle[]): CategoryStat[] {
  const categoryMap = new Map<string, { cycles: number; minutes: number }>();

  cycles.forEach(cycle => {
    const existing = categoryMap.get(cycle.category) || { cycles: 0, minutes: 0 };
    categoryMap.set(cycle.category, {
      cycles: existing.cycles + 1,
      minutes: existing.minutes + cycle.minutes,
    });
  });

  const totalMinutes = cycles.reduce((sum, c) => sum + c.minutes, 0);

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    cycles: data.cycles,
    minutes: data.minutes,
    share: totalMinutes > 0 ? (data.minutes / totalMinutes) * 100 : 0,
  }));
}

/**
 * Вычисляет статистику длины цикла
 * @param cycles - массив циклов
 * @returns объект с минимальной, максимальной и средней длительностью цикла в минутах
 */
export function calculateLengthStats(cycles: Cycle[]): LengthStat {
  if (cycles.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }

  const minutes = cycles.map(c => c.minutes);
  const min = Math.min(...minutes);
  const max = Math.max(...minutes);
  const avg = minutes.reduce((sum, m) => sum + m, 0) / minutes.length;

  return { min, max, avg };
}

/**
 * Вычисляет статистику энергии
 * @param cycles - массив циклов
 * @returns объект со средней энергией, медианой и распределением по оценкам 1-5
 */
export function calculateEnergyStats(cycles: Cycle[]): EnergyStat {
  if (cycles.length === 0) {
    return { avg: 0, median: 0, distribution: [0, 0, 0, 0, 0] };
  }

  const energies = cycles.map(c => c.energy);
  const avg = energies.reduce((sum, e) => sum + e, 0) / energies.length;

  // Медиана
  const sorted = [...energies].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  // Распределение по оценкам 1-5
  const distribution = [0, 0, 0, 0, 0];
  energies.forEach(e => {
    if (e >= 1 && e <= 5) {
      distribution[e - 1]++;
    }
  });

  return { avg, median, distribution };
}

/**
 * Вычисляет матрицу тепловой карты 7×24 (дни недели × часы)
 * Одна ячейка = 60 минут. Если цикл длится 90 мин, закрашиваем полторы ячейки.
 * @param cycles - массив циклов
 * @returns матрица 7x24 с суммой минут для каждого дня недели и часа
 */
export function calculateHeatmapMatrix(cycles: Cycle[]): number[][] {
  const matrix: number[][] = Array(7)
    .fill(null)
    .map(() => Array(24).fill(0));

  cycles.forEach(cycle => {
    const dayIndex = cycle.weekday - 1; // 0-6
    let hourIndex = cycle.hour;
    let remainingMinutes = cycle.minutes;

    if (dayIndex >= 0 && dayIndex < 7 && hourIndex >= 0 && hourIndex < 24) {
      // Распределяем минуты по ячейкам (каждая ячейка = 60 минут)
      while (remainingMinutes > 0 && hourIndex < 24) {
        const minutesInCell = Math.min(60, remainingMinutes);
        matrix[dayIndex][hourIndex] += minutesInCell;
        remainingMinutes -= minutesInCell;
        hourIndex++;
      }
    }
  });

  return matrix;
}

/**
 * Вычисляет лучший день и час по активности
 * @param matrix - матрица тепловой карты 7x24
 * @returns объект с лучшим днем недели и лучшим часом
 */
export function calculateBestDayAndHour(matrix: number[][]): {
  bestDay: { day: number; minutes: number };
  bestHour: { hour: number; minutes: number };
} {
  let bestDay = { day: 0, minutes: 0 };
  let bestHour = { hour: 0, minutes: 0 };

  // Лучший день (сумма минут по всем часам)
  matrix.forEach((row, dayIndex) => {
    const dayTotal = row.reduce((sum, minutes) => sum + minutes, 0);
    if (dayTotal > bestDay.minutes) {
      bestDay = { day: dayIndex, minutes: dayTotal };
    }
  });

  // Лучший час (сумма минут по всем дням)
  for (let hour = 0; hour < 24; hour++) {
    const hourTotal = matrix.reduce((sum, row) => sum + row[hour], 0);
    if (hourTotal > bestHour.minutes) {
      bestHour = { hour, minutes: hourTotal };
    }
  }

  return { bestDay, bestHour };
}

/**
 * Вычисляет утренний блок: минуты с 06:00 до 12:00 по дням недели
 * @param cycles - массив циклов
 * @returns массив из 7 элементов (Пн-Вс) с суммой минут в утренний блок
 */
export function calculateMorningBlock(cycles: Cycle[]): number[] {
  const morningMinutes = [0, 0, 0, 0, 0, 0, 0]; // 7 дней

  cycles.forEach(cycle => {
    const dayIndex = cycle.weekday - 1; // 0-6
    // Проверяем, попадает ли час в утренний блок (06:00-12:00)
    if (cycle.hour >= 6 && cycle.hour < 12 && dayIndex >= 0 && dayIndex < 7) {
      morningMinutes[dayIndex] += cycle.minutes;
    }
  });

  return morningMinutes;
}

/**
 * Вычисляет топ-N слов в темах циклов
 * Слова длиной менее 3 символов игнорируются, знаки препинания удаляются
 * @param cycles - массив циклов
 * @param top - количество слов для возвращения
 * @returns массив топ-N слов с их частотой
 */
export function calculateTopWords(cycles: Cycle[], top: number): WordStat[] {
  const wordMap = new Map<string, number>();

  cycles.forEach(cycle => {
    // Разбиваем тему на слова, игнорируя знаки препинания
    const words = cycle.topic
      .toLowerCase()
      .replace(WORD_REGEX, ' ') // оставляем только буквы, цифры и пробелы
      .split(WORD_SPLIT_REGEX)
      .filter(word => word.length >= 3); // только слова от 3 символов

    words.forEach(word => {
      const count = wordMap.get(word) || 0;
      wordMap.set(word, count + 1);
    });
  });

  // Преобразуем в массив и сортируем по частоте
  const sorted = Array.from(wordMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  // Возвращаем топ-N
  return sorted.slice(0, top);
}
