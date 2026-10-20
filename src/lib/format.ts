export const DASH = '—';

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
export const WEEKDAYS_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
export const HOURS = Array.from({ length: 24 }, (_, h) => h);

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** §6.6: «12 ч 30 мин», при нуле часов — «45 мин» */
export function formatDuration(minutes: number): string {
  const m = Math.round(minutes);
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return h > 0 ? `${h} ч ${rest} мин` : `${rest} мин`;
}

/** §5.9 + §6.5: обрезка по символам, а не по байтам */
export function truncate(text: string, max = 20): string {
  const chars = Array.from(text);
  return chars.length > max ? chars.slice(0, max - 1).join('') + '…' : text;
}

export function plural(n: number, one: string, few: string, many: string): string {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}
