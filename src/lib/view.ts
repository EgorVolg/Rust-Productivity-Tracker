// Типы для отображения отчёта. Модель данных — в ./types.ts.
import type { Category } from './types';

export interface FileInfo {
  name: string;
  lines: number;
  cycles: number;
  errors: number;
  encoding: string;
  from: string;
  to: string;
}

export interface Summary {
  cycles: number;
  rust: number;
  english: number;
  totalMinutes: number;
  days: number;
  avgPerDay: number;
}

export interface CategoryStat {
  category: Category;
  cycles: number;
  minutes: number;
  /** доля в процентах, без округления (§6.2) */
  share: number;
}

export interface LengthStat {
  min: number;
  max: number;
  avg: number;
}

export interface EnergyStat {
  avg: number;
  median: number;
  /** индекс 0 = оценка 1 */
  distribution: number[];
}

export interface WordStat {
  word: string;
  count: number;
}

export interface CycleDraft {
  mode: 'add' | 'edit';
  date: string;
  weekdayLabel: string;
  hour: number;
  category: Category;
  topic: string;
  minutes: string;
  energy: number;
  csvLine: string;
  note?: string;
  errors?: { date?: string; topic?: string; minutes?: string };
}

export type PanelId = 'category' | 'period' | 'top' | 'file' | 'errors' | 'open-file' | 'add-cycle' | null;

/** Только для просмотра вёрстки: какие слои показать открытыми */
export interface PreviewState {
  panel: PanelId;
  empty: boolean;
  toast: boolean;
  heatTooltip: { day: number; hour: number } | null;
}
