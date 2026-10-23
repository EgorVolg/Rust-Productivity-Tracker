import type { HTMLAttributes, ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "../../lib/cn";
import { IconButton } from "./Button";
import { IconX } from "./icons";

interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
}

/** Панель, привязанная к кнопке. Родитель должен быть `relative`. */
export function Popover({ align = "left", className, ...rest }: PopoverProps) {
  return (
    <div
      role="dialog"
      className={cn(
        "panel absolute top-[calc(100%+10px)] z-10 box-border flex flex-col",
        align === "right" ? "right-0" : "left-0",
        className,
      )}
      {...rest}
    />
  );
}

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

/**
 * Модальное окно по центру экрана с затемнением.
 * Base UI блокирует скролл, держит фокус внутри и закрывает по Esc / клику на подложку.
 */
export function Modal({ open, onOpenChange, className, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-80 bg-[#080416]/60" />
        <Dialog.Popup
          className={cn(
            "fixed top-18 left-1/2 z-90 box-border flex max-h-[calc(100vh-104px)] max-w-[calc(100%-32px)] -translate-x-1/2 flex-col overflow-auto",
            "rounded-dialog border border-lilac/20 bg-dialog/90 p-7 shadow-pop backdrop-blur-[30px] backdrop-saturate-150",
            // трек скроллбара не заходит на скруглённые углы
            "[&::-webkit-scrollbar-track]:my-(--radius-dialog)",
            className,
          )}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Заголовок модалки; aria-labelledby и кнопку закрытия связывает Base UI. */
export function ModalHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <Dialog.Title className="m-0 font-display text-[22px] font-medium tracking-[-0.01em]">
          {title}
        </Dialog.Title>
        <Dialog.Description className="m-0 text-sm font-medium text-soft">
          {subtitle}
        </Dialog.Description>
      </div>
      <Dialog.Close render={<IconButton label="Закрыть" />}>
        <IconX className="size-4" />
      </Dialog.Close>
    </div>
  );
}
