import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from './Button';
import { IconX } from './icons';

interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right';
}

/** Панель, привязанная к кнопке. Родитель должен быть `relative`. */
export function Popover({ align = 'left', className, ...rest }: PopoverProps) {
  return (
    <div
      role="dialog"
      className={cn(
        'panel absolute top-[calc(100%+10px)] z-10 box-border flex flex-col',
        align === 'right' ? 'right-0' : 'left-0',
        className,
      )}
      {...rest}
    />
  );
}

interface ModalProps {
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/** Модальное окно по центру экрана с затемнением. */
export function Modal({ labelledBy, className, children }: ModalProps) {
  return (
    <>
      {/* При подключении логики подложку можно сделать кнопкой закрытия */}
      <div aria-hidden="true" className="fixed inset-0 z-80 bg-[#080416]/60" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          'fixed top-18 left-1/2 z-90 box-border flex max-h-[calc(100vh-104px)] max-w-[calc(100%-32px)] -translate-x-1/2 flex-col overflow-auto',
          'rounded-dialog border border-lilac/20 bg-dialog/90 p-7 shadow-pop backdrop-blur-[30px] backdrop-saturate-150',
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}

export function ModalHeader({ id, title, subtitle }: { id: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h2 id={id} className="m-0 font-display text-[22px] font-medium tracking-[-0.01em]">
          {title}
        </h2>
        <p className="m-0 text-sm font-medium text-soft">{subtitle}</p>
      </div>
      <IconButton label="Закрыть">
        <IconX className="size-4" />
      </IconButton>
    </div>
  );
}
