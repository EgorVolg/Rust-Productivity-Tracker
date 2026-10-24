/** Светящиеся пятна под стеклом. Без них стеклянные карточки нечего размывать. */
export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0">
      <div className="absolute -top-50 -left-45 h-160 w-160 rounded-full bg-primary opacity-55 blur-[140px]" />
      <div className="absolute top-160 -right-35 h-145 w-145 rounded-full bg-[#C026D3] opacity-32 blur-[150px]" />
      <div className="absolute top-295 left-65 h-105 w-130 rounded-full bg-[#A855F7] opacity-28 blur-[140px]" />
      <div className="absolute top-[1680px] -left-30 h-155 w-180 rounded-full bg-[#4338CA] opacity-45 blur-[160px]" />
    </div>
  );
}
