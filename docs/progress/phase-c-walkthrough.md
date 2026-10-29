# Phase C — Walkthrough (Swiper)

**Branch:** `phase-c_walkthrough_Rezki` (cut from `phase-b_homepage_Rezki` @ `ad15347`)
**Status:** ready for owner review

## Goal
Build Figma "Step 2.1" × 3: a swipeable three-slide tutorial with Swiper.js, progress dots,
"Continue" on slides 1–2 and "Get started" on slide 3, which opens the form.

## What we agreed
- Text "lights up" word by word (GSAP), from Figma's dimmed white to full white (option a).
  Measured from a Figma export: the dim colour is `#FAFAFA` at **50%**, applied per character.
- Only the text slides; hexagon, dots and button stay in place.
- Dots: progress indicator only (not clickable), Figma's 25% white kept.
- Back: previous slide, or home from slide 1.

## What was built
| File | What it is | Level |
|---|---|---|
| `src/components/atoms/HexagonArt` | Figma hexagon artwork, fills its parent (now shared with the home hero) | atom |
| `src/components/atoms/Dots` | Progress dots, `aria-hidden` | atom |
| `src/components/atoms/HighlightText` | Paragraph split into words; GSAP brightens them while `active` | atom |
| `src/components/organisms/WalkthroughSlider` | Swiper (A11y + Keyboard modules), slides, dots, live region | organism |
| `src/hooks/usePrefersReducedMotion.ts` | Live reduced-motion flag (≈ a composable) | hook |
| `src/app/walkthrough/layout.tsx` | Sets the page title "How it works" | route |
| `src/app/walkthrough/page.tsx` + `page.module.css` | Holds slide index + Swiper instance; back / Continue / Get started | route |
| `src/components/organisms/HeroAnimation` | Now uses `HexagonArt` (no duplicate `<Image>`) | organism |
| `src/styles/tokens.css` | `--text-dim-opacity`, `--hexagon-sm-*`, `--walkthrough-text-height`, `--dot-size` | — |

## Measured against Figma (390 × 665)
| Element | Figma | Built |
|---|---|---|
| Hexagon | 122, 134, 146 × 155 | 122, 134, 146 × 155 |
| Text box | 20, 337, 350 × 150 — Bagoss 22 / 27.5px | 20, 337, 350 × 150 — Bagoss 22 / 27.5px |
| Dots | y 535, 8px, gap 8, `#B488F2` / white 25% | y 535, same |
| Button | 20, 581, 350 × 60, 1px white 60% | 20, 581, 350 × 60, 1px white 60% |

## How it works — in Vue 3 terms
- **The page owns the state** like a Vue page: `useState(0)` ≈ `const index = ref(0)`, and the slider is controlled like `v-model`;
  the organism keeps the Swiper instance to itself.
- **Organism emits, page reacts:** `activeIndex={index}` + `onChange={changeSlide}` ≈
  `v-model="index"`. Continue just sets `index + 1`; the organism calls `swiper.slideTo()`.
- **Swiper React** (`<Swiper>` / `<SwiperSlide>`) ≈ `swiper/vue`'s `<swiper>` / `<swiper-slide>`;
  modules are passed as `modules={[A11y, Keyboard]}`.
- **`useEffect(…, [index])` ≈ `watch(index, …)`**: after the last slide swaps Continue for
  Get started, focus is moved onto the new link so keyboard users don't lose their place.
- **`useGSAP(…, { dependencies: [active], revertOnUpdate: true })` ≈ `watch(() => props.active)`**
  that first undoes the previous animation: inactive slides fall back to the dimmed CSS state.
- **`useSyncExternalStore`** ≈ a tiny `useMediaQuery()` composable: reads the reduced-motion
  setting (and updates live) without a hydration mismatch.
- **`layout.tsx` with `metadata`** ≈ route `meta.title`: needed because the page is a client component.
- **`useRouter().push('/')`** ≈ Vue Router's `router.push('/')`.

## Accessibility notes
- Swiper A11y: region "walkthrough", slides labelled "1 of 3"; off-screen slides `aria-hidden`.
- Own polite live region announces "Step 2 of 3. <text>" on every change (Swiper's only speaks
  for its arrow buttons, which we don't use).
- Arrow keys change slides (Keyboard module); visually-hidden `<h1>` "How it works".
- Back is always a `<button>` (slide 1 navigates home via the router), so focus is never lost.
- Reduced motion: slide speed 0, words full white immediately.

## Requirement IDs covered
R-WALK-1, R-WALK-2, R-WALK-3, TR-2, TR-3, TR-5, EC-3, EC-5, EC-6, EC-7,
A11Y-2, A11Y-3, A11Y-4, A11Y-8, A11Y-12, A11Y-13, OB-3, OB-4, OB-5.

## Checks
- **typecheck / lint / build:** ✅ pass (re-run after fixes)
- **QA (`qa` agent): pass with 1 bug → fixed.**
  - Design exact (0px off) at 390 × 665; highlight animation, swipe, arrow keys, dots, back,
    Start over all work; axe **0 violations**; no horizontal scroll 320–1440; one Swiper after
    navigating back and forth; clean console.
  - Bug 1 — Enter on Continue (slide 2 → 3) dropped focus to `<body>`. Cause: after the page moved
    the slider, Swiper echoed the change back when the old button was already gone, which reset
    the "keep focus" flag. Fix: the flag is only set in the change handler and cleared by the effect.
    Re-tested with real key presses: focus lands on "Get started"; Left arrow returns it to "Continue".
  - Bug 2 (not reproducible) — Continue once did nothing after a hot reload: the page no longer
    keeps a Swiper reference at all (see review fix below), which removes that risk.
- **Code review (`code-reviewer` agent): approve with minor fixes — 2 majors, fixed.**
  - [major] Arrow keys on "Get started" lost focus → all slide changes go through one handler.
  - [major] Possible double announcement → Swiper's wrapper live region off (`wrapperLiveRegion: false`).
  - Slider is now fully controlled (≈ `v-model`): page owns `index`, the organism calls
    `swiper.slideTo()`; Swiper no longer leaks into the route.
  - Reduced-motion reading moved to `src/hooks/usePrefersReducedMotion.ts` (≈ a composable).
  - Live region stays empty until the first change (no double reading on load).
  - HighlightText: sentence read once (visually hidden), word spans `aria-hidden`; dim state set by
    GSAP (JS failure → text simply white); alignment inherited from the parent.
  - HexagonArt: CSS module instead of inline style, tighter prop type; `priority` → `preload` (Next 16).
  - `--text-dim-opacity` moved to the effects group.

## Known gaps (do not report)
- `/form` doesn't exist yet (phase d) → "Get started" leads to Next's 404 page.
- Dot contrast (25% white) is a deliberate Figma match (README remark later).
