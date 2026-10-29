import { useState } from 'react';
import { Button, IconButton, IconMinus, IconPlus, Popover, ToggleChip } from '../ui';

const PRESETS = [5, 10, 20];

interface TopWordsPopoverProps {
  value: number;
  onTopChange: (top: number) => void;
  onClose: () => void;
}

/** §4.4: сколько слов показать в частотном словаре */
export function TopWordsPopover({ value, onTopChange, onClose }: TopWordsPopoverProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleDecrement = () => {
    if (localValue > 1) {
      setLocalValue(localValue - 1);
    }
  };

  const handleIncrement = () => {
    if (localValue < 100) {
      setLocalValue(localValue + 1);
    }
  };

  const handlePresetClick = (preset: number) => {
    setLocalValue(preset);
  };

  const handleApply = () => {
    onTopChange(localValue);
    onClose();
  };

  const handleCancel = () => {
    setLocalValue(value);
    onClose();
  };

  return (
    <Popover aria-labelledby="tp-title" className="w-75 gap-4 p-5">
      <h3 id="tp-title" className="m-0 text-[15px] font-semibold">
        Сколько слов показать
      </h3>

      <div className="flex items-center gap-3">
        <IconButton label="Меньше" size="md" onClick={handleDecrement}>
          <IconMinus className="size-4.5" />
        </IconButton>
        <output aria-live="polite" className="flex-1 text-center font-display text-[30px] leading-none font-medium">
          {localValue}
        </output>
        <IconButton label="Больше" size="md" onClick={handleIncrement}>
          <IconPlus className="size-4.5" />
        </IconButton>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((v) => (
          <ToggleChip
            key={v}
            pressed={v === localValue}
            onClick={() => handlePresetClick(v)}
            className="h-9 rounded-[10px] font-mono text-[13px]"
          >
            {v}
          </ToggleChip>
        ))}
      </div>

      <div className="flex justify-end gap-2.5">
        <Button size="sm" onClick={handleCancel}>
          Отмена
        </Button>
        <Button size="sm" variant="primary" onClick={handleApply}>
          Применить
        </Button>
      </div>
    </Popover>
  );
}
