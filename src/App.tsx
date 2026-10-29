import {
  AddCycleDialog,
  Background,
  EmptyState,
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
import { useState } from "react";
import {
  useJournal,
  useToast,
  useCycleManager,
  calculateSummary,
  calculateCategoryStats, 
  calculateHeatmapMatrix,
  calculateBestDayAndHour,
  calculateMorningBlock,
  calculateTopWords,
  DEFAULT_FILTERS,
  useCategoryCounts,
  usePeriodPresets,
  useFilterHandlers,
  type Filters,
  type PanelId,
} from "./lib";

const preview: PreviewState = { panel: null, empty: false, heatTooltip: null };

export default function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const { journal, loading, error, loadJournal } = useJournal(filters);
  const toast = useToast();
  const cycles = useCycleManager({
    journal,
    reload: loadJournal,
    notify: toast.show,
  });

  const [showAllCycles, setShowAllCycles] = useState(false);
  const [showRowMenu, setRowMenu] = useState<string | null>(null);

  const [openPanel, setOpenPanel] = useState<PanelId>(null);

  // Вычисляем количество циклов по категориям (для счётчиков в фильтре)
  const categoryCounts = useCategoryCounts(journal?.cycles ?? null);

  // Пресеты периода
  const periodPresets = usePeriodPresets(journal?.cycles ?? null);

  // Обработчики для фильтров
  const filterHandlers = useFilterHandlers(setFilters, DEFAULT_FILTERS);

  if (loading && !journal) return <div>Загрузка...</div>;
  if (error && !journal) return <div>Ошибка: {error}</div>;
  if (!journal || journal.totalCycles == 0) return <EmptyState />;

  // Вычисляем статистику из данных (без фильтрации - фильтрация будет на Rust)
  const summary = calculateSummary(journal.cycles);
  const categories = calculateCategoryStats(journal.cycles);

  const heatmapMatrix = calculateHeatmapMatrix(journal.cycles);
  const { bestDay, bestHour } = calculateBestDayAndHour(heatmapMatrix);
  const morning = calculateMorningBlock(journal.cycles);
  const topWords = calculateTopWords(journal.cycles, filters.top);

  const handlePanelToggle = (panel: PanelId) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />

      <div className="relative z-1 mx-auto flex max-w-340 flex-col gap-6 px-10 pt-8 pb-14">
        <TopBar setOpenAddCycle={cycles.openAdd} />

        <FilterBar
          filters={filters}
          counts={categoryCounts}
          total={journal.cycles.length}
          totalCycles={journal.totalCycles}
          presets={periodPresets}
          openPanel={openPanel}
          onCategoryChange={filterHandlers.handleCategoryChange}
          onPeriodChange={filterHandlers.handlePeriodChange}
          onTopChange={filterHandlers.handleTopChange}
          onReset={filterHandlers.handleResetFilters}
          onPanelToggle={handlePanelToggle}
        />

        <main className="flex flex-col gap-6">
          <SummaryCards
            journal={journal}
            summary={preview.empty ? null : summary}
            categories={categories}
          />

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
            <TopWords words={topWords} top={filters.top} />
          </div>

          <RecentCycles
            cycles={journal.cycles}
            total={journal.cycles.length}
            setShowAll={setShowAllCycles}
            showAll={showAllCycles}
            setOpenAddCycle={cycles.openAdd}
            showRowMenu={showRowMenu}
            setRowMenu={setRowMenu}
            handleCopyCycle={cycles.copy}
            handleDeleteCycle={cycles.remove}
            handleEditCycle={cycles.openEdit}
          />
        </main>
      </div>

      <AddCycleDialog
        key={cycles.version}
        addOrEdit={cycles.mode}
        editingCycleId={cycles.editingId}
        suggestions={journal.cycles.map(c => c.topic)}
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
