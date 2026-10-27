import { cn } from "../../lib/cn";
import type { Filters } from "../../lib/types";
import { CategoryDot, IconCheck, Popover } from "../ui";

type CategoryFilter = Filters["category"];

const OPTIONS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "Все категории" },
  { key: "rust", label: "rust" },
  { key: "english", label: "english" },
];

interface CategoryPopoverProps {
  selected: CategoryFilter;
  counts: Record<CategoryFilter, number>;
  color: string;
  onColorChange: (color: string) => void;
}

export function CategoryPopover({
  selected,
  counts,
  color,
  onColorChange,
}: CategoryPopoverProps) {
  return (
    <Popover aria-labelledby="cat-title" className="w-72.5 gap-2.5 p-3.5">
      <h3
        id="cat-title"
        className="m-0 px-1.5 pt-1 pb-0.5 text-[13px] font-semibold text-muted"
      >
        Показывать категорию
      </h3>

      <div className="flex flex-col gap-1">
        {OPTIONS.map((o) => {
          const isSelected = o.key === selected;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={isSelected}
              className={cn(
                "flex h-11 w-full items-center gap-3 rounded-xl border px-3 text-left text-sm font-medium text-fg",
                isSelected
                  ? "border-lilac/30 bg-accent/18"
                  : "border-transparent bg-transparent hover:bg-white/5",
              )}
            >
              {o.key === "all" ? (
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-[3px] "
                />
              ) : (
                <CategoryDot color={color} />
              )}
              <span className={cn("flex-1", o.key !== "all" && "font-mono")}>
                {o.label}
              </span>
              <span className="font-mono text-xs text-muted">
                {counts[o.key]}
              </span>
              <span className="flex size-4 items-center justify-center">
                {isSelected && <IconCheck className="size-4 text-lilac" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-1.5 pt-2">
        <p className="m-0 text-xs font-medium text-subtle">
          Справа — число циклов с учётом периода
        </p>
      </div>
    </Popover>
  );
}
