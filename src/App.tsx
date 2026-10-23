import {
  AddCycleDialog,
  Background,
  CategoriesCard,
  CycleLengthCard,
  EmptyState,
  EnergyCard,
  FilterBar,
  Heatmap,
  MorningBlock,
  OpenFileDialog,
  RecentCycles,
  SummaryCards,
  Toast,
  TopBar,
  TopWords,
} from "./components";
import { PreviewState } from "./lib/view";
import * as demoData from "./data/demo";
import { useEffect, useState } from "react";
import { useJournal } from "./lib";

/**
 * Только для просмотра вёрстки: что показать открытым.
 * panel: 'category' | 'period' | 'top' | 'file' | 'errors' | 'open-file' | 'add-cycle' | null
 */
const preview: PreviewState = {
  panel: null,
  empty: false,

  heatTooltip: null,
};

export type CycleDialogState = "add" | "edit";

export default function App() {
  const [openAddCycle, setOpenAddCycle] = useState(false);
  const { journal, loading, error, loadJournal } = useJournal();
  const [showAllCycles, setShowAllCycles] = useState(false);
  const [showRowMenu, setRowMenu] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [addOrEdit, setAddOrEdit] = useState<CycleDialogState>("add");

  function handleAddCycle() {
    setOpenAddCycle(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1500);
    loadJournal();
  }

  useEffect(() => {
    if (journal) {
      console.log("[App] Список обновлён с сервера:", journal);
    }
  }, [journal]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!journal) {
    return <div>Нет данных</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />

      <div className="relative z-1 mx-auto flex max-w-340 flex-col gap-6 px-10 pt-8 pb-14">
        <TopBar setOpenAddCycle={() => setOpenAddCycle(true)} />

        <FilterBar
          filters={demoData.filters}
          counts={demoData.categoryCounts}
          shown={preview.empty ? 0 : demoData.summary.cycles}
          total={journal.lineCount}
          presets={demoData.periodPresets}
          openPanel={preview.panel}
        />

        <main className="flex flex-col gap-6">
          {/* <ReportHeader
            fileName="journal.json"
            period={
              preview.empty ? "период данных: —" : `${journal.from} → ${journal.to}`
            }
            filtersText={`фильтры не применены · топ-${demoData.filters.top} слов`}
          /> */}

          <SummaryCards
            journal={journal}
            summary={preview.empty ? null : demoData.summary}
          />

          {preview.empty ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-5">
                <CategoriesCard stats={demoData.categories} />
                <CycleLengthCard stat={demoData.cycleLength} />
                <EnergyCard stat={demoData.energy} />
              </div>

              <Heatmap
                matrix={demoData.heatmap}
                bestDay={demoData.bestDay}
                bestHour={demoData.bestHour}
                tooltip={preview.heatTooltip}
              />

              <div className="grid grid-cols-2 gap-5">
                <MorningBlock minutesByDay={demoData.morning} />
                <TopWords
                  words={demoData.topWords}
                  top={demoData.filters.top}
                />
              </div>

              <RecentCycles
                cycles={journal.cycles}
                total={journal.lineCount}
                setShowAll={setShowAllCycles}
                showAll={showAllCycles}
                setOpenAddCycle={() => setOpenAddCycle(true)}
                showRowMenu={showRowMenu}
                setRowMenu={setRowMenu}
                setAddOrEdit={setAddOrEdit}
              />
            </>
          )}
        </main>
      </div>

      <OpenFileDialog
        open={preview.panel === "open-file"}
        onOpenChange={() => {}}
      />
      <AddCycleDialog
        addOrEdit={addOrEdit}
        suggestions={demoData.topicSuggestions}
        open={openAddCycle}
        onOpenChange={() => setOpenAddCycle(false)}
        onAdded={handleAddCycle}
      />
      {showToast && (
        <Toast
          onClose={() => setShowToast(false)}
          message={`Цикл ${addOrEdit === "add" ? "добавлен" : "изменён"} · rust, 50 мин`}
          undo
        />
      )}
    </div>
  );
}
