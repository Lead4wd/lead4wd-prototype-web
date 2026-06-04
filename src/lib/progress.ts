// ============================================================================
// Lead4wd — progress model (the functional core)
// ----------------------------------------------------------------------------
// Everything the user "does" lives here: completed lessons, reflections, actions
// tried, the streak counter, and assessment scores. Persisted to localStorage so
// progress survives view navigation. Each login starts from scratch (see
// seedProgress + page.tsx). The dashboard ring/KPIs/streak and the journey/skills
// states are all DERIVED from this — nothing is hard-coded.
// ============================================================================

import { CONTENT, SKILL_ORDER, type SkillId, type WeekState } from "@/data/content";

export type View =
  | "dashboard"
  | "journey"
  | "lesson"
  | "results"
  | "team"
  | "assessment";

export type Progress = {
  completedLessons: string[]; // lesson ids
  actionsTried: string[]; // lesson ids where a reflection was written
  reflections: Record<string, string>; // lessonId -> text
  streak: number; // "functional dummy" — +1 per completed lesson
  scores: Record<SkillId, number>; // from the skills check (0 until taken)
};

const STORAGE_KEY = "lead4wd_progress_v3";

// The journey structure is identical across languages, so derive ordering once.
const ALL_WEEKS = CONTENT.en.journey.phases.flatMap((p) => p.weeks);
export const UNLOCKED_LESSON_IDS: string[] = ALL_WEEKS.filter((w) => !w.locked).flatMap(
  (w) => w.lessons.map((l) => l.id)
);
export const TOTAL_LESSONS: number = ALL_WEEKS.flatMap((w) => w.lessons).length;

const zeroScores = (): Record<SkillId, number> =>
  SKILL_ORDER.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as Record<SkillId, number>);

// --- persistence -------------------------------------------------------------
/** A brand-new, from-scratch user: nothing done, no scores yet, streak 0. */
export function seedProgress(): Progress {
  return {
    completedLessons: [],
    actionsTried: [],
    reflections: {},
    streak: 0,
    scores: zeroScores(),
  };
}

export function loadProgress(): Progress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const base = seedProgress();
    return {
      completedLessons: parsed.completedLessons ?? base.completedLessons,
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
/** First unlocked lesson the user hasn't completed (the "now" lesson), or null. */
export function currentLessonId(completed: string[]): string | null {
  const set = new Set(completed);
  return UNLOCKED_LESSON_IDS.find((id) => !set.has(id)) ?? null;
}

export function planPct(completed: string[]): number {
  return Math.round((completed.length / TOTAL_LESSONS) * 100);
}

export function currentWeekNumber(nowLessonId: string | null): number {
  if (!nowLessonId) return ALL_WEEKS.length;
  const idx = ALL_WEEKS.findIndex((w) => w.lessons.some((l) => l.id === nowLessonId));
  return idx >= 0 ? idx + 1 : 1;
}

export function lessonState(
  id: string,
  completed: string[],
  nowLessonId: string | null
): "done" | "now" | "todo" {
  if (completed.includes(id)) return "done";
  if (id === nowLessonId) return "now";
  return "todo";
}

export function weekState(
  week: { locked?: boolean; lessons: { id: string }[] },
  completed: string[],
  nowLessonId: string | null
): WeekState {
  if (week.locked) return "locked";
  const ids = week.lessons.map((l) => l.id);
  if (ids.length && ids.every((id) => completed.includes(id))) return "done";
  if (nowLessonId && ids.includes(nowLessonId)) return "now";
  return "next";
}

export type StreakCell = { label: string; state: "done" | "today" | "todo" };

/** A 7-cell calendar that fills as the streak grows. */
export function streakCells(
  streak: number,
  weekdaysShort: string[],
  todayLabel: string
): StreakCell[] {
  const cells: StreakCell[] = [];
  for (let i = 0; i < 7; i++) {
    const state: StreakCell["state"] = i < streak ? "done" : i === streak ? "today" : "todo";
    cells.push({ label: state === "today" ? todayLabel : weekdaysShort[i % 7], state });
  }
  return cells;
}

/** Immutably record a completed lesson + its reflection, and bump the streak. */
export function completeLesson(prev: Progress, lessonId: string, reflection: string): Progress {
  const text = reflection.trim();
  const alreadyDone = prev.completedLessons.includes(lessonId);
  return {
    ...prev,
    completedLessons: alreadyDone ? prev.completedLessons : [...prev.completedLessons, lessonId],
    actionsTried:
      text && !prev.actionsTried.includes(lessonId)
        ? [...prev.actionsTried, lessonId]
        : prev.actionsTried,
    reflections: text ? { ...prev.reflections, [lessonId]: text } : prev.reflections,
    // Functional dummy streak: each newly completed lesson counts as a "day".
    streak: alreadyDone ? prev.streak : prev.streak + 1,
  };
}
