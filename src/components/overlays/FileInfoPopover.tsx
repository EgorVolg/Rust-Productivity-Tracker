import type { FileInfo } from '../../lib/view';
import { Button, Popover } from '../ui';

export function FileInfoPopover({ file }: { file: FileInfo }) {
  const rows: [string, string][] = [
    ['Строк в файле', String(file.lines)],
    ['Корректных циклов', String(file.cycles)],
    ['Строк с ошибками', String(file.errors)],
    ['Кодировка', file.encoding],
    ['Период данных', `${file.from} → ${file.to}`],
  ];

  return (
    <Popover align="right" aria-labelledby="file-title" className="w-85 gap-3.5 p-5">
      <div className="flex flex-col gap-1">
        <h3 id="file-title" className="m-0 font-mono text-[15px] font-semibold">
          {file.name}
        </h3>
        <span className="text-[13px] font-medium text-muted">Журнал циклов, читается локально</span>
      </div>

      <dl className="m-0 flex flex-col rounded-[14px] border border-white/7 bg-well/45 px-3.5 py-1">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-3 border-b border-white/6 py-2.5 text-[13px] font-medium last:border-b-0"
          >
            <dt className="text-muted">{label}</dt>
            <dd className="m-0 font-mono">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex gap-2.5">
        <Button size="sm" className="flex-1">
          Перечитать
        </Button>
        <Button size="sm" variant="primary" className="flex-1">
          Другой файл…
        </Button>
      </div>
    </Popover>
  );
}
