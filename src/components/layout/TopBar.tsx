import { cn } from '../../lib/cn';
import { plural } from '../../lib/format';
import type { ParseError } from '../../lib/types';
import type { FileInfo, PanelId } from '../../lib/view';
import { ErrorsPopover, FileInfoPopover } from '../overlays';
import { Button, IconAlert, IconChevronDown, IconFile, IconPlus, IconUpload, Logo } from '../ui';

interface TopBarProps {
  file: FileInfo;
  errors: ParseError[];
  openPanel: PanelId;
}

export function TopBar({ file, errors, openPanel }: TopBarProps) {
  const errorsOpen = openPanel === 'errors';
  const fileOpen = openPanel === 'file';

  return (
    <header className="glass relative z-60 flex items-center justify-between gap-4 rounded-[20px] py-3 pr-3.5 pl-5">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="font-display text-[17px] font-semibold tracking-[-0.01em]">study-log</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.25 font-mono text-xs text-muted">
          локально · без сети
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Button
            variant="danger"
            aria-haspopup="dialog"
            aria-expanded={errorsOpen}
            className={cn('px-3.5', errorsOpen && 'bg-danger-strong/24')}
          >
            <IconAlert className="size-4" />
            {errors.length} {plural(errors.length, 'ошибка', 'ошибки', 'ошибок')}
          </Button>
          {errorsOpen && <ErrorsPopover errors={errors} />}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={fileOpen}
            className={cn(
              'flex h-11 items-center gap-2.5 rounded-[14px] border pr-3.5 pl-4 font-mono text-[13px] text-lilac',
              fileOpen ? 'border-lilac/38 bg-accent/26' : 'border-white/12 bg-well/35',
            )}
          >
            <IconFile className="size-4" />
            {file.name}
            <IconChevronDown className={cn('size-3.5 text-muted', fileOpen && 'rotate-180')} />
          </button>
          {fileOpen && <FileInfoPopover file={file} />}
        </div>

        <Button variant="secondary" className="px-4">
          <IconUpload className="size-4" />
          Открыть файл
        </Button>
        <Button variant="primary" aria-haspopup="dialog" className="pl-3.5">
          <IconPlus className="size-4.5" />
          Добавить цикл
        </Button>
      </div>
    </header>
  );
}
