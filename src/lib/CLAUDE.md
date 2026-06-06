# src/lib — functional core

`progress.ts` holds the `Progress` shape + **pure** derivations. `data.ts` is the
Supabase data access layer (content + per-user state). `supabase/` has the
browser/server clients + generated `database.types.ts`. `format.ts` has tiny
string/class helpers (`fmt`, `levelKey`, `barClass`).

## progress.ts rules (pure only)
- `Progress` = `completedModules`, `actionsTried`, `reflections`, `streak`,
  `scores`. No persistence here — state lives in Supabase (see `data.ts`).
- **Derive, don't store:** ring %, streak calendar, module state, the current
  module — all computed. Module-dependent helpers take the fetched module-id list
  (`currentModuleId(completed, moduleIds)`, `planPct(completed, total)`,
  `currentModuleNumber`, `moduleState`); `streakCells`, `completeModule` are pure.
- `emptyProgress()` is the pre-load default (everything zero).

## data.ts rules
- Content fetchers: `fetchModules`, `fetchLockedClusters`,
  `fetchAssessmentQuestions(lang)`, `fetchOnboardingQuestions(lang)`.
- Per-user: `loadProfile`, `loadUserState` (→ `Progress`), `updateProfile`,
  `saveOnboardingAnswers`, `saveAssessmentAnswers`, `saveModuleCompletion`
  (aggregate + per-question `question_attempts` + streak). `computeScores` derives
  per-skill scores from raw answers. All gated by RLS (`user_id = auth.uid()`).
