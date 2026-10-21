import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { plural } from "../../lib/format";
import type { Filters } from "../../lib/types";
import type { PanelId } from "../../lib/view";
import { CategoryPopover, PeriodPopover, TopWordsPopover } from "../overlays";
import {
  Button,
  IconCalendar,
  IconChevronDown,
  IconFilter,
  IconX,
} from "../ui";

interface FilterBarProps {
  filters: Filters;
  counts: Record<Filters["category"], number>;
  total: number;
  presets: { label: string; active: boolean }[];
  openPanel: PanelId;
}

export function FilterBar({
  filters,
  counts,
  total,
  presets,
  openPanel,
}: FilterBarProps) {
  const periodActive = filters.from !== "" || filters.to !== "";
  const anyFilter =
    filters.category !== "all" || periodActive || filters.top !== 10;
  const periodLabel = !periodActive
    ? "Всё время"
    : filters.from && filters.to
      ? `${filters.from} — ${filters.to}`
      : filters.from
        ? `с ${filters.from}`
        : `по ${filters.to}`;

  return (
    <section
      aria-label="Фильтры отчёта"
      className="glass relative z-50 flex flex-wrap items-center justify-between gap-4 py-3.5 pr-4 pl-5.5"
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="mr-1.5 flex items-center gap-2 text-sm font-semibold text-soft">
          <IconFilter className="size-4" />
          Фильтры
        </span>

        <FilterButton
          label="Категория"
          value={filters.category === "all" ? "Все" : filters.category}
          active={filters.category !== "all"}
          open={openPanel === "category"}
          popover={
            <CategoryPopover selected={filters.category} counts={counts} />
          }
        />
        <FilterButton
          icon={<IconCalendar className="size-4 text-muted" />}
          label="Период"
          value={periodLabel}
          active={periodActive}
          open={openPanel === "period"}
          popover={
            <PeriodPopover
              from={filters.from || "2026-10-07"}
              to={filters.to || "2026-10-20"}
              presets={presets}
              hint="Формат ГГГГ-ММ-ДД · в периоде 36 циклов"
            />
          }
        />
        <FilterButton
          label="Топ слов"
          value={String(filters.top)}
          active={filters.top !== 10}
          open={openPanel === "top"}
          popover={<TopWordsPopover value={filters.top} />}
        />
      </div>

      <div className="flex items-center gap-3.5">
        <span className="text-[13px] font-medium text-muted">
          Показано {"NaN"} из {total}
          {plural(total, "цикла", "циклов", "циклов")}
        </span>
        {anyFilter && (
          <Button variant="ghost" className="px-3.5">
            <IconX className="size-3.5" />
            Сбросить
          </Button>
        )}
      </div>
    </section>
  );
}

interface FilterButtonProps {
  icon?: ReactNode;
  label: string;
  value: string;
  active: boolean;
  open: boolean;
  popover: ReactNode;
}

function FilterButton({
  icon,
  label,
  value,
  active,
  open,
  popover,
}: FilterButtonProps) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-11 items-center gap-2 rounded-[14px] border px-3.5 text-sm font-medium text-fg",
          open
            ? "border-lilac/38 bg-accent/26"
            : active
              ? "border-lilac/38 bg-accent/16"
              : "border-white/12 bg-well/35",
        )}
      >
        {icon}
        <span className="text-muted">{label}</span>
        <span className="font-mono font-semibold">{value}</span>
        <IconChevronDown
          className={cn("size-3.5 text-muted", open && "rotate-180")}
        />
      </button>
      {open && popover}
    </div>
  );
}
