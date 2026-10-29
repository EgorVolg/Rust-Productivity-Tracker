import { useState } from "react";
import { cn } from "../../lib/cn";
import { plural } from "../../lib/format";
import type { ParseError } from "../../lib/types";
import { Button, IconAlert, IconPlus, Logo } from "../ui";
import { ErrorsPopover } from "../overlays";

export function TopBar({
  setOpenAddCycle,
  errors,
}: {
  setOpenAddCycle: (open: boolean) => void;
  errors: ParseError[];
}) {
  const [errorsOpen, setErrorsOpen] = useState(false);
  return (
    <header className="glass relative z-60 flex items-center justify-between gap-4 rounded-[20px] py-3 pr-3.5 pl-5">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="font-display text-[17px] font-semibold tracking-[-0.01em]">
          MyActivity
        </span>
        {/* <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.25 font-mono text-xs text-muted">
          локально · без сети
        </span> */}
      </div>

      <div className="flex items-center gap-2.5">
        {errors.length > 0 && (
          <div className="relative">
            <Button
              variant="danger"
              aria-haspopup="dialog"
              aria-expanded={errorsOpen}
              className={cn('px-3.5', errorsOpen && 'bg-danger-strong/24')}
              onClick={() => setErrorsOpen(!errorsOpen)}
            >
              <IconAlert className="size-4" />
              {errors.length} {plural(errors.length, 'ошибка', 'ошибки', 'ошибок')}
            </Button>
            {errorsOpen && <ErrorsPopover errors={errors} onClose={() => setErrorsOpen(false)} />}
          </div>
        )}

        <Button
          variant="primary"
          aria-haspopup="dialog"
          className="pl-3.5"
          onClick={() => setOpenAddCycle(true)}
        >
          <IconPlus className="size-4.5" />
          Добавить цикл
        </Button>
      </div>
    </header>
  );
}
