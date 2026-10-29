import type { Cycle } from './types';
import type { CategoryStat, EnergyStat, LengthStat, Summary, WordStat } from './view';

/** Вычислить сводную статистику из циклов */
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

/** Вычислить статистику по категориям */
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

/** Вычислить статистику длины цикла */
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

/** Вычислить статистику энергии */
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

/** Вычислить матрицу тепловой карты 7×24 (дни недели × часы)
 * Одна ячейка = 60 минут. Если цикл длится 90 мин, закрашиваем полторы ячейки.
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

/** Вычислить лучший день и час */
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

/** Вычислить утренний блок: минуты с 06:00 до 12:00 по дням недели */
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

/** Вычислить топ-N слов в темах */
export function calculateTopWords(cycles: Cycle[], top: number): WordStat[] {
  const wordMap = new Map<string, number>();

  cycles.forEach(cycle => {
    // Разбиваем тему на слова, игнорируя знаки препинания
    const words = cycle.topic
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ') // оставляем только буквы, цифры и пробелы
      .split(/\s+/)
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
