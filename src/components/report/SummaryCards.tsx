import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { DASH } from '../../lib/format';
import type { Summary } from '../../lib/view';
import { Duration } from '../ui';

/** §5.2. `summary = null` — нет данных после фильтра, всё выводится как «—» (§6.4) */
export function SummaryCards({ summary }: { summary: Summary | null }) {
  const s = summary;
  const empty = s === null;

  return (
    <section aria-label="Сводка" className="grid grid-cols-4 gap-5">
      <Stat
        label="Всего циклов"
        value={s ? s.cycles : DASH}
        caption={s ? `rust ${s.rust} · english ${s.english}` : 'нет циклов'}
        empty={empty}
      />
      <Stat
        label="Всего времени"
        value={s ? <Duration minutes={s.totalMinutes} /> : DASH}
        caption={s ? `${s.totalMinutes} мин` : DASH}
        empty={empty}
      />
      <Stat label="Дней с работой" value={s ? s.days : DASH} caption={s ? 'уникальных дат' : DASH} empty={empty} />
      <Stat
        label="Среднее в рабочий день"
        value={s ? <Duration minutes={s.avgPerDay} /> : DASH}
        caption={s ? `${s.avgPerDay.toFixed(1)} мин` : DASH}
        empty={empty}
      />
    </section>
  );
}

function Stat({ label, value, caption, empty }: { label: string; value: ReactNode; caption: string; empty: boolean }) {
  return (
    <div className="glass flex flex-col gap-3.5 px-6 py-5.5">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <span
        className={cn(
          'font-display text-[38px] leading-none font-medium tracking-[-0.02em]',
          empty ? 'text-subtle' : 'text-fg',
        )}
      >
        {value}
      </span>
      <span className="font-mono text-[13px] text-muted">{caption}</span>
    </div>
  );
}
