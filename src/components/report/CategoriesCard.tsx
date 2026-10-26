import { cn } from '../../lib/cn';
import type { CategoryStat } from '../../lib/view';
import { Colors } from '../../lib';
import { Card, CardHeader, CategoryLabel } from '../ui';

const COLUMNS = ['Категория', 'Циклы', 'Минуты', 'Доля'];

/** §5.3: циклы, минуты, доля в процентах с одним знаком */
export function CategoriesCard({ stats }: { stats: CategoryStat[] }) {
  return (
    <Card aria-labelledby="h-cat" className="gap-5.5">
      <CardHeader id="h-cat" title="По категориям" tag="§5.3" />

      <div aria-hidden="true" className="flex h-3.5 gap-1">
        {stats.map((s, index) => {
          return (
            <div
              key={s.category}
              className="rounded-[7px]"
              style={{ width: `${s.share}%`, backgroundColor: Colors[index] }}
            />
          );
        })}
      </div>

      <table className="w-full border-collapse text-sm font-medium">
        <thead>
          <tr>
            {COLUMNS.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={cn('pb-2.5 text-xs font-medium text-subtle', i === 0 ? 'text-left' : 'text-right')}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.map((s, index) => (
            <tr key={s.category} className="border-t border-white/8">
              <td className="py-3.5">
                <CategoryLabel color={Colors[index]} />
              </td>
              <td className="py-3.5 text-right font-mono">{s.cycles}</td>
              <td className="py-3.5 text-right font-mono">{s.minutes}</td>
              <td className="py-3.5 text-right font-display text-xl">
                {s.share.toFixed(1)}
                <span className="text-[13px] text-soft"> %</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
