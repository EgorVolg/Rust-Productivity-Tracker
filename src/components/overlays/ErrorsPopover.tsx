import type { ParseError } from '../../lib/types';
import { Button, IconInfo, Popover, SectionTag } from '../ui';

const MAX_SHOWN = 10;

/** §5.10: количество ошибок и список, не больше 10 строк, дальше — «и ещё N» */
export function ErrorsPopover({ errors }: { errors: ParseError[] }) {
  const shown = errors.slice(0, MAX_SHOWN);
  const rest = errors.length - shown.length;

  return (
    <Popover align="right" aria-labelledby="err-title" className="w-[440px] gap-3.5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 id="err-title" className="m-0 text-[15px] font-semibold">
            Ошибки во входных данных
          </h3>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-lg border border-danger-strong/35 bg-danger-strong/16 px-1.5 font-mono text-[13px] font-semibold text-danger">
            {errors.length}
          </span>
        </div>
        <SectionTag>§5.10</SectionTag>
      </div>

      <p className="m-0 text-sm font-medium text-muted">Эти строки пропущены, остальные обработаны.</p>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {shown.map((e) => (
          <li
            key={e.line}
            className="flex items-start gap-2.5 rounded-[14px] border border-white/7 bg-well/45 px-3.5 py-3 font-mono text-[13px] leading-[1.45] text-[#EDE7FF]"
          >
            <IconInfo className="mt-0.5 size-4 shrink-0 text-danger-strong" />
            <span>
              строка {e.line}: {e.message}
            </span>
          </li>
        ))}
      </ul>

      {rest > 0 && <p className="m-0 font-mono text-[13px] text-muted">и ещё {rest}</p>}

      <div className="flex justify-end">
        <Button size="sm">Понятно</Button>
      </div>
    </Popover>
  );
}
