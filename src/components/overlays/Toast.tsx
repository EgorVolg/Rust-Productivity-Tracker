import { Button, IconCheck, IconX } from '../ui';

export function Toast({ message, undo = false }: { message: string; undo?: boolean }) {
  return (
    <div
      role="status"
      className="fixed right-7 bottom-7 z-100 flex items-center gap-3 rounded-2xl border border-lilac/24 bg-dialog/94 py-3 pr-3 pl-3.5 shadow-[0_24px_50px_rgb(4_2_14/0.55)] backdrop-blur-xl"
    >
      <span className="flex size-7.5 items-center justify-center rounded-[10px] bg-accent/22 text-lilac">
        <IconCheck className="size-4" />
      </span>
      <span className="text-sm font-semibold">{message}</span>
      {undo && (
        <Button variant="soft" size="sm">
          Отменить
        </Button>
      )}
      <button
        type="button"
        aria-label="Закрыть уведомление"
        className="flex size-9 items-center justify-center rounded-[10px] text-muted"
      >
        <IconX className="size-3.5" />
      </button>
    </div>
  );
}
