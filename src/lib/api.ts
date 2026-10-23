import { invoke } from "@tauri-apps/api/core";
import type { Category, ParseResult } from "./types";

export interface CycleInput {
  date: string;
  hour: number;
  category: Category;
  topic: string;
  minutes: number;
  energy: number;
}

export interface Journal {
  cycles: CycleInput[];
  lineCount: number;
  streakDays: number;
}

export const api = {
  addCycle: (cycleForm: CycleInput) =>
    invoke<string>("add_cycle", { cycleForm }),

  loadJournal: () => invoke<ParseResult>("load_journal"),
};
