import { Autocomplete } from "@base-ui/react/autocomplete";
import { cn } from "../../lib/cn";
import { CATEGORIES, type Category } from "../../lib/types";
import { CategoryDot } from "./Display";
import { IconCheck, IconChevronDown } from "./icons";

interface CategorySelectProps {
  value: Category;
  onValueChange: (value: Category) => void;
  id?: string;
  className?: string;
  invalid?: boolean;
  ariaDescribedBy?: string;
}

export function CategorySelect({
  value,
  onValueChange,
  invalid,
  ariaDescribedBy,
  id,
  className,
}: CategorySelectProps) {
  return (
    <Autocomplete.Root
      items={CATEGORIES}
      value={value}
      onValueChange={onValueChange}
      openOnInputClick
    >
      <Autocomplete.InputGroup
        className={cn(
          "group flex h-11 w-full items-center rounded-xl border bg-well/50 p-1.5",
          "focus-within:border-lilac/60 focus-within:ring-2 focus-within:ring-accent/30",
          "border-white/16",
          className,
        )}
      >
        <Autocomplete.Item
          className={cn(
            "flex h-10 cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 font-mono text-sm text-lilac outline-none select-none",
            "data-highlighted:bg-accent/16 data-selected:text-fg",
          )}
        >
          <CategoryDot category={value} />
        </Autocomplete.Item>
        <Autocomplete.Input
          id={id}
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby={ariaDescribedBy}
          className="h-full min-w-0 flex-1 bg-transparent font-sans text-sm text-fg outline-none"
        />

        <Autocomplete.Trigger
          aria-label="Показать темы"
          className="flex size-8 items-center justify-center rounded-lg text-muted outline-none hover:text-lilac focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          <IconChevronDown className="size-4 transition-transform group-has-data-popup-open:rotate-180" />
        </Autocomplete.Trigger>
      </Autocomplete.InputGroup>

      <Autocomplete.Portal>
        {/* z выше модалки (z-90) */}
        <Autocomplete.Positioner sideOffset={6} className="z-100">
          <Autocomplete.Popup
            className={cn(
              "panel box-border w-(--anchor-width) overflow-y-auto p-1.5 outline-none",
              // 4 пункта по h-10 + вертикальный padding
              "max-h-[calc(4*(--spacing(10))+(--spacing(3)))]",
              "[&::-webkit-scrollbar-track]:my-(--radius-panel)",
            )}
          >
            <Autocomplete.List>
              {CATEGORIES.map((c) => (
                <Autocomplete.Item
                  key={c}
                  value={c}
                  className={cn(
                    "flex h-10 cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 font-mono text-sm text-lilac outline-none select-none",
                    "data-highlighted:bg-accent/16 data-selected:text-fg",
                  )}
                >
                  <CategoryDot category={c} />
                  <span className="flex-1">{c}</span>
                  {value === c && <IconCheck className="size-4 text-accent" />}
                </Autocomplete.Item>
              ))}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
