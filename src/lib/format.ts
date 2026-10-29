export const DASH = '—';

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
export const WEEKDAYS_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
export const HOURS = Array.from({ length: 24 }, (_, h) => h);

/**
 * Дополняет число нулями до двух знаков
 * @param n - число для форматирования
 * @returns строка с ведущими нулями (например, 5 → "05")
 */
export const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Форматирует длительность в часы и минуты
 * @param minutes - количество минут
 * @returns строка в формате "12 ч 30 мин" или "45 мин" (если часов нет)
 */
export function formatDuration(minutes: number): string {
  const m = Math.round(minutes);
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return h > 0 ? `${h} ч ${rest} мин` : `${rest} мин`;
}

/**
 * Обрезает текст по символам, а не по байтам
 * @param text - исходный текст
 * @param max - максимальное количество символов (по умолчанию 20)
 * @returns обрезанный текст с многоточием в конце, если текст был длиннее
 */
export function truncate(text: string, max = 20): string {
  const chars = Array.from(text);
  return chars.length > max ? chars.slice(0, max - 1).join('') + '…' : text;
}

/**
 * Возвращает правильную форму множественного числа для русского языка
 * @param n - число
 * @param one - форма для единственного числа (1)
 * @param few - форма для чисел 2-4
 * @param many - форма для чисел 5 и более
 * @returns правильная форма слова
 * @example plural(5, "день", "дня", "дней") → "дней"
 */
export function plural(n: number, one: string, few: string, many: string): string {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}
