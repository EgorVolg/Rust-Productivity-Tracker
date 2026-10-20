import { CategoryDot } from '../ui';

interface ReportHeaderProps {
  fileName: string;
  period: string;
  filtersText: string;
}

/** §5.1: имя файла, период данных, применённые фильтры */
export function ReportHeader({ fileName, period, filtersText }: ReportHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-6 px-1 pt-3">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs font-medium tracking-[0.08em] text-[#C9B8FF]">ОТЧЁТ · §5.1</span>
        <h1 className="m-0 font-display text-[40px] leading-[1.1] font-medium tracking-[-0.02em]">Журнал циклов</h1>
        <p className="m-0 text-[15px] font-medium text-soft">
          {fileName} · {period} · {filtersText}
        </p>
      </div>
      <div className="flex items-center gap-5 font-mono text-[13px] font-medium text-soft">
        <span className="flex items-center gap-2">
          <CategoryDot category="rust" />
          rust
        </span>
        <span className="flex items-center gap-2">
          <CategoryDot category="english" />
          english
        </span>
      </div>
    </div>
  );
}
