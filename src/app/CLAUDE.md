# src/app — route entry, layout, global styles

This dir holds the Next.js entry point, the root layout (fonts), and the global
design-system CSS. The actual screens are components in `src/components/` (see its
CLAUDE.md); stateful logic lives in `src/lib/progress.ts`.

## Files
- `layout.tsx` — root layout: loads fonts via `next/font` and applies their
  variable classes to `<html>` (see _Fonts gotcha_), sets `data-theme="evergreen"`
  + metadata, and mounts `<AppProvider>`.
- `providers.tsx` — **all app-wide state**: session, profile, progress, the
  fetched curriculum, language. Lives in the root layout so it survives
  navigation between routes. Views read it with `useApp()`.
- `page.tsx` — the entry gate at `/`: the `intro → auth → firstrun` sequence.
  Once signed in and onboarded it redirects to `/dashboard`.
- `(app)/layout.tsx` — the signed-in shell. Guards the routes (signed-out
  visitors are sent back to `/`) and wraps them in `<AppShell>`.
- `(app)/<view>/page.tsx` — one thin file per view: read from `useApp()`, render
  the component from `src/components/views/`. Keep logic out of these.
- `globals.css` — the design system (see _Design fidelity_).

## Routing
Each view is a real route (`/dashboard`, `/journey`, `/lesson`, `/practice`, …),
mapped in `src/lib/routes.ts` — the single place a `View` and a URL are tied
together. Add a view there, not by hand at the call site. Lessons are linkable:
`/lesson` follows the journey, `/lesson/[moduleId]` opens one by name.

Views still take a `go(view)` callback; `useGo()` in `src/lib/navigation.ts`
implements it with the router, so the views themselves know nothing about it.
Prefer `<Link>` where the thing genuinely is a link — it gives middle-click,
open-in-new-tab and keyboard behaviour for free.

## Design fidelity (important)
`globals.css` is the Claude-design mockup's `app-styles.css`, ported **verbatim**.
Originals: `~/Downloads/lead4wd-claudedesign/`.
- Match the mockup exactly — colours, sizes, spacing, fonts. Don't "improve" it.
- Single evergreen theme; `data-theme="evergreen"` fixed on `<html>`. Use the
  design's exact tokens (`--primary #1C5039`, `--bg #F1ECE0`, `--accent #C7A24E`,
  `--on-primary #F3EFE5`, …). Never invent colours.
- To verify a UI change: copy the three mockup files into `public/_mockup/`,
  screenshot + compare computed styles, then delete the copy.

## Fonts gotcha (caused a real bug)
`globals.css` does `:root { --display: var(--ff-display) … }`; the `--ff-*` vars
come from `next/font`. They MUST be on `<html>` (= `:root`), **not** `<body>` — CSS
custom properties don't inherit upward, so on `<body>` every heading silently falls
back to system fonts. Keep the `.variable` classes on `<html>` in `layout.tsx`.

## Next.js 16
Turbopack is the default bundler. Read `node_modules/next/dist/docs/` before using
framework APIs — this version has breaking changes. `next.config.ts` pins
`turbopack.root` (stray parent-dir lockfile).
