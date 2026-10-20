import { cn } from '../../lib/cn';
import { HOURS, WEEKDAYS_FULL, WEEKDAYS_SHORT, formatDuration, pad2 } from '../../lib/format';
import { Card, CardHeader } from '../ui';

/** Пять уровней из §5.6: « », ░, ▒, ▓, █ */
const LEVEL_BG = ['bg-white/5', 'bg-heat-1', 'bg-heat-2', 'bg-heat-3', 'bg-heat-4'];
const GLYPHS = ['', '░', '▒', '▓', '█'];

interface HeatmapProps {
  /** 7 строк (Пн–Вс) × 24 часа, сумма минут */
  matrix: number[][];
  bestDay: { day: number; minutes: number };
  bestHour: { hour: number; minutes: number };
  /** клетка с открытой подсказкой — только для просмотра вёрстки */
  tooltip?: { day: number; hour: number } | null;
}

export function Heatmap({ matrix, bestDay, bestHour, tooltip = null }: HeatmapProps) {
  const max = Math.max(0, ...matrix.flat());
  const level = (v: number) => (v <= 0 || max <= 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)));
  const legend = [0, 1, 2, 3, 4].map((k) => ({
    k,
    text: k === 0 ? '0 мин' : `${GLYPHS[k]} ${Math.floor((max * (k - 1)) / 4) + 1}–${Math.floor((max * k) / 4)}`,
  }));

  return (
    <Card padding="lg" aria-labelledby="h-heat" className="gap-6">
      <CardHeader
        id="h-heat"
        size="lg"
        title="Тепловая карта"
        tag="§5.6"
        description="Сумма минут по дню недели и часу начала"
        actions={
          <div className="flex flex-wrap items-center gap-3.5">
            {legend.map((l) => (
              <div key={l.k} className="flex items-center gap-2 font-mono text-xs text-soft">
                <span className={cn('size-4 rounded-[5px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)]', LEVEL_BG[l.k])} />
                {l.text}
              </div>
            ))}
          </div>
        }
      />

      <div role="img" aria-label="Тепловая карта: минуты работы по дням недели и часам" className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-9 flex-none" />
          <div className="grid flex-1 grid-cols-24 gap-1.5">
            {HOURS.map((h) => (
              <div key={h} className="text-center font-mono text-[11px] text-faint">
                {pad2(h)}
              </div>
            ))}
          </div>
        </div>

        {matrix.map((row, d) => (
          <div key={d} className="flex items-center gap-1.5">
            <div className="w-9 flex-none text-[13px] font-semibold text-soft">{WEEKDAYS_SHORT[d]}</div>
            <div className="grid flex-1 grid-cols-24 gap-1.5">
              {row.map((v, h) => {
                const lv = level(v);
                const open = tooltip?.day === d && tooltip.hour === h;
                return (
                  <div
                    key={h}
                    title={`${WEEKDAYS_FULL[d]}, ${pad2(h)}:00 — ${v > 0 ? formatDuration(v) : 'нет работы'}`}
                    className={cn(
                      'relative h-8 rounded-lg',
                      LEVEL_BG[lv],
                      open
                        ? 'shadow-[inset_0_0_0_1px_rgb(255_255_255/0.75)]'
                        : 'shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]',
                    )}
                  >
                    {open && (
                      <div
                        className={cn(
                          'pointer-events-none absolute bottom-[calc(100%+8px)] z-5 flex flex-col gap-1 rounded-xl border border-lilac/22 bg-popover px-3 py-2.5 whitespace-nowrap shadow-[0_16px_32px_rgb(4_2_14/0.5)]',
                          h < 3 ? 'left-0' : h > 20 ? 'right-0' : 'left-1/2 -translate-x-1/2',
                        )}
                      >
                        <span className="text-xs font-medium text-muted">
                          {WEEKDAYS_FULL[d]}, {pad2(h)}:00
                        </span>
                        <span className="font-mono text-[15px] font-semibold">
                          {v > 0 ? `${formatDuration(v)}  ${GLYPHS[lv]}` : 'нет работы'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Insight label="Самый продуктивный день" value={WEEKDAYS_FULL[bestDay.day]} minutes={bestDay.minutes} />
        <Insight label="Самый продуктивный час" value={`${pad2(bestHour.hour)}:00`} minutes={bestHour.minutes} />
      </div>
    </Card>
  );
}

function Insight({ label, value, minutes }: { label: string; value: string; minutes: number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-well/30 px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="font-display text-xl font-medium">{value}</span>
      </div>
      <span className="font-mono text-sm text-lilac">{formatDuration(minutes)}</span>
    </div>
  );
}
