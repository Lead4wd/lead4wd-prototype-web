# src/components — the screens

`AppShell` owns the active `view` and renders the sidebar/topbar + one view at a
time. `views/` holds the six views; `Onboarding` / `Auth` are the entry screens;
`icons.tsx` has the shared inline SVGs.

## Conventions
- Each view's root is `<section className="view on">` — CSS hides a bare `.view`,
  so the `on` is required.
- **All copy comes from `CONTENT[language]`** (`@/data/content`), passed in as `c`.
  Never hard-code user-facing strings; add them to the content model in all three
  languages.
- Topbar title = `c.pageTitles[view]` — intentionally different from the sidebar
  labels `c.nav` (matches the mockup's `app.js`).
- Skill level → bar fill: strength = `good`, developing = `acc`, focus = default
  (no class), via `barClass` in `@/lib/format`. Badges use `lv-*` / `lvt-*`.
- Components are presentational: anything stateful (completion, streak, scores)
  flows through `@/lib/progress` — receive `progress` + callbacks as props, don't
  read/write localStorage here.
- Match the mockup exactly (see `src/app/CLAUDE.md` → Design fidelity).
