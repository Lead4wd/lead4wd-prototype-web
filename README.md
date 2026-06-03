# Lead4wd

A "coach in your pocket" web app for first-time managers. It pairs a short 1–5
**skills check** with a personalised **12-week journey** of bite-sized lessons —
each ending in one real-world action and a private reflection — plus a progress
**dashboard** (streak, plan %, skill levels) and an anonymous **Team Pulse**.

This is a front-end prototype: all data is mock and stored in the browser
(`localStorage`); there's no backend yet. The UI ships in **English, Hindi, and
Telugu**.

## Tech
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- Plain-CSS design system (`src/app/globals.css`) — the evergreen "Claude-design"
  mockup ported verbatim
- Fonts via `next/font` (Bricolage Grotesque / Hanken Grotesk / Space Mono, with
  Noto Sans Devanagari + Telugu)

## Getting started
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also typechecks + lints)
```

> On Windows + WSL: this repo runs inside the WSL **ubuntu** distro, so run the
> toolchain there, e.g.
> `wsl -d ubuntu -e bash -lc "cd ~/lead4wd-prototype-web && npm run dev"`.

## Project layout
```
src/
  app/          route entry (page.tsx), root layout + fonts, globals.css
  components/    Onboarding, Auth, AppShell, and views/ (the six screens)
  lib/           progress.ts (functional state + persistence) · format.ts
  data/          content.ts (all copy + 3-language i18n + skill model)
```

See `transfer.md` for the full architecture walkthrough, and the per-directory
`CLAUDE.md` files for module-specific conventions.

## Deploy
Auto-deploys to Vercel on push to `master`.
