import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { DASH, plural } from "../../lib/format";
import type { Summary } from "../../lib/view";
import { Duration } from "../ui";
import { CycleInput, Journal } from "@/lib";

export function SummaryCards({
  journal,
  summary,
}: {
  journal: Journal;
  summary: Summary | null;
}) {
  const s = summary;
  const empty = s === null;

  const totalTime = journal.cycles.reduce(
    (acc: number, cycle: CycleInput) => acc + cycle.minutes,
    0,
  );

  let daysInWork = 0;
  for (const days of journal.cycles) {
    if (days.minutes <= 240) {
      daysInWork = 0;
    }
    daysInWork++;
  }

  return (
    <section aria-label="Сводка" className="grid grid-cols-4 gap-5">
      <Stat
        label="Всего циклов"
        value={journal.lineCount}
        caption={s ? `rust ${s.rust} · english ${s.english}` : "нет циклов"}
        empty={empty}
      />
      <Stat
        label="Всего времени"
        value={s ? <Duration minutes={totalTime} /> : DASH}
        caption={s ? `${totalTime} мин` : DASH}
        empty={empty}
      />
      <Stat
        label="Дней в ударе &#128293;"
        value={daysInWork + " " + plural(daysInWork, "день", "дня", "дней")}
        caption="без остановки!"
        empty={empty}
      />
      <Stat
        label="Среднее в рабочий день"
        value={<Duration minutes={totalTime / daysInWork} />}
        caption={`${(totalTime / daysInWork).toFixed(1)} мин`}
        empty={empty}
      />
    </section>
  );
}

function Stat({
  label,
  value,
  caption,
  empty,
}: {
  label: string;
  value: ReactNode;
  caption: string;
  empty: boolean;
}) {
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
