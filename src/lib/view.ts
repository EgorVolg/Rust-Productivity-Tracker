// Типы для отображения отчёта. Модель данных — в ./types.ts.

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
  totalMinutes: number;
  days: number;
  avgPerDay: number;
}

export interface CategoryStat {
  category: string;
  cycles: number;
  minutes: number; 
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
  color: string;
  category: string;
  topic: string;
  minutes: number;
  energy: number;
  note?: string;
  errors?: { date?: string; topic?: string; minutes?: string };
}

export type PanelId = 'category' | 'period' | 'top' | 'file' | 'errors' | 'open-file' | 'add-cycle' | null;

/** Только для просмотра вёрстки: какие слои показать открытыми */
export interface PreviewState {
  panel: PanelId;
  empty: boolean;
  heatTooltip: { day: number; hour: number } | null;
}
