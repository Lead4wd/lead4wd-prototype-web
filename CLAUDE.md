# Lead4wd — project guide

Micro-learning / coaching web app for first-time managers: a 1–5 skills check, a
personalised 12-week journey, daily micro-lessons, and an anonymous team pulse.
**Prototype** with a **Supabase** backend (Postgres + Auth + RLS): real
email/password accounts, per-user progress, and the modules + skills-check
questions served from the DB. UI chrome copy stays in the trilingual content model.

This file holds rules that apply **everywhere**. Module-specific guidance lives in
nested `CLAUDE.md` files (see _Where things live_). The full architecture and
feature walkthrough is in `transfer.md` — read it when you need the whole picture;
it is intentionally **not** auto-loaded.

## Stack
- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict)
- Plain-CSS design system in `src/app/globals.css` — no Tailwind, no CSS-in-JS
- Fonts via `next/font`; deployed on Vercel
- **Supabase** (Postgres + Auth + RLS) via `@supabase/ssr` — cookie sessions
  (persist across tab close). `src/proxy.ts` is Next 16's renamed `middleware`
  and refreshes the session. Env: `NEXT_PUBLIC_SUPABASE_URL` / `..._ANON_KEY`.
- Import alias: `@/*` → `src/*`

## Commands
- Dev: `npm run dev`
- Build: `npm run build` ← also runs typecheck + lint; use it to verify changes
- Lint: `npm run lint`

> **Environment note (this machine):** the repo lives in the WSL **ubuntu** distro
> and `node_modules` are Linux binaries, so the toolchain must run inside it — it
> won't work from Windows. Run commands as:
> `wsl -d ubuntu -e bash -lc "cd ~/lead4wd-prototype-web && <command>"`
> (or use the `.claude/launch.json` "web" config for the dev server).

## Code style
- TypeScript strict: type props and exports; avoid `any`.
- Functional React components. Add `"use client"` only where state, effects, or
  browser APIs are needed.
- Styling: add classes to `globals.css`. Use inline `style={{…}}` only for one-off
  values (mirroring the design's own inline styles). No utility-class frameworks.
- **No hard-coded user-facing copy in components** — it belongs in the content
  model (`src/data/`), translated into all three languages.
- 2-space indent, double quotes, semicolons (match existing files / ESLint).

## Verify your work
Run `npm run build` after changes. For any UI change, also run the app and compare
against the design mockup — see `src/app/CLAUDE.md`.

## Where things live
- `src/app/` — route entry, root layout (fonts), global design-system CSS → `src/app/CLAUDE.md`
- `src/components/` — the screens (entry, shell, six views) → `src/components/CLAUDE.md`
- `src/lib/` — `progress.ts` (functional state) + `format.ts` helpers → `src/lib/CLAUDE.md`
- `src/data/` — content + 3-language i18n + skill model → `src/data/CLAUDE.md`
- `transfer.md` — full architecture & feature walkthrough (manual reference)
- `node_modules/next/dist/docs/` — authoritative Next.js 16 docs (read before
  using framework APIs; this version has breaking changes)

@AGENTS.md
