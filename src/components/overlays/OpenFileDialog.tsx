import { Button, IconFile, IconUpload, Modal, ModalHeader } from '../ui';

const FORMAT_EXAMPLE = 'дата,день,час,категория,тема,минуты,энергия\n2026-10-20,2,6,rust,ToDo на Tauri: команды,90,5';

interface OpenFileDialogProps {
  pickedName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpenFileDialog({ pickedName, open, onOpenChange }: OpenFileDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="w-145 gap-5">
      <ModalHeader
        title="Открыть журнал"
        subtitle="CSV-файл в UTF-8, одна строка — один цикл. Файл читается локально."
      />

      <div className="relative flex flex-col items-center gap-3 rounded-[20px] border-[1.5px] border-dashed border-lilac/35 bg-well/35 px-6 py-8 text-center">
        <div className="flex size-13 items-center justify-center rounded-2xl bg-accent/16 text-lilac">
          <IconUpload className="size-6" />
        </div>
        <span className="text-[15px] font-semibold">Перетащите файл сюда</span>
        <span className="text-[13px] font-medium text-muted">или</span>
        <label
          htmlFor="od-file"
          className="inline-flex h-10.5 cursor-pointer items-center rounded-xl border border-white/18 bg-white/8 px-4.5 text-sm font-semibold"
        >
          Выбрать файл…
        </label>
        <input id="od-file" type="file" accept=".csv,text/csv" className="sr-only" />
      </div>

      {pickedName && (
        <div className="flex items-center gap-3 rounded-[14px] border border-lilac/24 bg-accent/12 px-3.5 py-3">
          <IconFile className="size-4.5 text-lilac" />
          <span className="flex-1 font-mono text-sm">{pickedName}</span>
          <span className="text-xs font-medium text-soft">готов к открытию</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-muted">Формат строки — 7 полей через запятую</span>
        <code className="block rounded-xl border border-white/8 bg-well/50 px-3.5 py-3 font-mono text-[13px] leading-[1.6] whitespace-pre-line text-lilac">
          {FORMAT_EXAMPLE}
        </code>
      </div>

      <div className="flex justify-end gap-2.5">
        <Button>Отмена</Button>
        <Button variant="primary" disabled={!pickedName}>
          Открыть
        </Button>
      </div>
    </Modal>
  );
}
