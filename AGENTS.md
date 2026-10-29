<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# juicebox assessment — rules for every AI agent

A mobile-first Next.js app built from the Juicebox Frontend Developer Assessment:
**Home → Walkthrough → Form → Results**. The owner is a senior **Vue 3** developer
who must be able to explain every line in an interview.

**Read first:** [`docs/requirements.md`](docs/requirements.md) — every requirement has
an ID (`R-*`, `TR-*`, `EC-*`, `A11Y-*`, `OB-*`). Work, QA and review all refer to those IDs.

## Precedence
1. The PDF, strictly. Where it says "match the Figma", the Figma wins.
2. WCAG 2.2 AA only where the design is silent. Gaps → README remarks.
3. Decisions log: [`docs/decisions.md`](docs/decisions.md).

## Stack
Next.js 16 (App Router) · React 19 · TypeScript strict · CSS Modules + CSS variables ·
GSAP (+ `@gsap/react`) · Lenis · lottie-web · Swiper · Zustand (state). No other UI libraries.

## Folder structure (atomic design)
```
src/
  app/                    routes (≈ Vue pages/) — the ONLY place that reads shared state
  components/
    atoms/                know nothing about the app (Button, IconButton, Logo, Icon, LottiePlayer)
    molecules/            combine atoms (TextInput, FormStep)
    organisms/            full sections (AppHeader, WalkthroughSlider, MultiStepForm)
    templates/            page skeletons with slots (ScreenLayout)
  store/                  shared state, Zustand, one PascalCase folder per store (≈ Pinia): index / state / actions
  hooks/                  shared hooks (≈ composables/)
  lib/                    pure helpers (≈ helper/)
  providers/              app-wide client wrappers (SmoothScroll)
  styles/tokens.css       design tokens (≈ sass/_variables.scss)
  fonts/                  self-hosted woff2
```
- A component is a folder: `index.tsx` + `index.module.css`.
- Folder with no sub-folders → **PascalCase** (`Button/`); folder with sub-folders → **camelCase** (`atoms/`).
- Lower levels only take props and call callbacks (≈ `emit`). Never reach up a level.
- Max 1000 lines per file.

## Code rules
- **No hard-coded design values.** Colours, sizes, spacing, radii, fonts, motion → `var(--token)`.
  A value that is not in Figma gets a `/* Not in Figma: … */` comment.
- **Mobile first.** Desktop only inside `@media (min-width: 1024px)` blocks, at the end of the module.
- **Vue 3 comments (required):** every file starts with a header comment saying what it is and
  its Vue 3 equivalent; every component/function has a one-line comment; non-obvious hooks get
  an inline Vue mapping (`useState ≈ ref`, `useEffect ≈ onMounted/watch`, props ≈ `defineProps`,
  callback props ≈ `emit`, `children` ≈ default slot, Zustand store ≈ Pinia).
- `'use client'` only on components that need state, effects or browser APIs.
- Animations: create inside `useGSAP()` / `useEffect()` and clean up on unmount;
  all of GSAP, Lottie and Lenis respect `prefers-reduced-motion`.
- Semantic HTML first; ARIA only when HTML can't express it.
- DRY, but no speculative abstraction: extract when something is used twice.
- TypeScript: no `any`, explicit prop types.
- **No regular expressions** anywhere in `src/` (owner's rule): use plain string methods
  (`split`, `includes`, `indexOf`, `trim`) or the browser's built-in validation instead.

## Definition of done (per phase)
`npm run typecheck`, `npm run lint`, `npm run build` all pass · QA report: pass per requirement ID ·
Code review: no open blocker/major · progress log updated in `docs/progress/`.
