import { Select } from "@base-ui/react/select";
import { cn } from "../../lib/cn";
import { CATEGORIES, type Category } from "../../lib/types";
import { CategoryDot } from "./Display";
import { IconCheck, IconChevronDown } from "./icons";

interface CategorySelectProps {
  value: Category;
  onValueChange: (value: Category) => void;
  id?: string;
  className?: string;
}

/** Выпадающий список категорий; без прокрутки видно 4 пункта. */
export function CategorySelect({
  value,
  onValueChange,
  id,
  className,
}: CategorySelectProps) {
  return (
    <Select.Root
      id={id}
      value={value}
      onValueChange={(next) => next && onValueChange(next)}
    >
      <Select.Trigger
        className={cn(
          "group flex h-11 w-full items-center gap-2.5 rounded-xl border border-white/16 bg-well/50 px-3 font-mono text-sm text-fg outline-none",
          "focus-visible:border-lilac/60 focus-visible:ring-2 focus-visible:ring-accent/30 data-popup-open:border-lilac/40",
          className,
        )}
      >
        <Select.Value className="flex-1">
          {(v: Category) => (
            <span className="flex items-center gap-2.5">
              <CategoryDot category={v} />
              {v}
            </span>
          )}
        </Select.Value>
        <Select.Icon className="text-muted transition-transform group-data-popup-open:rotate-180">
          <IconChevronDown className="size-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        {/* z выше модалки (z-90) */}
        <Select.Positioner
          alignItemWithTrigger={false}
          sideOffset={6}
          className="z-100"
        >
          <Select.Popup
            className={cn(
              "panel box-border w-(--anchor-width) overflow-y-auto p-1.5 outline-none",
              // 4 пункта по h-10 + вертикальный padding
              "max-h-[calc(4*(--spacing(10))+(--spacing(3)))]",
              "[&::-webkit-scrollbar-track]:my-(--radius-panel)",
            )}
          >
            <Select.List>
              {CATEGORIES.map((c) => (
                <Select.Item
                  key={c}
                  value={c}
                  className={cn(
                    "flex h-10 cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 font-mono text-sm text-lilac outline-none select-none",
                    "data-highlighted:bg-accent/16 data-selected:text-fg",
                  )}
                >
                  <CategoryDot category={c} />
                  <Select.ItemText className="flex-1">{c}</Select.ItemText>
                  <Select.ItemIndicator>
                    <IconCheck className="size-4 text-accent" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
