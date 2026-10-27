import { cn } from "../../lib/cn";
import type { CategoryStat } from "../../lib/view";
import { Colors } from "../../lib";
import { Card, CardHeader, CategoryLabel } from "../ui";

const COLUMNS = ["Категория", "Циклы", "Минуты", "Доля"];

/** §5.3: циклы, минуты, доля в процентах с одним знаком */
export function CategoriesCard({ stats }: { stats: CategoryStat[] }) {
  // Сортируем по минутам и берём топ-4, остальные объединяем в "other"
  const sorted = [...stats].sort((a, b) => b.minutes - a.minutes);
  const top4 = sorted.slice(0, 4);
  const other = sorted.slice(4);

  const displayStats =
    other.length > 0
      ? [
          ...top4,
          {
            category: "other",
            cycles: other.reduce((sum, s) => sum + s.cycles, 0),
            minutes: other.reduce((sum, s) => sum + s.minutes, 0),
            share: other.reduce((sum, s) => sum + s.share, 0),
          },
        ]
      : top4;

  return (
    <Card aria-labelledby="h-cat" className="gap-5.5">
      <CardHeader id="h-cat" title="По категориям" tag="§5.3" />

      <div aria-hidden="true" className="flex h-3.5 gap-1">
        {displayStats.map((s, index) => {
          return (
            <div
              key={s.category}
              className="rounded-[7px]"
              style={{
                width: `${s.share}%`,
                backgroundColor: Colors[index % Colors.length],
              }}
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
                className={cn(
                  "pb-2.5 text-xs font-medium text-subtle",
                  i === 0 ? "text-left" : "text-right",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayStats.map((s, index) => (
            <tr key={s.category} className="border-t border-white/8">
              <td className="py-3.5 flex items-center gap-2">
                <CategoryLabel color={Colors[index % Colors.length]} />
                <span className="text-soft">{s.category}</span>
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
