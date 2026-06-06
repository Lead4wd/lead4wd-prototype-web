// ============================================================================
// Lead4wd — progress derivations (pure)
// ----------------------------------------------------------------------------
// The Progress shape + every derived UI value. State now lives in Supabase
// (see src/lib/data.ts); these helpers are pure and take the module list as
// input, since modules are fetched from the DB at runtime.
// ============================================================================
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
  streak: number; // +1 per completed module
  scores: Record<SkillId, number>; // derived from the skills check (0 until taken)
};

const SKILLS: SkillId[] = ["communication", "listening", "delegation", "feedback", "conflict"];
const zeroScores = (): Record<SkillId, number> =>
  SKILLS.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as Record<SkillId, number>);

/** Initial client state before the user's data has loaded. */
export function emptyProgress(): Progress {
  return { completedModules: [], actionsTried: [], reflections: {}, streak: 0, scores: zeroScores() };
}

// --- derivations -------------------------------------------------------------
/** First module the user hasn't completed (the "now" module), or null if done. */
export function currentModuleId(completed: string[], moduleIds: string[]): string | null {
  const set = new Set(completed);
  return moduleIds.find((id) => !set.has(id)) ?? null;
}

export function planPct(completed: string[], total: number): number {
  if (total === 0) return 0;
  return Math.round((completed.length / total) * 100);
}

/** 1-based position of the current module (or the total once everything's done). */
export function currentModuleNumber(nowModuleId: string | null, moduleIds: string[]): number {
  if (!nowModuleId) return moduleIds.length;
  const idx = moduleIds.indexOf(nowModuleId);
  return idx >= 0 ? idx + 1 : 1;
}

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

/** Immutably record a completed module + reflection, bumping the streak (optimistic local update). */
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
