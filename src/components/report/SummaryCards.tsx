import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { DASH, plural } from "../../lib/format";
import type { Summary, CategoryStat } from "../../lib/view";
import type { Journal } from "../../lib/types";
import { Duration } from "../ui";

interface SummaryCardsProps {
  journal: Journal;
  summary: Summary | null;
  categories: CategoryStat[];
}

export function SummaryCards({
  journal,
  summary,
  categories,
}: SummaryCardsProps) {
  const empty = summary === null;

  const totalTime = journal.cycles.reduce(
    (acc, cycle) => acc + cycle.minutes,
    0,
  );

  // Вычисляем количество уникальных дней для среднего времени
  const uniqueDays = new Set(journal.cycles.map(c => c.date)).size;
  const avgPerDay = uniqueDays > 0 ? totalTime / uniqueDays : 0;

  // Топ-5 категорий по количеству циклов
  const topCategories = [...categories]
    .sort((a, b) => b.cycles - a.cycles)
    .slice(0, 5)
    .map(c => `${c.category} ${c.cycles}`)
    .join(" · ");

  return (
    <section aria-label="Сводка" className="grid grid-cols-4 gap-5">
      <Stat
        label="Всего циклов"
        value={journal.totalCycles}
        caption={topCategories || "нет циклов"}
        empty={empty}
      />
      <Stat
        label="Всего времени"
        value={summary ? <Duration minutes={totalTime} /> : DASH}
        caption={summary ? `${totalTime} мин` : DASH}
        empty={empty}
      />
      <Stat
        label="Дней в ударе &#128293;"
        value={
          journal.streakDays +
          " " +
          plural(journal.streakDays, "день", "дня", "дней")
        }
        caption="без остановки!"
        empty={empty}
      />
      <Stat
        label="Среднее в рабочий день"
        value={<Duration minutes={avgPerDay} />}
        caption={`${avgPerDay.toFixed(1)} мин`}
        empty={empty}
      />
    </section>
  );
}

interface StatProps {
  label: string;
  value: ReactNode;
  caption: string;
  empty: boolean;
}

function Stat({
  label,
  value,
  caption,
  empty,
}: StatProps) {
  return (
    <div className="glass flex flex-col gap-3.5 px-6 py-5.5">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <span
        className={cn(
          "font-display text-[38px] leading-none font-medium tracking-[-0.02em]",
          empty ? "text-subtle" : "text-fg",
        )}
      >
        {value}
      </span>
      <span className="font-mono text-[13px] text-muted">{caption}</span>
    </div>
  );
}
