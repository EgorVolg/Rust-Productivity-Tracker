import { cn } from "../../lib/cn";
import type { LengthStat } from "../../lib/view";
import { Card, CardHeader } from "../ui";

/** §5.4: самый короткий, самый длинный, средний — в минутах */
export function CycleLengthCard({ stat }: { stat: LengthStat }) {
  const pos = (v: number) => `${stat.max > 0 ? (v / stat.max) * 100 : 0}%`;

  return (
    <Card aria-labelledby="h-len" className="gap-5.5">
      <CardHeader id="h-len" title="Длина цикла" tag="§5.4" />

      <div className="grid grid-cols-3 gap-3">
        <LengthTile label="Короткий" value={String(stat.min)} />
        <LengthTile label="Средний" value={stat.avg.toFixed(1)} highlight />
        <LengthTile label="Длинный" value={String(stat.max)} />
      </div>

      <div className="flex flex-col gap-2.5 pt-1.5">
        <div aria-hidden="true" className="relative h-4.5">
          <div className="absolute inset-x-0 top-1.75 h-1 rounded-sm bg-white/10" />
          <div
            className="absolute right-0 top-1.75 h-1 rounded-sm bg-accent/45"
            style={{ left: pos(stat.min) }}
          />
          <div
            className="absolute top-0.5 box-border size-3.5 -translate-x-1/2 rounded-full border-2 border-lilac bg-ink"
            style={{ left: pos(stat.min) }}
          />
          <div
            className="absolute top-0 size-4.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgb(182_156_255/0.25)]"
            style={{ left: pos(stat.avg) }}
          />
          <div className="absolute top-0.5 right-0 box-border size-3.5 rounded-full border-2 border-lilac bg-ink" />
        </div>
        <div className="flex justify-between font-mono text-xs text-[#9A8EC4]">
          <span>0</span>
          <span>{Math.round(stat.max / 2)}</span>
          <span>{stat.max} мин</span>
        </div>
      </div>
    </Card>
  );
}

function LengthTile({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border p-3.5",
        highlight
          ? "border-lilac/22 bg-accent/14"
          : "border-white/8 bg-well/30",
      )}
    >
      <span
        className={cn(
          "text-xs font-medium",
          highlight ? "text-[#D4C8F5]" : "text-muted",
        )}
      >
        {label}
      </span>
      <span className="font-display text-[26px] leading-none font-medium">
        {value}
      </span>
      <span className="font-mono text-xs text-[#9A8EC4]">мин</span>
    </div>
  );
}
