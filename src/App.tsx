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
  ReportHeader,
  SummaryCards,
  Toast,
  TopBar,
  TopWords,
} from "./components";
import { PreviewState } from "./lib/view";
import * as demoData from "./data/demo";

/**
 * Только для просмотра вёрстки: что показать открытым.
 * panel: 'category' | 'period' | 'top' | 'file' | 'errors' | 'open-file' | 'add-cycle' | null
 */
const preview: PreviewState = {
  panel: null,
  empty: false,
  toast: false,
  rowMenu: null,
  heatTooltip: null,
};

export default function App() {
  const { file } = demoData;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />

      <div className="relative z-1 mx-auto flex max-w-340 flex-col gap-6 px-10 pt-8 pb-14">
        <TopBar />

        <FilterBar
          filters={demoData.filters}
          counts={demoData.categoryCounts}
          shown={preview.empty ? 0 : demoData.summary.cycles}
          total={file.cycles}
          presets={demoData.periodPresets}
          openPanel={preview.panel}
        />

        <main className="flex flex-col gap-6">
          <ReportHeader
            fileName={file.name}
            period={
              preview.empty ? "период данных: —" : `${file.from} → ${file.to}`
            }
            filtersText={`фильтры не применены · топ-${demoData.filters.top} слов`}
          />

          <SummaryCards summary={preview.empty ? null : demoData.summary} />

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
                cycles={demoData.recentCycles}
                total={demoData.summary.cycles}
                menuOpenIndex={preview.rowMenu}
              />
            </>
          )}
        </main>
      </div>

      {preview.panel === "open-file" && <OpenFileDialog />}
      {preview.panel === "add-cycle" && (
        <AddCycleDialog
          draft={demoData.cycleDraft}
          suggestions={demoData.topicSuggestions}
        />
      )}
      {preview.toast && <Toast message="Цикл добавлен · rust, 50 мин" undo />}
    </div>
  );
}
