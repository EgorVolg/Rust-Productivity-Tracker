import {
  AddCycleDialog,
  Background,
  CategoriesCard,
  EmptyState,
  EnergyCard,
  FilterBar,
  Heatmap,
  MorningBlock,
  RecentCycles,
  SummaryCards,
  Toast,
  TopBar,
  TopWords,
} from "./components";
import { PreviewState } from "./lib/view";
import * as demoData from "./data/demo";
import { useState } from "react";
import {
  useJournal,
  useToast,
  useCycleManager,
  calculateSummary,
  calculateCategoryStats,
  calculateLengthStats,
  calculateEnergyStats,
  calculateHeatmapMatrix,
  calculateBestDayAndHour,
  calculateMorningBlock,
  calculateTopWords,
} from "./lib";

const preview: PreviewState = { panel: null, empty: false, heatTooltip: null };

export default function App() {
  const { journal, loading, error, loadJournal } = useJournal();
  const toast = useToast();
  const cycles = useCycleManager({
    journal,
    reload: loadJournal,
    notify: toast.show,
  });

  const [showAllCycles, setShowAllCycles] = useState(false);
  const [showRowMenu, setRowMenu] = useState<string | null>(null);

  // Вычисляем статистику из реальных данных
  const summary = journal ? calculateSummary(journal.cycles) : null;
  const categories = journal ? calculateCategoryStats(journal.cycles) : [];
  const cycleLength = journal
    ? calculateLengthStats(journal.cycles)
    : { min: 0, max: 0, avg: 0 };
  const energy = journal
    ? calculateEnergyStats(journal.cycles)
    : { avg: 0, median: 0, distribution: [0, 0, 0, 0, 0] };
  const heatmapMatrix = journal
    ? calculateHeatmapMatrix(journal.cycles)
    : demoData.heatmap;
  const { bestDay, bestHour } = journal
    ? calculateBestDayAndHour(heatmapMatrix)
    : { bestDay: demoData.bestDay, bestHour: demoData.bestHour };
  const morning = journal
    ? calculateMorningBlock(journal.cycles)
    : demoData.morning;
  const topWords = journal
    ? calculateTopWords(journal.cycles, demoData.filters.top)
    : demoData.topWords;

  if (loading && !journal) return <div>Загрузка...</div>;
  if (error && !journal) return <div>Ошибка: {error}</div>;
  if (!journal) return <div>Нет данных</div>;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />

      <div className="relative z-1 mx-auto flex max-w-340 flex-col gap-6 px-10 pt-8 pb-14">
        <TopBar setOpenAddCycle={cycles.openAdd} />

        <FilterBar
          filters={demoData.filters}
          counts={demoData.categoryCounts}
          total={journal.lineCount}
          presets={demoData.periodPresets}
          openPanel={preview.panel}
        />

        <main className="flex flex-col gap-6">
          <SummaryCards
            journal={journal}
            summary={preview.empty ? null : summary}
            categories={categories}
          />

          {preview.empty ? (
            <EmptyState />
          ) : (
            <>
              {/* <div className="grid grid-cols-3 gap-5">
                <CategoriesCard stats={categories} />
                <CycleLengthCard stat={cycleLength} />
                <EnergyCard stat={energy} />
              </div> */}

              <Heatmap
                matrix={heatmapMatrix}
                bestDay={bestDay}
                bestHour={bestHour}
                tooltip={preview.heatTooltip}
              />

              <div className="grid grid-cols-2 gap-5">
                <MorningBlock minutesByDay={morning} />
                <TopWords words={topWords} top={demoData.filters.top} />
              </div>

              <RecentCycles
                cycles={journal.cycles}
                total={journal.lineCount}
                setShowAll={setShowAllCycles}
                showAll={showAllCycles}
                setOpenAddCycle={cycles.openAdd}
                showRowMenu={showRowMenu}
                setRowMenu={setRowMenu}
                handleCopyCycle={cycles.copy}
                handleDeleteCycle={cycles.remove}
                handleEditCycle={cycles.openEdit}
              />
            </>
          )}
        </main>
      </div>

      <AddCycleDialog
        key={cycles.version}
        addOrEdit={cycles.mode}
        editingCycleId={cycles.editingId}
        suggestions={demoData.topicSuggestions}
        formData={cycles.formData}
        open={cycles.open}
        onOpenChange={(v) => {
          if (!v) cycles.setOpen(false);
        }}
        onAdded={cycles.onSaved}
      />

      {toast.message && (
        <Toast onClose={toast.hide} message={toast.message} undo />
      )}
    </div>
  );
}
