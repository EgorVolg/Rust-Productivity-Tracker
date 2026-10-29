import { useEffect, useRef } from "react";

/**
 * Хук для закрытия элемента при клике вне его
 * @param onClose - функция, вызываемая при клике вне элемента
 * @param isActive - если false, слушатель событий не добавляется
 */
export function useClickOutside(
  onClose: () => void,
  isActive: boolean = true
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, isActive]);

  return ref;
}
