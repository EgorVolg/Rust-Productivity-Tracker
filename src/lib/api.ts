import { invoke } from "@tauri-apps/api/core";
import type { Category } from "./types";

/** Данные цикла для Rust-команды add_cycle; поля как у CycleInput в lib.rs. */
export interface CycleInput {
  date: string;
  hour: number;
  category: Category;
  topic: string;
  minutes: number;
  energy: number;
}

export const api = {
  // Tauri ждёт имена аргументов в camelCase: cycle_form → cycleForm
  addCycle: (cycleForm: CycleInput) =>
    invoke<string>("add_cycle", { cycleForm }),
};
