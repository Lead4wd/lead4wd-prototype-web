// ============================================================================
// Lead4wd — progress model (the functional core)
// ----------------------------------------------------------------------------
// Tracks what the user has done: completed modules, reflections, actions tried,
// the streak counter, and assessment scores. Persisted to localStorage so it
// survives view navigation; each login starts from scratch (see page.tsx).
// The dashboard ring/KPIs/streak and the journey states are all DERIVED here.
// ============================================================================

import { MODULE_IDS } from "@/data/modules";
import type { SkillId } from "@/data/content";

export type View =
  | "dashboard"
  | "journey"
  | "lesson"
  | "results"
  | "team"
  | "assessment";

export type Progress = {
  completedModules: string[]; // module ids
  actionsTried: string[]; // module ids where a reflection was written
  reflections: Record<string, string>; // moduleId -> text
  streak: number; // functional dummy — +1 per completed module
  scores: Record<SkillId, number>; // from the skills check (0 until taken)
};

const STORAGE_KEY = "lead4wd_progress_v4";

const SKILLS: SkillId[] = ["communication", "listening", "delegation", "feedback", "conflict"];
const zeroScores = (): Record<SkillId, number> =>
  SKILLS.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as Record<SkillId, number>);

// --- persistence -------------------------------------------------------------
/** A brand-new, from-scratch user: nothing done, no scores yet, streak 0. */
export function seedProgress(): Progress {
  return { completedModules: [], actionsTried: [], reflections: {}, streak: 0, scores: zeroScores() };
}

export function loadProgress(): Progress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const base = seedProgress();
    return {
      completedModules: parsed.completedModules ?? base.completedModules,
      actionsTried: parsed.actionsTried ?? base.actionsTried,
      reflections: parsed.reflections ?? {},
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      scores: { ...base.scores, ...(parsed.scores ?? {}) },
    };
  } catch {
    return null;
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* storage full / unavailable — ignore for a prototype */
  }
}

// --- derivations -------------------------------------------------------------
/** First module the user hasn't completed (the "now" module), or null if done. */
export function currentModuleId(completed: string[]): string | null {
  const set = new Set(completed);
  return MODULE_IDS.find((id) => !set.has(id)) ?? null;
}

export function planPct(completed: string[]): number {
  if (MODULE_IDS.length === 0) return 0;
  return Math.round((completed.length / MODULE_IDS.length) * 100);
}

/** 1-based position of the current module (or the total once everything's done). */
export function currentModuleNumber(nowModuleId: string | null): number {
  if (!nowModuleId) return MODULE_IDS.length;
  const idx = MODULE_IDS.indexOf(nowModuleId);
  return idx >= 0 ? idx + 1 : 1;
}

export const TOTAL_MODULES = MODULE_IDS.length;

export function moduleState(
  id: string,
  completed: string[],
  nowModuleId: string | null
): "done" | "now" | "todo" {
  if (completed.includes(id)) return "done";
  if (id === nowModuleId) return "now";
  return "todo";
}

export type StreakCell = { label: string; state: "done" | "today" | "todo" };

/** A 7-cell calendar that fills as the streak grows. */
export function streakCells(streak: number, weekdaysShort: string[], todayLabel: string): StreakCell[] {
  const cells: StreakCell[] = [];
  for (let i = 0; i < 7; i++) {
    const state: StreakCell["state"] = i < streak ? "done" : i === streak ? "today" : "todo";
    cells.push({ label: state === "today" ? todayLabel : weekdaysShort[i % 7], state });
  }
  return cells;
}

/** Immutably record a completed module + its reflection, and bump the streak. */
export function completeModule(prev: Progress, moduleId: string, reflection: string): Progress {
  const text = reflection.trim();
  const alreadyDone = prev.completedModules.includes(moduleId);
  return {
    ...prev,
    completedModules: alreadyDone ? prev.completedModules : [...prev.completedModules, moduleId],
    actionsTried:
      text && !prev.actionsTried.includes(moduleId) ? [...prev.actionsTried, moduleId] : prev.actionsTried,
    reflections: text ? { ...prev.reflections, [moduleId]: text } : prev.reflections,
    streak: alreadyDone ? prev.streak : prev.streak + 1,
  };
}
