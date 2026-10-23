
export const CATEGORIES: readonly string[] = ['rust', 'english', 'other', 'work', 'health', 'family', 'hobby', 'leisure', 'other'];

/** Один цикл — одна строка CSV (§2.2). */
export interface Cycle {
  /** Служебный id для React и правок; в файл не пишется. */
  id: string;
  /** ГГГГ-ММ-ДД */
  date: string;
  /** 1–7, 1 = понедельник */
  weekday: number;
  /** 0–23 */
  hour: number;
  category: string;
  topic: string;
  /** 1–600 */
  minutes: number;
  /** 1–5 */
  energy: number;
}

/** §3.2: номер строки в файле и причина. */
export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  cycles: Cycle[];
  errors: ParseError[];
  /** Сколько строк было в файле, включая комментарии и пустые. */
  lineCount: number;
  /** Количество дней подряд с активностью. */
  streakDays: number;
}

// export interface Journal extends ParseResult {
//   fileName: string;
// }

export interface Filters {
  category: string | 'all';
  /** ГГГГ-ММ-ДД или пустая строка — без границы */
  from: string;
  to: string;
  /** §4.4: сколько слов в частотном словаре */
  top: number;
}

export const DEFAULT_FILTERS: Filters = { category: 'all', from: '', to: '', top: 10 };
