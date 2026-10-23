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
import { api, CycleInput } from "@/lib";

const MINUTE_PRESETS = [15, 25, 50, 90];
const ENERGY = [1, 2, 3, 4, 5];
const morning = (h: number) => h >= 6 && h < 12;
const day = (h: number) => h >= 12 && h < 18;
const evening = (h: number) => h >= 18 && h < 24;

interface AddCycleDialogProps {
  /** недавние темы выбранной категории */
  suggestions: string[];
  /** данные для формы — префилл задаёт useCycleManager */
  formData: CycleInput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** вызывается после успешной записи, чтобы перечитать журнал */
  onAdded: () => void;
  /** новая или редактируемая запись */
  addOrEdit: "add" | "edit";
  /** ID редактируемого цикла */
  editingCycleId: string | null;
}

function toDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function today() {
  return toDateInputValue(new Date());
}

function formatWeekday(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", { weekday: "long" });
}

export function AddCycleDialog({
  suggestions,
  open,
  onOpenChange,
  onAdded,
  addOrEdit,
  formData,
  editingCycleId,
}: AddCycleDialogProps) {
  /** ошибки от Rust: поле → сообщение */
  const [errors, setErrors] = useState<Record<string, string>>({});
  /** ошибка не по полю (например, Tauri не разобрал запрос) */
  const [formError, setFormError] = useState<string | null>(null);

  // Lazy init — диалог монтируется заново на каждое открытие (key={version} в App),
  // поэтому стартовые значения берутся из актуального formData: дата, час, энергия
  // в режиме edit — из цикла, в режиме add — из «последнего цикла + сейчас».
  const [formState, setFormState] = useState<CycleDraft>(() => ({
    date: formData.date,
    hour: formData.hour,
    category: formData.category,
    topic: formData.topic,
    minutes: formData.minutes.toString(),
    energy: formData.energy,
    mode: addOrEdit,
    weekdayLabel: formatWeekday(formData.date),
  }));

  function setField<K extends keyof CycleDraft>(key: K, value: CycleDraft[K]) {
    setFormState((s) => {
      const next: CycleDraft = { ...s, [key]: value };
      if (key === "date") {
        next.weekdayLabel = formatWeekday(String(value));
      }
      return next;
    });
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError(null);
  }

  function handleCancel() {
    setErrors({});
    setFormError(null);
    onOpenChange(false);
  }

  async function handleSubmit() {
    const { date, hour, category, topic, minutes, energy } = formState;
    setErrors({});
    setFormError(null);

    const payload: CycleInput = {
      date,
      hour,
      category,
      topic,
      minutes: Number(minutes),
      energy,
    };

    try {
      if (addOrEdit === "edit" && editingCycleId) {
        await api.editCycle(editingCycleId, payload);
      } else {
        await api.addCycle(payload);
      }
      // журнал перечитываем после записи: иначе счётчик циклов в UI устареет
      onAdded();
    } catch (e) {
      console.error("[AddCycleDialog] ошибка сохранения:", e);
      // Err(HashMap) из Rust приходит объектом, прочие ошибки Tauri — строкой
      if (e && typeof e === "object") {
        const { _form, ...fieldErrors } = e as Record<string, string>;
        setErrors(fieldErrors);
        if (_form) setFormError(_form);
      } else {
        setFormError(String(e));
      }
    }
  }

  function yesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return toDateInputValue(d);
  }

  // подсветка — блок текущего времени суток, а не выбранного часа
  const nowHour = new Date().getHours();
  const blockLabel = morning(nowHour)
    ? "утреннего"
    : day(nowHour)
      ? "дневного"
      : evening(nowHour)
        ? "вечернего"
        : "ночного";
  const blockHourStart = Math.floor(nowHour / 6) * 6;
  const blockHourEnd = blockHourStart + 5;

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : handleCancel())}
      className="w-205 gap-5.5"
    >
      <ModalHeader
        title={addOrEdit === "edit" ? "Изменить цикл" : "Новый цикл"}
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
                onChange={(e) => setField("date", e.target.value)}
                invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "ad-date-err" : undefined}
                className="flex-1"
              />
              <Button
                size="sm"
                className="h-11 font-medium"
                onClick={() => setField("date", today())}
              >
                Сегодня
              </Button>
              <Button
                size="sm"
                className="h-11 font-medium"
                onClick={() => setField("date", yesterday())}
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
              aria-describedby={errors.hour ? "ad-hour-err" : undefined}
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
                    onClick={() => setField("hour", h)}
                  >
                    {pad2(h)}
                  </button>
                );
              })}
            </div>
            {errors.hour && (
              <FieldError id="ad-hour-err">{errors.hour}</FieldError>
            )}
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
              onValueChange={(category) => setField("category", category)}
            />
            {errors.category && (
              <FieldError id="ad-cat-err">{errors.category}</FieldError>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="ad-topic">Тема</FieldLabel>
            <TopicInput
              id="ad-topic"
              value={formState.topic}
              onValueChange={(topic) => setField("topic", topic)}
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
                    onClick={() => setField("topic", t)}
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
                onChange={(e) => setField("minutes", e.target.value)}
                invalid={Boolean(errors.minutes)}
                aria-describedby={errors.minutes ? "ad-min-err" : undefined}
                className="w-21"
              />
              {MINUTE_PRESETS.map((v) => (
                <ToggleChip
                  key={v}
                  pressed={String(v) === formState.minutes}
                  className="h-11 rounded-xl px-2.5 font-mono text-[13px]"
                  onClick={() => setField("minutes", String(v))}
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
              aria-describedby={errors.energy ? "ad-en-err" : undefined}
              className="grid grid-cols-5 gap-2"
            >
              {ENERGY.map((v) => (
                <ToggleChip
                  key={v}
                  pressed={v === formState.energy}
                  className="h-11 rounded-xl font-display text-[15px]"
                  onClick={() => setField("energy", v)}
                >
                  {v}
                </ToggleChip>
              ))}
            </div>
            {errors.energy && (
              <FieldError id="ad-en-err">{errors.energy}</FieldError>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {formError ? (
          <span role="alert" className="text-[13px] font-medium text-danger">
            {formError}
          </span>
        ) : (
          <span className="text-[13px] font-medium text-warn">
            {formState.note}
          </span>
        )}
        <div className="flex gap-2.5">
          <Button onClick={handleCancel}>Отмена</Button>
          <Button variant="primary" onClick={handleSubmit}>
            <IconCheck className="size-4" />
            {addOrEdit === "edit" ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
