# Phase A — Setup, fonts, tokens, base layout, agent workflow

**Branch:** `phase-a_setup_Rezki` (cut from `main` = first scaffold commit `83c5081`)
**Status:** ready for owner review

## Goal
Lay the foundation every later phase builds on: the real Figma fonts and design tokens,
the atomic folder structure, the shared header and page skeleton, and the agent workflow
(requirements, rules, QA, review, progress logs).

## What we agreed
- Follow the PDF strictly; Figma wins where the PDF defers to it; WCAG AA only where the design is silent.
- Fonts from Figma (Bagoss + Söhne), not Graphik.
- Atomic structure, `index.tsx` + `index.module.css` per component, Vue 3 comments everywhere.
- Desktop (≥1024px) is our own two-column design.
- `AGENTS.md` + `CLAUDE.md` + three agents (engineer, qa, code-reviewer).
- See `docs/decisions.md` for the full list.

## What was built
| File | What it is | Atomic level |
|---|---|---|
| `src/fonts/BagossStandard-Regular.woff2` | Bagoss pinned to Standard Regular, Latin subset (23 KB) | — |
| `src/fonts/Sohne-Buch.woff2` | Söhne Buch, Latin subset (19 KB) | — |
| `src/styles/tokens.css` | All Figma values as CSS variables | — |
| `src/app/globals.css` | Reset, base typography, focus ring, helpers | — |
| `src/app/layout.tsx` | Root layout: fonts, title template | route |
| `src/app/page.tsx` + `page.module.css` | Placeholder homepage (headline only) | route |
| `src/lib/cx.ts` | Joins class names (≈ Vue's `:class` array syntax) | helper |
| `src/components/atoms/Logo` | Wordmark exported from Figma, inline SVG | atom |
| `src/components/atoms/Icon` | Back arrow + restart icons | atom |
| `src/components/atoms/IconButton` | 46px round glass button (link or button) | atom |
| `src/components/organisms/AppHeader` | back · logo · restart | organism |
| `src/components/templates/ScreenLayout` | header / media / content / actions skeleton | template |
| `AGENTS.md`, `CLAUDE.md`, `.claude/agents/*` | Rules + the three agent roles | — |
| `docs/requirements.md`, `docs/decisions.md`, `docs/progress/*` | Requirements with IDs, decisions, logs | — |

Removed: `components/AppHeader`, `components/Screen` (flat structure), `Graphik-Regular.woff2`,
`public/juicebox-logo.svg` (hand-drawn, replaced by the Figma export).

## Figma values used (for QA)
| Element | Figma |
|---|---|
| Background | `#0C0D10`, radial glow `#222737` from the top |
| Header | 390 × 86, side padding 20, space-between |
| Logo | 123 × 29, `#FAFAFA` |
| Icon button | 46 × 46, round, `#FFFFFF` 5%, background blur, shadow 0 4 20 `#000` 5% |
| Home headline | Bagoss 28px / 120%, letter-spacing 1%, centred, "technology" `#CDAAFF` |
| Body text | Söhne Buch 16px / 135%, letter-spacing 2% |

## How it works — in Vue 3 terms
- **`layout.tsx` ≈ `App.vue` + `index.html`.** `children` is the current page, like `<router-view />`.
  It's a Server Component: rendered on the server, no JavaScript sent for it.
- **`next/font/local` ≈ an `@font-face` in `app.scss`**, but Next self-hosts, preloads and exposes
  each font as a CSS variable (`--font-bagoss`, `--font-sohne`) that `tokens.css` reads.
- **`metadata.title.template` ≈ `router.afterEach(() => document.title = …)`**: each route sets
  only its own title and gets " | juicebox" added.
- **CSS Modules (`index.module.css`) ≈ `<style scoped>`**: class names are made unique per file;
  you use them as `styles.header` instead of `class="header"`.
- **Props ≈ `defineProps`**, typed with a TypeScript `type`. A callback prop like `onClick`
  ≈ `emit('click')`.
- **`ScreenLayout` slots:** `children` ≈ default `<slot />`; `media` and `actions` are props that
  hold JSX ≈ `<slot name="media" />` / `<slot name="actions" />`.
- **`IconButton`** renders `<Link>` (≈ `<RouterLink>`) when it gets `href`, else a `<button>` —
  the React version of `<component :is="…">`.
- **`BackAction` union** (`{ href } | { onClick }`) ≈ a prop validator that accepts one of two shapes.

## Requirement IDs covered
TR-1, TR-2 (tokens), TR-3 (reusable header/layout), OB-1, OB-2, OB-3, OB-4 (layout hook), OB-6, OB-7,
A11Y-8 (lang, title template), A11Y-3 (focus ring).

## Checks
- **typecheck / lint / build:** ✅ all pass (re-run after review fixes)
- **QA (`qa` agent): ✅ pass, 0 bugs.**
  - Header 390 × 86, padding 20; logo 123 × 29 centred, `#FAFAFA`; icon button 46 × 46, 5% white, blur, shadow.
  - Headline in Bagoss 28px / 33.6px, 1%, "technology" `rgb(205,170,255)`; body in Söhne 16px / 135%, 2%.
  - Keyboard: Tab → "Start over", 2px `#CDAAFF` ring; Enter navigates home.
  - Accessibility tree: logo = img "juicebox", link "Start over", one `<h1>`, `lang="en"`, title set.
  - axe-core 4.10.2: **0 violations** (contrast "incomplete" only because of the gradient background).
  - No horizontal scroll at 320 / 390 / 768 / 1024 / 1440; no console errors or hydration warnings.
  - Note applied: `<html>` now has the page colour (no white flash on over-scroll).
- **Code review (`code-reviewer` agent): approve with minor fixes — 0 blockers, 0 majors.** Fixed:
  - `NavAction` is now a true either/or (`href` *or* `onClick`, never both), shared by IconButton and AppHeader.
  - Note on IconButton: `onClick` may only be passed from a `'use client'` component.
  - Hover only on devices that can hover (`@media (hover: hover)`).
  - New tokens: `--bg-glow-size`, `--focus-ring-width`, `--focus-ring-offset`; `--color-focus` reuses `--color-primary-light`.
  - Reduced motion for CSS handled in one place (globals.css).
  - `cx()` helper in `src/lib/cx.ts` replaces 3 copies of template-string class joining.
  - `import type { ReactNode }` instead of the global `React.ReactNode`.
  - Deferred to phase d: "Start over" may need to clear the saved form data (decide then: clear on
    homepage load vs. a restart callback).
  - Not changed: icon `size = 20` default (icons will be re-exported from Figma, see open points).

## Known gaps (do not report)
- No Lottie, GSAP, Lenis, buttons, walkthrough, form or results yet (phases b–e).
- Homepage `<h1>` is a placeholder; the real hero is phase b.
- Back/restart icons are the scaffold's hand-drawn versions, not exported from Figma yet.

## Open points for the owner
- Export the back and restart icons from Figma too (2 more downloads)?
