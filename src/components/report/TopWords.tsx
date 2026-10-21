import { pad2 } from '../../lib/format';
import type { WordStat } from '../../lib/view';
import { Button, Card, CardHeader } from '../ui';

/** §5.8: топ-N слов в темах */
export function TopWords({ words, top }: { words: WordStat[]; top: number }) {
  const max = words[0]?.count ?? 0;

  return (
    <Card aria-labelledby="h-words" className="gap-4.5">
      <CardHeader
        id="h-words"
        title="Частые слова в темах"
        tag="§5.8"
        description="Без учёта регистра, от 3 символов"
        actions={
          <Button variant="soft" size="sm" className="h-9 font-mono font-medium">
            топ-{top}
          </Button>
        }
      />

      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {words.map((w, i) => (
          <li key={w.word} className="flex h-5.5 items-center gap-3.5">
            <span className="w-5.5 font-mono text-xs text-faint">{pad2(i + 1)}</span>
            <span className="w-27.5 font-mono text-sm">{w.word}</span>
            <div className="h-2 flex-1 overflow-hidden rounded bg-white/7">
              <div className="h-2 rounded bg-accent" style={{ width: `${max > 0 ? (w.count / max) * 100 : 0}%` }} />
            </div>
            <span className="w-5 text-right font-mono text-[13px] text-lilac">{w.count}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
