import { cn } from '../../lib/cn';
import { Button, FieldLabel, Popover, TextInput, ToggleChip } from '../ui';

interface PeriodPopoverProps {
  from: string;
  to: string;
  presets: { label: string; active: boolean }[];
  hint: string;
  /** текст ошибки, например «Дата должна быть в формате ГГГГ-ММ-ДД» */
  error?: string;
}

/** §4.3: период, границы включительно */
export function PeriodPopover({ from, to, presets, hint, error }: PeriodPopoverProps) {
  const invalid = Boolean(error);

  return (
    <Popover aria-labelledby="pp-title" className="w-[384px] gap-4 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="pp-title" className="m-0 text-[15px] font-semibold">
          Период
        </h3>
        <span className="text-xs font-medium text-subtle">границы включительно</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <ToggleChip key={p.label} pressed={p.active} className="h-9 rounded-[10px] px-3 text-[13px] font-medium">
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
            defaultValue={from}
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
            defaultValue={to}
            invalid={invalid}
          />
        </div>
      </div>

      <p id="pp-hint" className={cn('m-0 text-[13px] font-medium', invalid ? 'text-danger' : 'text-muted')}>
        {error ?? hint}
      </p>

      <div className="flex justify-between gap-2.5">
        <Button variant="ghost" size="sm">
          Очистить
        </Button>
        <div className="flex gap-2.5">
          <Button size="sm">Отмена</Button>
          <Button size="sm" variant="primary" disabled={invalid}>
            Применить
          </Button>
        </div>
      </div>
    </Popover>
  );
}
