import { useState, useEffect } from "react";
import { cn } from "../../lib/cn";
import { Button, FieldLabel, Popover, TextInput, ToggleChip } from "../ui";

interface PeriodPopoverProps {
  from: string;
  to: string;
  presets: { label: string; active: boolean }[];
  hint: string;
  /** текст ошибки, например «Дата должна быть в формате ГГГГ-ММ-ДД» */
  error?: string;
  onPeriodChange: (from: string, to: string) => void;
  onClose: () => void;
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Проверяет формат и реальное существование даты (2026-02-31 → false) */
function isValidDate(date: string): boolean {
  if (!DATE_REGEX.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return (
    parsed.getUTCFullYear() === y &&
    parsed.getUTCMonth() === m - 1 &&
    parsed.getUTCDate() === d
  );
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function lastNDays(n: number): [string, string] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (n - 1));
  return [formatDate(start), formatDate(today)];
}

/** §4.3: период, границы включительно */
export function PeriodPopover({
  from,
  to,
  presets,
  hint,
  error,
  onPeriodChange,
  onClose,
}: PeriodPopoverProps) {
  const [localFrom, setLocalFrom] = useState(from);
  const [localTo, setLocalTo] = useState(to);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  // Синхронизируем локальное состояние с пропами
  useEffect(() => {
    setLocalFrom(from);
    setLocalTo(to);
    setLocalError(undefined);
  }, [from, to]);

  const shownError = localError ?? error;
  const invalid = Boolean(shownError);

  const changeFrom = (value: string) => {
    setLocalFrom(value);
    setLocalError(undefined);
  };

  const changeTo = (value: string) => {
    setLocalTo(value);
    setLocalError(undefined);
  };

  const handleApply = () => {
    if (localFrom && !isValidDate(localFrom)) {
      setLocalError("Некорректная дата «с»");
      return;
    }
    if (localTo && !isValidDate(localTo)) {
      setLocalError("Некорректная дата «по»");
      return;
    }
    if (localFrom && localTo && localFrom > localTo) {
      setLocalError("Дата «с» не может быть позже даты «по»");
      return;
    }
    setLocalError(undefined);
    onPeriodChange(localFrom, localTo);
    onClose();
  };

  const handleClear = () => {
    setLocalFrom("");
    setLocalTo("");
    setLocalError(undefined);
  };

  const handleCancel = () => {
    setLocalFrom(from);
    setLocalTo(to);
    setLocalError(undefined);
    onClose();
  };

  const handlePresetClick = (label: string) => {
    let range: [string, string] | null = null;

    switch (label) {
      case "7 дней":
        range = lastNDays(7);
        break;
      case "14 дней":
        range = lastNDays(14);
        break;
      case "Октябрь":
        range = ["2026-10-01", "2026-10-31"];
        break;
      case "Всё время":
        range = ["", ""];
        break;
    }

    if (!range) return;
    setLocalFrom(range[0]);
    setLocalTo(range[1]);
    setLocalError(undefined);
  };

  return (
    <Popover aria-labelledby="pp-title" className="w-[384px] gap-4 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="pp-title" className="m-0 text-[15px] font-semibold">
          Период
        </h3>
        <span className="text-xs font-medium text-subtle">
          границы включительно
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <ToggleChip
            key={p.label}
            pressed={p.active}
            onClick={() => handlePresetClick(p.label)}
            className="h-9 rounded-[10px] px-3 text-[13px] font-medium"
          >
            {p.label}
          </ToggleChip>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="pp-from">С даты</FieldLabel>
          <TextInput
            id="pp-from"
            inputMode="numeric"
            autoComplete="off"
            aria-describedby="pp-hint"
            value={localFrom}
            onChange={(e) => changeFrom(e.target.value)}
            invalid={invalid}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="pp-to">По дату</FieldLabel>
          <TextInput
            id="pp-to"
            inputMode="numeric"
            autoComplete="off"
            aria-describedby="pp-hint"
            value={localTo}
            onChange={(e) => changeTo(e.target.value)}
            invalid={invalid}
          />
        </div>
      </div>

      <p
        id="pp-hint"
        role={invalid ? "alert" : undefined}
        className={cn(
          "m-0 text-[13px] font-medium",
          invalid ? "text-danger" : "text-muted",
        )}
      >
        {shownError ?? hint}
      </p>

      <div className="flex justify-between gap-2.5">
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Очистить
        </Button>
        <div className="flex gap-2.5">
          <Button size="sm" onClick={handleCancel}>
            Отмена
          </Button>
          <Button size="sm" variant="primary" onClick={handleApply}>
            Применить
          </Button>
        </div>
      </div>
    </Popover>
  );
}
