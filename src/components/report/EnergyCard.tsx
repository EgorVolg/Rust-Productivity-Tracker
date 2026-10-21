import type { EnergyStat } from '../../lib/view';
import { BigValue, Card, CardHeader } from '../ui';

/** §5.5: среднее (два знака), медиана, распределение по оценкам 1–5 */
export function EnergyCard({ stat }: { stat: EnergyStat }) {
  const max = Math.max(...stat.distribution);
  const median = Number.isInteger(stat.median) ? String(stat.median) : stat.median.toFixed(1);

  return (
    <Card aria-labelledby="h-energy" className="gap-5">
      <CardHeader id="h-energy" title="Энергия" tag="§5.5" />

      <div className="flex gap-7">
        <BigValue value={stat.avg.toFixed(2)} label="среднее" />
        <BigValue value={median} label="медиана" />
      </div>

      <div className="flex flex-col gap-2.25">
        {stat.distribution.map((count, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-3.5 font-mono text-[13px] text-soft">{i + 1}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-md bg-white/7">
              <div className="h-3 rounded-md bg-accent" style={{ width: `${max > 0 ? (count / max) * 100 : 0}%` }} />
            </div>
            <span className="w-6 text-right font-mono text-[13px]">{count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
