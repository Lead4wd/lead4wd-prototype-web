# src/components — the screens

`AppShell` is the signed-in chrome — sidebar, topbar, account modal — and renders
the routed view as `children`. It does NOT choose the view: the URL does (see
`src/app/CLAUDE.md` → Routing). `views/` holds the views; `Onboarding` / `Auth`
are the entry screens; `icons.tsx` has the shared inline SVGs.

## Conventions
- Each view's root is `<section className="view on">` — CSS hides a bare `.view`,
  so the `on` is required.
- **All copy comes from `CONTENT[language]`** (`@/data/content`), passed in as `c`.
  Never hard-code user-facing strings; add them to the content model in all three
  languages.
- Topbar title = `c.pageTitles[view]`, where `view` is derived from the pathname
  by `viewFromPathname` — intentionally different from the sidebar labels `c.nav`
  (matches the mockup's `app.js`).
- A failed fetch is not an empty result. The data layer returns `null` when a
  request fails; show `<LoadError>` rather than a zeroed state, which reads to a
  user as "my work is gone".
- Skill level → bar fill: strength = `good`, developing = `acc`, focus = default
  (no class), via `barClass` in `@/lib/format`. Badges use `lv-*` / `lvt-*`.
- Components are presentational: anything stateful (completion, streak, scores)
  flows through `@/lib/progress` — receive `progress` + callbacks as props, don't
  read/write localStorage here.
- Match the mockup exactly (see `src/app/CLAUDE.md` → Design fidelity).
