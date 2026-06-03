# src/app — route entry, layout, global styles

This dir holds the Next.js entry point, the root layout (fonts), and the global
design-system CSS. The actual screens are components in `src/components/` (see its
CLAUDE.md); stateful logic lives in `src/lib/progress.ts`.

## Files
- `page.tsx` — thin `"use client"` root: the `ONBOARDING → AUTH → APP` state
  machine; owns persisted `language` + `progress`; renders the entry screens or
  `<AppShell>`. Keep view/UI logic out of here.
- `layout.tsx` — loads fonts via `next/font` and applies their variable classes to
  `<html>` (see _Fonts gotcha_). Sets `data-theme="evergreen"` + metadata.
- `globals.css` — the design system (see _Design fidelity_).

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
