import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { IconCopy, IconPencil, IconTrash } from "../ui";
import type { Cycle } from "../../lib/types";

export function RowMenu({
  id,
  cycle,
  placement = "down",
  onClose,
  setAddOrEdit,
  setOpenAddCycle,
  onDeleteCycle,
  onCopyCycle,
  onEditCycle,
}: {
  id: string;
  cycle: Cycle;
  placement?: "down" | "up";
  onClose: () => void;
  setAddOrEdit: (cycle: Cycle) => void;
  setOpenAddCycle: (value: boolean) => void;
  onDeleteCycle: (id: string) => void;
  onCopyCycle: (id: string) => void;
  onEditCycle: (cycle: Cycle) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Действия с циклом"
      className={cn(
        "absolute right-0 z-10 box-border flex w-55 flex-col gap-0.5 rounded-[14px] border border-lilac/18 bg-popover p-1.5 shadow-pop",
        placement === "up" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
      )}
    >
      <MenuItem
        icon={<IconPencil className="size-4 text-soft" />}
        onClick={() => {
          setAddOrEdit(cycle);
          onEditCycle(cycle);
          setOpenAddCycle(true);
        }}
      >
        Изменить
      </MenuItem>
      <MenuItem
        onClick={() => onCopyCycle(id)}
        icon={<IconCopy className="size-4 text-soft" />}
      >
        Повторить сегодня
      </MenuItem>
      <div role="separator" className="mx-1.5 my-1 h-px bg-white/8" />
      <MenuItem
        danger
        icon={<IconTrash className="size-4 text-danger-strong" />}
        onClick={() => onDeleteCycle(id)}
      >
        Удалить
      </MenuItem>
    </div>
  );
}

function MenuItem({
  icon,
  danger = false,
  children,
  onClick,
}: {
  icon: ReactNode;
  danger?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "flex h-10 items-center gap-2.5 rounded-[10px] px-2.5 text-left text-sm font-medium hover:bg-white/6",
        danger ? "text-danger" : "text-fg",
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
