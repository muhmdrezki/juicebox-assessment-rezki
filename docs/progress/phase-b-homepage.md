# Phase B — Homepage (Lottie + GSAP + Lenis)

**Branch:** `phase-b_homepage_Rezki` (cut from `phase-a_setup_Rezki` @ `bbf30bb`)
**Status:** ready for owner review

## Goal
Build Figma "Step 1": the animated hexagon with floating statements, the headline and the
purple "Get a reality check" button — with Lottie, GSAP and Lenis as the PDF requires.

## What we agreed
- Option A: GSAP intro on load + Lenis for the whole app (button visible immediately).
- Floating labels are decorative → hidden from screen readers.
- Button goes to `/walkthrough` (Figma prototype); README remark because the PDF says "form section".
- Assets from Figma whenever possible (icons, hexagon artwork).
- Found during the build: the supplied Lottie is a **flat** `#B488F2` hexagon, the Figma hexagon is a
  gradient image on that shape → the Lottie plays, then GSAP cross-fades into the Figma artwork.

## What was built
| File | What it is | Level |
|---|---|---|
| `src/components/atoms/Button` | 350 × 60 button, variants `primary` / `outline` / `light`; link or button | atom |
| `src/components/atoms/LottiePlayer` | Loads lottie-web (light build) in the browser, plays N times, rests; destroyed on unmount | atom |
| `src/components/atoms/Reveal` | GSAP fade + rise on mount, with `delay` | atom |
| `src/components/atoms/Icon` | Back + restart icons, now the exact Figma exports | atom |
| `src/components/organisms/HeroAnimation` | Lottie → artwork, 5 labels at Figma positions, one GSAP timeline | organism |
| `src/providers/SmoothScroll` | Lenis for the app, driven by GSAP's ticker; off with reduced motion | provider |
| `src/lib/gsap.ts` | Registers `useGSAP` once, re-exports `gsap` | helper |
| `src/lib/motion.ts` | Reduced-motion media queries + `prefersReducedMotion()` | helper |
| `src/lib/nav.ts` | Shared `LinkAction` / `ClickAction` / `NavAction` prop types | helper |
| `src/app/page.tsx` + `page.module.css` | Homepage: fills ScreenLayout's media / default / actions slots | route |
| `src/app/layout.tsx`, `globals.css` | `<SmoothScroll>` wrapper, `[data-reveal]` start-hidden rule + `<noscript>` fallback | — |
| `public/images/hexagon.png` | Figma hexagon artwork, 548 × 580 (2×), served as WebP/AVIF by next/image | asset |

## Measured against Figma (390 × 665 = iPhone viewport between the Safari bars)
| Element | Figma | Built |
|---|---|---|
| Header | 0, 0, 390 × 86 | 0, 0, 390 × 86 |
| Hexagon | 58, 113, 274 × 290 | 58, 113, 274 × 290 |
| Labels (left/top) | 20,131 · 224,171 · 20,233 · 142,296 · 20,358 | 20,131 · 222,171 · 20,233 · 141,296 · 20,358 |
| Headline | ~434, 346 wide, 3 lines | 432, 350 box, 3 lines |
| Button | 20, 581, 350 × 60 | 20, 581, 350 × 60 |

## How it works — in Vue 3 terms
- **`'use client'`**: Next renders everything on the server by default. Components that need effects,
  state or `window` opt in to the browser with this line. Vue has no such split. The page itself stays
  a server component; only `HeroAnimation`, `Reveal`, `LottiePlayer` and `SmoothScroll` are client.
- **`useRef` ≈ a template ref** (`ref="root"` / `const root = ref(null)`): `root.current` is the DOM node.
- **`useEffect(fn, deps)` ≈ `onMounted` + `watch(deps)`**; the function `fn` returns ≈ `onUnmounted`.
  `LottiePlayer` loads lottie-web there and calls `anim.destroy()` in the cleanup.
- **`useGSAP()` ≈ `onMounted` whose GSAP animations are auto-reverted on unmount** (no leaks).
  `gsap.matchMedia()` runs the animation only when the user hasn't asked for reduced motion.
- **Dynamic `import()`** inside the effect ≈ `defineAsyncComponent`/lazy import: lottie-web is only
  downloaded in the browser, after the page shows.
- **`SmoothScroll` ≈ a plugin in `main.js`**: it wraps `{children}` in the root layout, so every page
  gets Lenis; Lenis's `raf` is driven by `gsap.ticker` so both share one animation frame.
- **Slots:** the homepage passes `media={<HeroAnimation />}` and `actions={<Button …/>}` ≈
  `<template #media>` / `<template #actions>`.
- **`LABELS.map(...)` with `key` ≈ `v-for … :key`.**

## Requirement IDs covered
R-HOME-1 (Lottie), R-HOME-2 (GSAP timeline + Reveal), R-HOME-3 (Lenis), R-HOME-4 (button → walkthrough),
R-HOME-5 (real link, visible focus, accessible name), TR-2, TR-3, TR-5, EC-3, EC-5, EC-6, EC-7,
A11Y-11 (Lottie plays once, ≤ 5 s motion), A11Y-12 (reduced motion: GSAP off, Lottie hidden, Lenis off),
A11Y-13 (hero `aria-hidden`), OB-3, OB-4 (desktop two columns, hero ×1.35), OB-5 (cleanup).

## Checks
- **typecheck / lint / build:** ✅ pass (re-run after review fixes)
- **QA (`qa` agent): ✅ pass, 0 bugs.**
  - All elements within ±2px of Figma at 390 × 665; fonts/colours/radius exact; gradient artwork in the final frame.
  - Lottie visible first, then cross-fades into the artwork; headline + button rise in; nothing moves after ~5 s.
  - Tab order Start over → Get a reality check; focus ring visible; hero `aria-hidden`; one `<h1>`.
  - axe-core: **0 violations** (contrast "incomplete" only on text over gradients).
  - No horizontal scroll 320–1440; two columns at ≥ 1024; one Lottie instance after reloads; no console errors.
  - ⚠️ Reduced motion could not be emulated in this browser setup → **owner to check manually**
    (DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", then reload).
- **Code review (`code-reviewer` agent): changes required → fixed.**
  - [major] Content could stay invisible if JS loads but fails → CSS safety net shows any `[data-reveal]`
    element GSAP never took over after 2.5 s.
  - [major] Cross-fade was on a fixed 2 s timer → now runs when the Lottie reports `onComplete`
    (≈ `emit('complete')`), with a 4 s fallback if the Lottie is slow or fails.
  - Reduced motion: LottiePlayer now downloads nothing at all.
  - Label positions in rem (grow with the user's font size).
  - Headline / button delays 1.1 s / 1.4 s → 0.4 s / 0.6 s.
  - `NavAction` / `LinkAction` types moved to `src/lib/nav.ts`, shared by Button and IconButton.
  - Desktop hero uses `zoom` (layout box grows) instead of `transform: scale` (overflowed its cell).
  - Lottie fetch checks `res.ok`; all GSAP targets use `[data-hero]` selectors.

## Known gaps (do not report)
- `/walkthrough` doesn't exist yet (phase c) → the button currently leads to Next's 404 page.
- Lenis has nothing to scroll on the homepage at phone size (one screen); it is active app-wide.
- Exact grey of the walkthrough text, form icons: later phases.

## Open points for the owner
- An empty `package-lock.json` exists one folder up (`E:\code\juicebox-assessment\`), created 14:16
  (not by this repo). It makes Next print a "workspace root" warning. OK to delete it?
