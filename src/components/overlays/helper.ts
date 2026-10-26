import { pad2 } from "@/lib";

export const MINUTE_PRESETS = [15, 25, 50, 90];
export const ENERGY = [1, 2, 3, 4, 5];
export const morning = (h: number) => h >= 6 && h < 12;
export const day = (h: number) => h >= 12 && h < 18;
export const evening = (h: number) => h >= 18 && h < 24;

export function toDateInputValue(d: Date): string {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function today() {
    return toDateInputValue(new Date());
}

export function yesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return toDateInputValue(d);
}

export function formatWeekday(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("ru-RU", { weekday: "long" });
}
