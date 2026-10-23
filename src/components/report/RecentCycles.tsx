import { cn } from "../../lib/cn";
import { pad2, plural, truncate } from "../../lib/format";
import type { Cycle } from "../../lib/types";
import { RowMenu } from "../overlays";
import {
  Button,
  Card,
  CardHeader,
  CategoryPill,
  EnergyDots,
  IconButton,
  IconDots,
  IconPlus,
} from "../ui";

const COLS =
  "grid grid-cols-[120px_76px_140px_minmax(0,1fr)_76px_110px_40px] gap-3";

interface RecentCyclesProps {
  cycles: Cycle[];
  total: number;
  setShowAll: (v: boolean) => void;
  showAll: boolean;
  /** открыть диалог в режиме «добавить» */
  setOpenAddCycle: () => void;
  /** id цикла с открытым меню — id, а не индекс */
  showRowMenu: string | null;
  setRowMenu: (v: string | null) => void;
  handleCopyCycle: (id: string) => void;
  handleEditCycle: (cycle: Cycle) => void;
  handleDeleteCycle: (id: string) => void;
}

/** §5.9: последние циклы; тема длиннее 20 символов обрезается */
export function RecentCycles({
  cycles,
  total,
  showAll,
  setShowAll,
  setOpenAddCycle,
  showRowMenu,
  setRowMenu,
  handleCopyCycle,
  handleEditCycle,
  handleDeleteCycle,
}: RecentCyclesProps) {
  const cyclesData = showAll
    ? [...cycles].reverse()
    : [...cycles].slice(-5).reverse();

  return (
    <Card
      aria-labelledby="h-last"
      className={cn("gap-3.5", showRowMenu !== null && "relative z-45")}
    >
      <CardHeader
        id="h-last"
        title={
          showAll
            ? `Все циклы · ${total}`
            : `Последние ${total} ${plural(total, "цикл", "цикла", "циклов")}`
        }
        actions={
          <div className="flex items-center gap-2.5">
            {total > 5 && (
              <Button
                variant="ghost"
                size="sm"
                aria-expanded={showAll}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Свернуть" : `Показать все (${total})`}
              </Button>
            )}
            <Button
              variant="soft"
              size="sm"
              aria-haspopup="dialog"
              className="pl-2.5"
              onClick={setOpenAddCycle}
            >
              <IconPlus className="size-4" />
              Добавить
            </Button>
          </div>
        }
      />

      <div role="table" aria-labelledby="h-last" className="flex flex-col">
        <div
          role="row"
          className={cn(COLS, "pb-2.5 text-xs font-medium text-subtle")}
        >
          <span role="columnheader">Дата</span>
          <span role="columnheader">Час</span>
          <span role="columnheader">Категория</span>
          <span role="columnheader">Тема</span>
          <span role="columnheader" className="text-right">
            Минуты
          </span>
          <span role="columnheader" className="text-right">
            Энергия
          </span>
          <span role="columnheader" className="sr-only">
            Действия
          </span>
        </div>

        {cyclesData.map((c, i) => {
          const menuOpen = showRowMenu === c.id;
          const opensUp = cyclesData.length - i <= 3;

          return (
            <div
              key={c.id}
              role="row"
              className={cn(
                COLS,
                "min-h-13 items-center border-t border-white/8 text-sm font-medium",
              )}
            >
              <span role="cell" className="font-mono text-soft">
                {c.date}
              </span>
              <span role="cell" className="font-mono text-soft">
                {pad2(c.hour)}:00
              </span>
              <span role="cell">
                <CategoryPill category={c.category} />
              </span>
              <span role="cell" title={c.topic} className="truncate">
                {truncate(c.topic)}
              </span>
              <span role="cell" className="text-right font-mono">
                {c.minutes}
              </span>
              <span role="cell" className="text-right">
                <EnergyDots value={c.energy} />
              </span>
              <span role="cell" className="relative flex justify-end">
                <IconButton
                  onClick={() => setRowMenu(menuOpen ? null : c.id)}
                  label={`Действия с циклом ${c.date}, ${c.topic}`}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  active={menuOpen}
                >
                  <IconDots className="size-4" />
                </IconButton>
                {menuOpen && (
                  <RowMenu
                    id={c.id}
                    cycle={c}
                    placement={opensUp ? "up" : "down"}
                    onClose={() => setRowMenu(null)}
                    setAddOrEdit={handleEditCycle}
                    setOpenAddCycle={setOpenAddCycle}
                    onDeleteCycle={handleDeleteCycle}
                    onCopyCycle={handleCopyCycle}
                    onEditCycle={() => handleEditCycle(c)}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
