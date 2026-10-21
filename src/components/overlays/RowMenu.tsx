import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconCopy, IconPencil, IconTrash } from '../ui';

/** Меню строки таблицы. Родитель должен быть `relative`. */
export function RowMenu({ placement = 'down' }: { placement?: 'down' | 'up' }) {
  return (
    <div
      role="menu"
      aria-label="Действия с циклом"
      className={cn(
        'absolute right-0 z-10 box-border flex w-55 flex-col gap-0.5 rounded-[14px] border border-lilac/18 bg-popover p-1.5 shadow-pop',
        placement === 'up' ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]',
      )}
    >
      <MenuItem icon={<IconPencil className="size-4 text-soft" />}>Изменить</MenuItem>
      <MenuItem icon={<IconCopy className="size-4 text-soft" />}>Повторить сегодня</MenuItem>
      <div role="separator" className="mx-1.5 my-1 h-px bg-white/8" />
      <MenuItem danger icon={<IconTrash className="size-4 text-danger-strong" />}>
        Удалить
      </MenuItem>
    </div>
  );
}

function MenuItem({ icon, danger = false, children }: { icon: ReactNode; danger?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'flex h-10 items-center gap-2.5 rounded-[10px] px-2.5 text-left text-sm font-medium hover:bg-white/6',
        danger ? 'text-danger' : 'text-fg',
      )}
    >
      {icon}
      {children}
    </button>
  );
}
