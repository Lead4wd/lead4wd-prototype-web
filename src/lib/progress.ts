// ============================================================================
// Lead4wd — progress model (the functional core)
// ----------------------------------------------------------------------------
// Everything the user "does" lives here: completed lessons, reflections, actions
// tried, active days (for the streak), and assessment scores. Persisted to
// localStorage so progress survives reloads. The dashboard ring/KPIs/streak, the
// journey states, and the skills profile are all DERIVED from this — nothing is
// hard-coded any more.
// ============================================================================

import { CONTENT, DEFAULT_SCORES, type SkillId, type WeekState } from "@/data/content";

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
  activeDates: string[]; // 'YYYY-MM-DD' the user completed something
  scores: Record<SkillId, number>; // from the skills check (or seed defaults)
};

const STORAGE_KEY = "lead4wd_progress_v2";

// The journey structure is identical across languages, so derive ordering once.
const ALL_WEEKS = CONTENT.en.journey.phases.flatMap((p) => p.weeks);
export const UNLOCKED_LESSON_IDS: string[] = ALL_WEEKS.filter((w) => !w.locked).flatMap(
  (w) => w.lessons.map((l) => l.id)
);
export const TOTAL_LESSONS: number = ALL_WEEKS.flatMap((w) => w.lessons).length;

// --- date helpers (local time, so "today" matches the user's calendar) -------
export function isoDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function shiftDays(base: Date, delta: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + delta);
  return d;
}

// --- persistence -------------------------------------------------------------
export function seedProgress(): Progress {
  // Persona "Ananya" starts mid-Week-2: Week 1 done + first Week-2 lesson, with a
  // 5-day streak ending yesterday — so completing today's lesson extends it.
  const today = new Date();
  return {
    completedLessons: ["w1l1", "w1l2", "w1l3", "w2l1"],
    actionsTried: ["w1l1", "w1l2", "w1l3"],
    reflections: {},
    activeDates: [1, 2, 3, 4, 5].map((n) => isoDate(shiftDays(today, -n))),
    scores: { ...DEFAULT_SCORES },
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
      activeDates: parsed.activeDates ?? base.activeDates,
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
  if (ids.every((id) => completed.includes(id))) return "done";
  if (nowLessonId && ids.includes(nowLessonId)) return "now";
  return "next";
}

/** Consecutive active days ending today (with a one-day grace if today is unstarted). */
export function computeStreak(activeDates: string[]): number {
  const set = new Set(activeDates);
  let cursor = new Date();
  if (!set.has(isoDate(cursor))) cursor = shiftDays(cursor, -1);
  let count = 0;
  while (set.has(isoDate(cursor))) {
    count++;
    cursor = shiftDays(cursor, -1);
  }
  return count;
}

export type StreakCell = { label: string; state: "done" | "today" | "todo" };

/** A 7-day window (last 6 days + tomorrow) for the dashboard streak calendar. */
export function streakCells(
  activeDates: string[],
  weekdaysShort: string[],
  todayLabel: string
): StreakCell[] {
  const set = new Set(activeDates);
  const today = new Date();
  const cells: StreakCell[] = [];
  for (let off = -5; off <= 1; off++) {
    const d = shiftDays(today, off);
    const done = set.has(isoDate(d));
    if (off === 0) cells.push({ label: todayLabel, state: done ? "done" : "today" });
    else cells.push({ label: weekdaysShort[d.getDay()], state: done && off < 0 ? "done" : "todo" });
  }
  return cells;
}

/** Immutably record a completed lesson + its reflection + today's activity. */
export function completeLesson(prev: Progress, lessonId: string, reflection: string): Progress {
  const today = isoDate();
  const text = reflection.trim();
  return {
    ...prev,
    completedLessons: prev.completedLessons.includes(lessonId)
      ? prev.completedLessons
      : [...prev.completedLessons, lessonId],
    actionsTried:
      text && !prev.actionsTried.includes(lessonId)
        ? [...prev.actionsTried, lessonId]
        : prev.actionsTried,
    reflections: text ? { ...prev.reflections, [lessonId]: text } : prev.reflections,
    activeDates: prev.activeDates.includes(today)
      ? prev.activeDates
      : [...prev.activeDates, today],
  };
}
