# Lead4wd Prototype — Project Transfer Document

Context and architecture for the **Lead4wd** web app. Hand this to any new AI assistant so they can pick up where we left off.

## Project Overview
Lead4wd is a micro-learning / coaching app for first-time managers: a 1–5 **skills check**, a personalised **12-week journey**, bite-sized **lessons** that each end with one real-world action + reflection, an anonymous **Team Pulse**, and a progress **dashboard**. The product spec lives in the Google Doc "FirstTime Manager_Perplexity".

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack) — note: APIs differ from older Next; read `node_modules/next/dist/docs/` before writing code.
- **Language:** TypeScript / React 19.
- **Styling:** Vanilla CSS design system in `src/app/globals.css` (no Tailwind in use).
- **Fonts:** `next/font/google` — Bricolage Grotesque (display), Hanken Grotesk (body), Space Mono (mono), Noto Sans Devanagari + Noto Sans Telugu (script coverage). Exposed as `--ff-*` CSS variables in `layout.tsx`.
- **Deployment:** Vercel (auto-deploys on push to `master`).
- **Running the toolchain:** the repo lives in WSL **ubuntu**; run everything via `wsl -d ubuntu -e bash -lc "cd ~/lead4wd-prototype-web && npm run dev"` (the linux `node_modules` won't run from Windows).

## Design
The UI is the **evergreen** design from the Claude-design mockup. `src/app/globals.css` is the mockup's `app-styles.css` ported verbatim (evergreen token set only — the oxblood/midnight themes and the theme switcher were removed per the brief), with the font tokens mapped onto the `--ff-*` variables that `layout.tsx` loads via `next/font`. `data-theme="evergreen"` is fixed on `<html>`. Match the mockup exactly when editing; the original design files are in `~/Downloads/lead4wd-claudedesign/`. The old dark quiz UI was fully replaced.

## Architecture & Data Flow

### File structure
- `src/app/page.tsx` — thin root: the `ONBOARDING → AUTH (dummy login) → APP` state machine, owns persisted `language` + `progress`, renders the entry screens or the shell.
- `src/components/` — `Onboarding`, `Auth`, `AppShell` (sidebar + topbar + view routing, owns `view`), `icons`, and `views/` (`Dashboard`, `Journey`, `Lesson`, `Assessment`, `SkillsProfile`, `TeamPulse`).
- `src/lib/progress.ts` — **the functional core** (see below). `src/lib/format.ts` — `fmt`/`levelKey`/`barClass` helpers.
- `src/data/content.ts` — all copy + i18n + skill model.

### Content & i18n (`src/data/content.ts`)
All copy is localised in **English, Hindi, and Telugu** under `CONTENT: Record<LanguageCode, Content>`. The `Content` type covers nav, dashboard, journey, lesson, assessment, results, team, onboarding, and auth. Language switches live from the topbar dropdown. Journey weeks/lessons carry stable `id`s and a `locked` flag; their done/now/locked **state is derived at runtime**, not stored. Also exports the skill model: `SKILL_ORDER`, `DEFAULT_SCORES`, `levelFromScore`, `pctFromScore`.

### Progress model (`src/lib/progress.ts`)
The single source of "what the user has done": `completedLessons`, `actionsTried`, `reflections`, `activeDates` (for the streak), and assessment `scores`. Persisted to `localStorage` (`lead4wd_progress_v2`) and restored on mount with a hydration guard so the seed never clobbers stored data. Everything the dashboard/journey shows is **derived** from this — `planPct`, `computeStreak`, `streakCells`, `currentLessonId`, `lessonState`, `weekState`. New users get `seedProgress()` (persona mid-Week-2 with a 5-day streak); completing a lesson (`completeLesson`) advances the journey, saves the reflection, counts the action, and extends the streak. Language also persists (`lead4wd_lang`); the entry flow itself starts at onboarding each load (prototype behaviour).

## Key Features
- **Skills check → personalisation:** 15 behavioural questions (3 × 5 skills) on a 1–5 scale; averages map to Focus / Developing / Strength and seed the Skills Profile + "this week's focus".
- **Journey:** two phases of weekly themes, with done / in-progress / locked states and a Resume CTA on the active week.
- **Lesson:** reading lesson + one action card + private reflection textarea; "Mark complete" marks the current journey lesson done, saves the reflection, counts the action, and extends the streak. An "all caught up" state shows once every unlocked lesson is done.
- **Functional progress:** the ring %, lessons/actions KPIs, streak count + calendar, and journey states are all real and persist across reloads (localStorage). Nothing here is dummy.
- **Team Pulse:** anonymous aggregate scores, a bar chart, "what changed" deltas, and verbatim quotes (illustrative content).
- **Tri-lingual UI** with correct Devanagari/Telugu rendering via Noto fonts.

## Known Limitations & Future Work
- No backend — progress persists in the browser (`localStorage`) but not across devices; no real auth.
- One lesson is fully authored ("Name the behaviour"); the lesson view completes the current journey lesson in sequence. Team Pulse numbers are illustrative.
- Content breadth: the journey shows a representative slice of the 21-module library described in the docs, not every module's full script.

## How to Resume
1. Read this doc and the design intent above.
2. `src/app/page.tsx` + `src/components/` — entry flow, app shell, and the six views.
3. `src/lib/progress.ts` — the functional progress model (start here for anything stateful).
4. `src/data/content.ts` — all content + the 3-language dictionary + skill model.
5. `src/app/globals.css` — the evergreen design system (the mockup's `app-styles.css`, verbatim).
6. Run: `wsl -d ubuntu -e bash -lc "cd ~/lead4wd-prototype-web && npm run dev"` (or use the `.claude/launch.json` "web" config with the preview tools).
