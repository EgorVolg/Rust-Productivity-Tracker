import { Popover } from "@base-ui/react/popover";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Colors } from "../../lib";

const W = 168;
const H = 92;
const CX = W / 2;
const BASE = 84;
const OUTER_RY = 84;

const SWATCH = 20; // диаметр цветной точки
const PAD = 4; // ширина белой подложки вокруг точки
const BACK = SWATCH + PAD * 2; // диаметр подложки

function swatchPos(i: number, n: number) {
  const angle = 20 + (200 * i) / (n - 1) + 65;
  const phi = (angle * Math.PI) / 180;
  const x = CX + CX * Math.cos(phi);
  const y = BASE - OUTER_RY * Math.sin(phi);
  return { x, y };
}

interface Props {
  color: string;
  onColorChange: (color: string) => void;
  trigger: ReactNode;
}

export function ColorCrescent({ color, onColorChange, trigger }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Выбрать цвет"
        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-[14px]  outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        {trigger}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner side="top" sideOffset={6} className="z-100">
          <Popover.Popup
            className="relative outline-none"
            style={{ width: W, height: H, top: 20 }}
          >
            {Colors.map((c, i) => {
              const { x, y } = swatchPos(i, Colors.length);
              return (
                <div
                  key={c}
                  className="absolute grid place-items-center rounded-full bg-white shadow-md"
                  style={{
                    width: BACK,
                    height: BACK,
                    left: x - BACK / 2,
                    top: y - BACK / 2,
                  }}
                >
                  <button
                    type="button"
                    aria-label={c}
                    onClick={() => onColorChange(c)}
                    className={cn(
                      "cursor-pointer rounded-full border-2 transition-transform hover:scale-110",
                      c === color ? "border-black/70" : "border-transparent",
                    )}
                    style={{ background: c, width: SWATCH, height: SWATCH }}
                  />
                </div>
              );
            })}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
