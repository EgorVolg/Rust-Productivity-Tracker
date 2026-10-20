import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { Category } from '../../lib/types';

const DOT: Record<Category, string> = { rust: 'bg-rust', english: 'bg-english' };
const PILL: Record<Category, string> = { rust: 'bg-rust/14', english: 'bg-english/16' };

export function CategoryDot({ category, className }: { category: Category; className?: string }) {
  return <span aria-hidden="true" className={cn('size-2.5 shrink-0 rounded-[3px]', DOT[category], className)} />;
}

export function CategoryLabel({ category }: { category: Category }) {
  return (
    <span className="flex items-center gap-2.5 font-mono text-sm">
      <CategoryDot category={category} />
      {category}
    </span>
  );
}

export function CategoryPill({ category }: { category: Category }) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[13px]', PILL[category])}>
      <CategoryDot category={category} className="size-2 rounded-full" />
      {category}
    </span>
  );
}

/** «25 ч 5 мин» с единицами помельче */
export function Duration({ minutes, unitClassName = 'text-xl text-soft' }: { minutes: number; unitClassName?: string }) {
  const m = Math.round(minutes);
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return (
    <>
      {h > 0 && (
        <>
          {h}
          <span className={unitClassName}> ч </span>
        </>
      )}
      {rest}
      <span className={unitClassName}> мин</span>
    </>
  );
}

/** Энергия точками: ●●●○○ */
export function EnergyDots({ value }: { value: number }) {
  return (
    <span aria-label={`Энергия ${value} из 5`} className="whitespace-nowrap tracking-[2px]">
      <span className="text-accent">{'●'.repeat(value)}</span>
      <span className="text-white/20">{'●'.repeat(5 - value)}</span>
    </span>
  );
}

export function BigValue({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-display text-[30px] leading-none font-medium">{value}</span>
      <span className="text-xs font-medium text-muted">{label}</span>
    </div>
  );
}
