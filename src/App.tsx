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
  RecentCycles,
  SummaryCards,
  Toast,
  TopBar,
  TopWords,
} from "./components";
import { PreviewState } from "./lib/view";
import * as demoData from "./data/demo";
import { useEffect, useState } from "react";
import { CycleInput, useJournal } from "./lib";

const preview: PreviewState = {
  panel: null,
  empty: false,
  heatTooltip: null,
};

export type CycleDialogState = "add" | "edit";

function emptyForm(): CycleInput {
  return {
    date: new Date().toISOString().split("T")[0],
    hour: new Date().getHours(),
    category: "",
    topic: "",
    minutes: 50,
    energy: 5,
  };
}

export default function App() {
  const { journal, loading, error, loadJournal } = useJournal();

  const [formData, setFormData] = useState<CycleInput>(emptyForm);
  const [userEdited, setUserEdited] = useState(false);
  const [dialogVersion, setDialogVersion] = useState(0);
  const [openAddCycle, setOpenAddCycle] = useState(false);
  const [showAllCycles, setShowAllCycles] = useState(false);
  const [showRowMenu, setRowMenu] = useState<null | number>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [addOrEdit, setAddOrEdit] = useState<CycleDialogState>("add");

  useEffect(() => {
    if (userEdited) return;
    const last = journal?.cycles.at(-1);
    if (!last) return;

    setFormData({
      date: new Date().toISOString().split("T")[0],
      hour: new Date().getHours(),
      category: last.category,
      topic: last.topic,
      minutes: 50,
      energy: 5,
    });

    setDialogVersion((v) => v + 1);
  }, [journal, userEdited]);

  if (loading && !journal) {
    return <div>Загрузка...</div>;
  }

  if (error && !journal) {
    return <div>Ошибка: {error}</div>;
  }

  if (!journal) {
    return <div>Нет данных</div>;
  }

  // Обёртка над setFormData, которая помечает «пользователь тронул форму»
  function updateForm(next: CycleInput) {
    setUserEdited(true);
    setFormData(next);
  }

  function showToast(message: string) {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 1500);
  }

  // Явное открытие «добавить» — всегда стартуем от последнего цикла,
  // без учёта прошлых правок.
  function handleOpenAddDialog() {
    const last = journal!.cycles.at(-1);
    setUserEdited(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      hour: new Date().getHours(),
      category: last?.category ?? "",
      topic: last?.topic ?? "",
      minutes: 50,
      energy: 5,
    });
    setAddOrEdit("add");
    setDialogVersion((v) => v + 1);
    setOpenAddCycle(true);
  }

  function handleAddCycle() {
    setOpenAddCycle(false);
    // После сохранения journal перезагрузится — эффект снова
    // подхватит уже обновлённый «последний» цикл.
    setUserEdited(false);
    showToast(`Цикл ${addOrEdit === "add" ? "добавлен" : "изменён"}`);
    loadJournal();
  }

  function handleCopyCycle(id: string) {
    const cycle = journal!.cycles.find((c) => c.id === id);
    if (!cycle) return;

    setUserEdited(true); // пользователь явно выбрал этот цикл — не перетираем
    setFormData({
      date: cycle.date,
      hour: cycle.hour,
      category: cycle.category,
      topic: cycle.topic,
      minutes: cycle.minutes,
      energy: cycle.energy,
    });
    setAddOrEdit("add");
    setDialogVersion((v) => v + 1);
    setOpenAddCycle(true);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />

      <div className="relative z-1 mx-auto flex max-w-340 flex-col gap-6 px-10 pt-8 pb-14">
        <TopBar setOpenAddCycle={handleOpenAddDialog} />

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
                setOpenAddCycle={handleOpenAddDialog}
                showRowMenu={showRowMenu}
                setRowMenu={setRowMenu}
                setAddOrEdit={setAddOrEdit}
                loadJournal={loadJournal}
                handleCopyCycle={handleCopyCycle}
              />
            </>
          )}
        </main>
      </div>

      <AddCycleDialog
        key={dialogVersion}
        addOrEdit={addOrEdit}
        suggestions={demoData.topicSuggestions}
        formData={formData}
        open={openAddCycle}
        onOpenChange={() => setOpenAddCycle(false)}
        onAdded={handleAddCycle}
      />
      {toastMessage && (
        <Toast
          onClose={() => setToastMessage(null)}
          message={toastMessage}
          undo
        />
      )}
    </div>
  );
}
