
export const CATEGORIES: readonly string[] = ['rust', 'english', 'work', 'health', 'family', 'hobby', 'leisure', 'other'];

export type Category = string;

export const Colors = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#22d3ee",
  "#818cf8",
  "#e879f9",
];

export type Color = string;

export function getCategoryColor(category: string): Color {
  const index = CATEGORIES.indexOf(category);
  if (index === -1) return Colors[Colors.length - 1];
  return Colors[index % Colors.length];
}


export interface Cycle {
  id: string;
  date: string;
  weekday: number;
  hour: number;
  category: string;
  topic: string;
  minutes: number;
  energy: number;
  color: Color;
}

export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  cycles: Cycle[];
  errors: ParseError[];
  lineCount: number;
  streakDays: number;
  totalCycles: number;
}


export interface Filters {
  category: string | 'all';
  from: string;
  to: string;
  top: number;
}

export const DEFAULT_FILTERS: Filters = { category: 'all', from: '', to: '', top: 10 };
