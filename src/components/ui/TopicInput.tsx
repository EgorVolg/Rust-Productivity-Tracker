import { Autocomplete } from "@base-ui/react/autocomplete";
import { cn } from "../../lib/cn";
import { IconChevronDown } from "./icons";

interface TopicInputProps {
  value: string;
  onValueChange: (value: string) => void;
  /** варианты в выпадающем списке; ввести можно и свою тему */
  suggestions: string[];
  id?: string;
  invalid?: boolean;
  "aria-describedby"?: string;
  className?: string;
}

/** Поле темы с выпадающими подсказками; без прокрутки видно 4 пункта. */
export function TopicInput({
  value,
  onValueChange,
  suggestions,
  id,
  invalid = false,
  "aria-describedby": describedBy,
  className,
}: TopicInputProps) {
  return (
    <Autocomplete.Root
      items={suggestions}
      value={value}
      onValueChange={onValueChange}
      openOnInputClick
    >
      <Autocomplete.InputGroup
        className={cn(
          "group flex h-11 w-full items-center rounded-xl border bg-well/50 pr-1.5",
          "focus-within:border-lilac/60 focus-within:ring-2 focus-within:ring-accent/30",
          invalid ? "border-danger-strong/70" : "border-white/16",
          className,
        )}
      >
        <Autocomplete.Input
          id={id}
          autoComplete="off"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="h-full min-w-0 flex-1 bg-transparent px-3 font-sans text-sm text-fg outline-none"
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
          <Autocomplete.Popup className="panel box-border w-(--anchor-width) outline-none">
            <Autocomplete.Empty className="px-4 py-3 text-[13px] font-medium text-subtle empty:hidden">
              Новая тема
            </Autocomplete.Empty>
            <Autocomplete.List
              className={cn(
                "overflow-y-auto overscroll-contain p-1.5 outline-none data-empty:p-0",
                // 4 пункта по h-10 + вертикальный padding
                "max-h-[calc(4*(--spacing(10))+(--spacing(3)))]",
                "[&::-webkit-scrollbar-track]:my-(--radius-panel)",
              )}
            >
              {(topic: string) => (
                <Autocomplete.Item
                  key={topic}
                  value={topic}
                  title={topic}
                  className="flex h-10 cursor-pointer items-center truncate rounded-[10px] px-2.5 text-sm font-medium text-lilac outline-none select-none data-highlighted:bg-accent/16"
                >
                  {topic}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
