import { DEFAULT_FILTERS } from '../lib/types';
import type { Cycle, Filters, ParseError } from '../lib/types';
import type { CategoryStat, CycleDraft, EnergyStat, FileInfo, LengthStat, Summary, WordStat } from '../lib/view';

// Демо-данные для вёрстки. Все разделы согласованы между собой.

export const file: FileInfo = {
  name: 'journal.csv',
  lines: 41,
  cycles: 36,
  errors: 4,
  encoding: 'UTF-8',
  from: '2026-10-07',
  to: '2026-10-20',
};

export const filters: Filters = { ...DEFAULT_FILTERS };

export const categoryCounts = { all: 36, rust: 23, english: 13 };

export const summary: Summary = {
  cycles: 36,
  rust: 23,
  english: 13,
  totalMinutes: 1505,
  days: 14,
  avgPerDay: 107.5,
};

export const categories: CategoryStat[] = [
  { category: 'rust', cycles: 23, minutes: 1235, share: 82.0598 },
  { category: 'english', cycles: 13, minutes: 270, share: 17.9402 },
];

export const cycleLength: LengthStat = { min: 15, max: 120, avg: 41.8056 };

export const energy: EnergyStat = { avg: 3.5556, median: 4, distribution: [0, 4, 13, 14, 5] };

/** 7 строк (Пн–Вс) × 24 часа, сумма минут */
export const heatmap: number[][] = [
  [0, 0, 0, 0, 0, 0, 50, 50, 0, 0, 20, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 140, 50, 30, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 100, 40, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 30, 0, 45, 0, 0],
  [0, 0, 0, 0, 0, 0, 50, 50, 0, 0, 0, 0, 15, 15, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0],
  [0, 0, 0, 0, 0, 0, 40, 50, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 210, 0, 90, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0],
];

/** индекс 0 = понедельник */
export const bestDay = { day: 6, minutes: 330 };
export const bestHour = { hour: 6, minutes: 480 };

/** минуты с 06:00 до 12:00, Пн–Вс */
export const morning = [120, 220, 200, 140, 100, 120, 300];

export const topWords: WordStat[] = [
  { word: 'глава', count: 8 },
  { word: 'rustlings', count: 8 },
  { word: 'без', count: 6 },
  { word: 'субтитров', count: 6 },
  { word: 'разговор', count: 4 },
  { word: 'english', count: 4 },
  { word: 'practice', count: 4 },
  { word: 'todo', count: 4 },
  { word: 'tauri', count: 4 },
  { word: 'anki', count: 3 },
];

/** последние циклы, новые сверху */
export const recentCycles: Cycle[] = [
  { id: 'c36', date: '2026-10-20', weekday: 2, hour: 14, category: 'english', topic: 'Разговор в English Practice 🎧', minutes: 15, energy: 3, color: '#22d3ee' },
  { id: 'c35', date: '2026-10-20', weekday: 2, hour: 6, category: 'rust', topic: 'ToDo на Tauri: команды', minutes: 90, energy: 5, color: '#f87171' },
  { id: 'c34', date: '2026-10-19', weekday: 1, hour: 12, category: 'english', topic: 'Sonny Sangha без субтитров', minutes: 15, energy: 3, color: '#22d3ee' },
  { id: 'c33', date: '2026-10-19', weekday: 1, hour: 7, category: 'rust', topic: 'Rustlings vecs', minutes: 50, energy: 4, color: '#f87171' },
  { id: 'c32', date: '2026-10-19', weekday: 1, hour: 6, category: 'rust', topic: 'Глава 8: векторы', minutes: 50, energy: 4, color: '#f87171' },
];

export const inputErrors: ParseError[] = [
  { line: 12, message: '„минуты“ — не число: abc' },
  { line: 19, message: 'ожидалось 7 полей, найдено 6' },
  { line: 27, message: '„энергия“ должна быть от 1 до 5, получено 7' },
  { line: 41, message: 'неизвестная категория: python' },
];

export const periodPresets = [
  { label: '7 дней', active: false },
  { label: '14 дней', active: true },
  { label: 'Октябрь', active: false },
  { label: 'Всё время', active: false },
];

export const cycleDraft: CycleDraft = {
  mode: 'add',
  date: '2026-10-20',
  weekdayLabel: 'Вторник · день 2',
  hour: 8,
  color: '#f87171',
  category: 'rust',
  topic: 'Глава 10: обобщения',
  minutes: 50,
  energy: 4,
};

export const topicSuggestions = ['ToDo на Tauri: команды', 'Rustlings vecs', 'Глава 8: векторы', 'study-log: тепловая карта'];
