import { api, Journal, useJournal } from "@/lib";
import { cn } from "../../lib/cn";
import { pad2, truncate } from "../../lib/format";
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
  loadJournal: () => Promise<void>;
  /** строка с открытым меню — только для просмотра вёрстки */
  menuOpenIndex?: number | null;
  setOpenAddCycle: (v: boolean) => void;
  showRowMenu: number | null;
  setRowMenu: (v: number | null) => void;
  setAddOrEdit: (v: "add" | "edit") => void;
}

/** §5.9: последние циклы; тема длиннее 20 символов обрезается */
export function RecentCycles({
  cycles,
  total,
  menuOpenIndex,
  loadJournal,
  showAll,
  setShowAll,
  setOpenAddCycle,
  showRowMenu,
  setRowMenu,
  setAddOrEdit,
}: RecentCyclesProps) {
  const cyclesData = showAll ? cycles.reverse() : cycles.reverse().slice(-5);

  async function handleDeleteCycle(id: string) {
    try {
      await api.deleteCycle(id);
      await loadJournal();
      setRowMenu(null);
    } catch (err) {
      console.error("[RecentCycles] Не удалось удалить цикл:", err);
    }
  }

  return (
    <Card
      aria-labelledby="h-last"
      className={cn("gap-3.5", menuOpenIndex !== null && "relative z-45")}
    >
      <CardHeader
        id="h-last"
        title={
          showAll
            ? `Все циклы · ${total}`
            : `Последние ${cyclesData.length} циклов`
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
              onClick={() => {
                setAddOrEdit("add");
                setOpenAddCycle(true);
              }}
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
          const menuOpen = menuOpenIndex === i;
          const opensUp = cycles.length > 2 && i >= cycles.length - 2;
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
                  onClick={() => setRowMenu(menuOpen ? null : i)}
                  label={`Действия с циклом ${c.date}, ${c.topic}`}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  active={showRowMenu === i}
                >
                  <IconDots className="size-4" />
                </IconButton>
                {showRowMenu === i && (
                  <RowMenu
                    id={c.id}
                    setOpenAddCycle={setOpenAddCycle}
                    setAddOrEdit={() => setAddOrEdit("edit")}
                    placement={opensUp ? "up" : "down"}
                    onClose={() => setRowMenu(null)}
                    onDeleteCycle={handleDeleteCycle}
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
