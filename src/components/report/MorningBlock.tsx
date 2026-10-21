import { cn } from '../../lib/cn';
import { WEEKDAYS_SHORT, formatDuration } from '../../lib/format';
import { Card, CardHeader } from '../ui';

const BAR_MAX_PX = 170;

/** §5.7: сумма минут с 06:00 до 12:00 по каждому дню недели */
export function MorningBlock({ minutesByDay }: { minutesByDay: number[] }) {
  const max = Math.max(...minutesByDay);
  const total = minutesByDay.reduce((a, b) => a + b, 0);

  return (
    <Card aria-labelledby="h-morning" className="gap-5.5">
      <CardHeader
        id="h-morning"
        title="Утренний блок"
        tag="§5.7"
        description="Минуты с 06:00 до 12:00 по дням недели"
        actions={
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-medium text-muted">Итого утром</span>
            <span className="font-mono text-sm text-lilac">{formatDuration(total)}</span>
          </div>
        }
      />

      <div className="grid h-62.5 grid-cols-7 items-end gap-3">
        {minutesByDay.map((v, i) => (
          <div key={i} className="flex h-full flex-col items-center justify-end gap-2.5">
            <span className="font-mono text-[11px] whitespace-nowrap text-soft">{formatDuration(v)}</span>
            <div
              className={cn(
                'w-full max-w-13 rounded-t-xl rounded-b-md bg-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]',
                v === max && max > 0 ? 'opacity-100' : 'opacity-50',
              )}
              style={{ height: max > 0 ? Math.max(4, Math.round((v / max) * BAR_MAX_PX)) : 4 }}
            />
            <span className="text-[13px] font-semibold text-soft">{WEEKDAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
