# src/data — content & i18n

`content.ts` is the trilingual UI-chrome copy + skill model. (Runtime state lives
in Supabase via `@/lib/data`, not here.)

> **Now backed by Supabase:** the learning **modules** + the **assessment /
> onboarding questions** are served from the DB at runtime. `modules.ts` and the
> `onboarding.questions` / `assessment.questions` arrays here are kept as the
> **seed source** only — `scripts/dump-content.ts` regenerates `supabase/seed.sql`
> from them. The app no longer reads modules/questions from code.

## Shape
- `CONTENT: Record<LanguageCode, Content>` — every UI string, keyed by language
  (`en` / `hi` / `te`). The `Content` type is the contract.
- `SKILL_ORDER`, `DEFAULT_SCORES`; helpers `levelFromScore`, `pctFromScore`.

## Rules
- **3-language parity:** anything added to `en` goes in `hi` and `te` too. Update
  the `Content` type first — TS then forces every language to fill it.
- **Parallel arrays stay aligned:** assessment questions, journey weeks/lessons,
  and scale options must match length + order across languages. Assessment scoring
  reads the question→skill map by index from `CONTENT.en`.
- Journey weeks/lessons carry stable `id`s + a `locked` flag; their done/now state
  is derived in `@/lib/progress`, **not** stored here.
- Hindi = Devanagari, Telugu = Telugu (Noto fonts via layout). Templated strings
  use `{n}` / `{week}` / `{pct}` placeholders, filled by `fmt`.
- Skill levels are derived (`levelFromScore`: ≥ 3.8 strength, ≥ 2.6 developing,
  else focus) — don't duplicate the thresholds.
