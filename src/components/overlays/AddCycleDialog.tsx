import { useState } from "react";
import { cn } from "../../lib/cn";
import { HOURS, pad2, truncate } from "../../lib/format";
import type { CycleDraft } from "../../lib/view";
import {
  Button,
  CategorySelect,
  FieldError,
  FieldHint,
  FieldLabel,
  IconCheck,
  Modal,
  ModalHeader,
  TextInput,
  ToggleChip,
  TopicInput,
} from "../ui";
import { api } from "@/lib";

const MINUTE_PRESETS = [15, 25, 50, 90];
const ENERGY = [1, 2, 3, 4, 5];
const morning = (h: number) => h >= 6 && h < 12;
const day = (h: number) => h >= 12 && h < 18;
const evening = (h: number) => h >= 18 && h < 24;

interface AddCycleDialogProps {
  draft: CycleDraft;
  /** недавние темы выбранной категории */
  suggestions: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCycleDialog({
  draft,
  suggestions,
  open,
  onOpenChange,
}: AddCycleDialogProps) {
  const isEdit = draft.mode === "edit";
  const errors = draft.errors ?? {};
  const handleCancel = () => {
    setFormState(draft);
    onOpenChange(false);
  };

  async function handleSubmit() {
    await api.addCycle(formState);
    onOpenChange(false);
  }

  const [formState, setFormState] = useState<CycleDraft>(draft);
  // подсветка — блок текущего времени суток, а не выбранного часа
  const nowHour = new Date().getHours();
  const blockLabel = morning(nowHour)
    ? "утреннего"
    : day(nowHour)
      ? "дневного"
      : evening(nowHour)
        ? "вечернего"
        : "ночного";
  // блоки по 6 часов: 00–05, 06–11, 12–17, 18–23
  const blockHourStart = Math.floor(nowHour / 6) * 6;
  const blockHourEnd = blockHourStart + 5;

  function today() {
    const d = new Date();
    const year = d.getFullYear();
    const month = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    return `${year}-${month}-${day}`;
  }

  function yesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    return `${year}-${month}-${day}`;
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="w-205 gap-5.5">
      <ModalHeader
        title={isEdit ? "Изменить цикл" : "Новый цикл"}
        subtitle={
          isEdit
            ? "Строка в journal.csv будет перезаписана"
            : "Запишется новой строкой в конец journal.csv"
        }
      />

      <div className="grid grid-cols-2 gap-7">
        {/* Левая колонка: когда */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="ad-date">Дата</FieldLabel>
              <span className="text-xs font-medium text-muted">
                {formState.weekdayLabel}
              </span>
            </div>
            <div className="flex gap-2">
              <TextInput
                id="ad-date"
                inputMode="numeric"
                autoComplete="off"
                value={formState.date}
                onChange={(e) =>
                  setFormState({ ...formState, date: e.target.value })
                }
                invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "ad-date-err" : undefined}
                className="flex-1"
              />
              <Button
                size="sm"
                className="h-11 font-medium"
                onClick={() => setFormState({ ...formState, date: today() })}
              >
                Сегодня
              </Button>
              <Button
                size="sm"
                className="h-11 font-medium"
                onClick={() =>
                  setFormState({ ...formState, date: yesterday() })
                }
              >
                Вчера
              </Button>
            </div>
            {errors.date && (
              <FieldError id="ad-date-err">{errors.date}</FieldError>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel id="ad-hour-l">Час начала</FieldLabel>
              <span className="font-mono text-xs text-muted">
                начало в {pad2(formState.hour)}:00
              </span>
            </div>
            <div
              role="group"
              aria-labelledby="ad-hour-l"
              className="grid grid-cols-6 gap-1.5"
            >
              {HOURS.map((h) => {
                const selected = h === formState.hour;
                const inBlock = h >= blockHourStart && h <= blockHourEnd;
                return (
                  <button
                    key={h}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      "h-9 rounded-[10px] border font-mono text-[13px]",
                      selected
                        ? "border-white/35 bg-primary text-white"
                        : inBlock
                          ? "border-white/10 bg-accent/12 text-lilac"
                          : "border-white/10 bg-white/4 text-lilac",
                    )}
                    onClick={() => setFormState((s) => ({ ...s, hour: h }))}
                  >
                    {pad2(h)}
                  </button>
                );
              })}
            </div>
            <FieldHint>
              Подсвечены часы {blockLabel} блока, {pad2(blockHourStart)}–
              {pad2(blockHourEnd)}
            </FieldHint>
          </div>
        </div>

        {/* Правая колонка: что и как */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="ad-cat">Категория</FieldLabel>
            <CategorySelect
              id="ad-cat"
              value={formState.category}
              onValueChange={(category) =>
                setFormState((s) => ({ ...s, category }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="ad-topic">Тема</FieldLabel>
            <TopicInput
              id="ad-topic"
              value={formState.topic}
              onValueChange={(topic) => setFormState((s) => ({ ...s, topic }))}
              suggestions={suggestions}
              invalid={Boolean(errors.topic)}
              aria-describedby={errors.topic ? "ad-topic-err" : undefined}
            />
            {errors.topic && (
              <FieldError id="ad-topic-err">{errors.topic}</FieldError>
            )}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <FieldHint>Недавние:</FieldHint>
                {suggestions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    title={t}
                    onClick={() => setFormState((s) => ({ ...s, topic: t }))}
                    className="h-7.5 rounded-[9px] border border-white/12 bg-white/5 px-2.5 text-xs font-medium text-lilac"
                  >
                    {truncate(t)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="ad-min">Минуты</FieldLabel>
            <div className="flex flex-wrap gap-2">
              <TextInput
                id="ad-min"
                inputMode="numeric"
                autoComplete="off"
                value={formState.minutes}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, minutes: e.target.value }))
                }
                invalid={Boolean(errors.minutes)}
                aria-describedby={errors.minutes ? "ad-min-err" : undefined}
                className="w-21"
              />
              {MINUTE_PRESETS.map((v) => (
                <ToggleChip
                  key={v}
                  pressed={String(v) === formState.minutes}
                  className="h-11 rounded-xl px-2.5 font-mono text-[13px]"
                  onClick={() =>
                    setFormState((s) => ({ ...s, minutes: String(v) }))
                  }
                >
                  {v} мин
                </ToggleChip>
              ))}
            </div>
            {errors.minutes && (
              <FieldError id="ad-min-err">{errors.minutes}</FieldError>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel id="ad-en-l">Энергия</FieldLabel>
              <FieldHint>1 — без сил · 5 — в потоке</FieldHint>
            </div>
            <div
              role="group"
              aria-labelledby="ad-en-l"
              className="grid grid-cols-5 gap-2"
            >
              {ENERGY.map((v) => (
                <ToggleChip
                  key={v}
                  pressed={v === formState.energy}
                  className="h-11 rounded-xl font-display text-[15px]"
                  onClick={() => setFormState((s) => ({ ...s, energy: v }))}
                >
                  {v}
                </ToggleChip>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted">Строка в файле</span>
        <code className="block overflow-hidden rounded-xl border border-white/8 bg-well/50 px-3.5 py-3 font-mono text-[13px] text-ellipsis whitespace-nowrap text-lilac">
          {formState.csvLine}
        </code>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-[13px] font-medium text-warn">
          {formState.note}
        </span>
        <div className="flex gap-2.5">
          <Button onClick={handleCancel} >Отмена</Button>
          <Button variant="primary" onClick={handleSubmit}>
            <IconCheck className="size-4" />
            {isEdit ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
