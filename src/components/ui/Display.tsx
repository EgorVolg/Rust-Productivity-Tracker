import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function CategoryDot({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-2.5 shrink-0 rounded-[3px]", className)}
      style={{ backgroundColor: color }}
    />
  );
}

export function CategoryLabel({ color }: { color: string }) {
  return (
    <span className="flex items-center gap-2.5 font-mono text-sm">
      <CategoryDot color={color} />
    </span>
  );
}

export function CategoryPill({ color }: { color: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[13px]"
      style={{ backgroundColor: `${color}20` }}
    >
      <CategoryDot color={color} className="size-2 rounded-full" />
    </span>
  );
}

/** «25 ч 5 мин» с единицами помельче */
export function Duration({
  minutes,
  unitClassName = "text-xl text-soft",
}: {
  minutes: number;
  unitClassName?: string;
}) {
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
    <span
      aria-label={`Энергия ${value} из 5`}
      className="whitespace-nowrap tracking-[2px]"
    >
      <span className="text-accent">{"●".repeat(value)}</span>
      <span className="text-white/20">{"●".repeat(5 - value)}</span>
    </span>
  );
}

export function BigValue({
  value,
  label,
}: {
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-display text-[30px] leading-none font-medium">
        {value}
      </span>
      <span className="text-xs font-medium text-muted">{label}</span>
    </div>
  );
}
