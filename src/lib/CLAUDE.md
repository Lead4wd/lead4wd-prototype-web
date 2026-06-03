# src/lib — functional core

`progress.ts` is the single source of "what the user has done" and every derived
number the UI shows. `format.ts` has tiny string/class helpers (`fmt`, `levelKey`,
`barClass`).

## progress.ts rules
- State shape: `completedLessons`, `actionsTried`, `reflections`, `activeDates`
  (streak), `scores`. Persisted to `localStorage` key `lead4wd_progress_v2`.
- **Derive, don't store:** ring %, streak count + calendar, journey week/lesson
  states, and the current lesson are all computed (`planPct`, `computeStreak`,
  `streakCells`, `currentLessonId`, `lessonState`, `weekState`). Don't cache them
  in the content model or component state.
- Journey ordering comes from `CONTENT.en.journey` (structure is identical across
  languages); lessons are keyed by stable `id`.
- Updates are immutable — `completeLesson` returns a new object. `page.tsx`
  persists with a hydration guard so the seed never overwrites stored data.
- `seedProgress()` is the persona's starting state (mid-Week-2, 5-day streak);
  change it intentionally.
