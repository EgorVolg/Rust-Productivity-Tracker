import { Button, IconFilterOff } from "../ui";

/** §3.5 / §6.4: после фильтров не осталось корректных строк */
export function EmptyState() {
  return (
    <section
      aria-labelledby="h-empty"
      className="glass flex flex-col items-center gap-4.5 px-8 pt-14 pb-15 text-center"
    >
      <div className="flex size-18 items-center justify-center rounded-card border border-lilac/28 bg-accent/14 text-lilac">
        <IconFilterOff className="size-8" strokeWidth={1.6} />
      </div>
      <h2
        id="h-empty"
        className="m-0 font-display text-[28px] font-medium tracking-[-0.01em]"
      >
        Нет данных
      </h2>
      <p className="m-0 max-w-130 text-[15px] leading-[1.55] font-medium text-soft">
        После фильтров не осталось ни одного корректного цикла, поэтому
        статистика не считается. Измените период или категорию.
      </p>
      <div className="flex gap-3 pt-1.5">
        <Button variant="primary">Сбросить фильтры</Button>
        <Button>Изменить период</Button>
      </div>
    </section>
  );
}
