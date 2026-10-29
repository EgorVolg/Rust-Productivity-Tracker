import { invoke } from "@tauri-apps/api/core";
import type { Filters, ParseResult } from "./types";

export interface CycleInput {
  date: string;
  hour: number;
  color: string;
  category: string;
  topic: string;
  minutes: number;
  energy: number;
}

export interface Journal {
  cycles: CycleInput[];
  lineCount: number;
  streakDays: number;
  totalCycles: number;
}

export const api = {
  addCycle: (cycleForm: CycleInput) =>
    invoke<string>("add_cycle", { cycleForm }),
  loadJournal: () => invoke<ParseResult>("load_journal"),
  loadFilteredJournal: (filters: Filters) =>
    invoke<ParseResult>("load_filtered_journal", { filters }),
  deleteCycle: (id: string) => invoke<void>("delete_cycle", { id }),
  editCycle: (id: string, cycleForm: CycleInput) =>
    invoke<void>("edit_cycle", { id, cycleForm }),
};
