import { cn } from '../../lib/cn';
import { HOURS, pad2, truncate } from '../../lib/format';
import { CATEGORIES } from '../../lib/types';
import type { CycleDraft } from '../../lib/view';
import { Button, CategoryDot, FieldError, FieldHint, FieldLabel, IconCheck, Modal, ModalHeader, TextInput, ToggleChip } from '../ui';

const MINUTE_PRESETS = [15, 25, 50, 90];
const ENERGY = [1, 2, 3, 4, 5];

interface AddCycleDialogProps {
  draft: CycleDraft;
  /** недавние темы выбранной категории */
  suggestions: string[];
}

export function AddCycleDialog({ draft, suggestions }: AddCycleDialogProps) {
  const isEdit = draft.mode === 'edit';
  const errors = draft.errors ?? {};

  return (
    <Modal labelledBy="ad-title" className="w-205 gap-5.5">
      <ModalHeader
        id="ad-title"
        title={isEdit ? 'Изменить цикл' : 'Новый цикл'}
        subtitle={isEdit ? 'Строка в journal.csv будет перезаписана' : 'Запишется новой строкой в конец journal.csv'}
      />

      <div className="grid grid-cols-2 gap-7">
        {/* Левая колонка: когда */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="ad-date">Дата</FieldLabel>
              <span className="text-xs font-medium text-muted">{draft.weekdayLabel}</span>
            </div>
            <div className="flex gap-2">
              <TextInput
                id="ad-date"
                inputMode="numeric"
                autoComplete="off"
                defaultValue={draft.date}
                invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? 'ad-date-err' : undefined}
                className="flex-1"
              />
              <Button size="sm" className="h-11 font-medium">
                Сегодня
              </Button>
              <Button size="sm" className="h-11 font-medium">
                Вчера
              </Button>
            </div>
            {errors.date && <FieldError id="ad-date-err">{errors.date}</FieldError>}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel id="ad-hour-l">Час начала</FieldLabel>
              <span className="font-mono text-xs text-muted">начало в {pad2(draft.hour)}:00</span>
            </div>
            <div role="group" aria-labelledby="ad-hour-l" className="grid grid-cols-6 gap-1.5">
              {HOURS.map((h) => {
                const selected = h === draft.hour;
                const morning = h >= 6 && h < 12;
                return (
                  <button
                    key={h}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      'h-9 rounded-[10px] border font-mono text-[13px]',
                      selected
                        ? 'border-white/35 bg-primary text-white'
                        : morning
                          ? 'border-white/10 bg-accent/12 text-lilac'
                          : 'border-white/10 bg-white/4 text-lilac',
                    )}
                  >
                    {pad2(h)}
                  </button>
                );
              })}
            </div>
            <FieldHint>Подсвечены часы утреннего блока, 06–12</FieldHint>
          </div>
        </div>

        {/* Правая колонка: что и как */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <FieldLabel id="ad-cat-l">Категория</FieldLabel>
            <div role="group" aria-labelledby="ad-cat-l" className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <ToggleChip key={c} pressed={c === draft.category} className="h-11 rounded-xl font-mono text-sm">
                  <CategoryDot category={c} />
                  {c}
                </ToggleChip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="ad-topic">Тема</FieldLabel>
            <TextInput
              id="ad-topic"
              mono={false}
              autoComplete="off"
              defaultValue={draft.topic}
              invalid={Boolean(errors.topic)}
              aria-describedby={errors.topic ? 'ad-topic-err' : undefined}
            />
            {errors.topic && <FieldError id="ad-topic-err">{errors.topic}</FieldError>}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <FieldHint>Недавние:</FieldHint>
                {suggestions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    title={t}
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
                defaultValue={draft.minutes}
                invalid={Boolean(errors.minutes)}
                aria-describedby={errors.minutes ? 'ad-min-err' : undefined}
                className="w-21"
              />
              {MINUTE_PRESETS.map((v) => (
                <ToggleChip
                  key={v}
                  pressed={String(v) === draft.minutes}
                  className="h-11 rounded-xl px-2.5 font-mono text-[13px]"
                >
                  {v} мин
                </ToggleChip>
              ))}
            </div>
            {errors.minutes && <FieldError id="ad-min-err">{errors.minutes}</FieldError>}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel id="ad-en-l">Энергия</FieldLabel>
              <FieldHint>1 — без сил · 5 — в потоке</FieldHint>
            </div>
            <div role="group" aria-labelledby="ad-en-l" className="grid grid-cols-5 gap-2">
              {ENERGY.map((v) => (
                <ToggleChip key={v} pressed={v === draft.energy} className="h-11 rounded-xl font-display text-[15px]">
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
          {draft.csvLine}
        </code>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-[13px] font-medium text-warn">{draft.note}</span>
        <div className="flex gap-2.5">
          <Button>Отмена</Button>
          <Button variant="primary">
            <IconCheck className="size-4" />
            {isEdit ? 'Сохранить' : 'Добавить'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
