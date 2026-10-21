import { invoke } from "@tauri-apps/api/core";
import { Cycle } from "./types";
import { CycleDraft } from "./view";

export const api = {
  addCycle: (cycle: CycleDraft) => invoke<Cycle[]>("cycle_form", { cycle }),
};
