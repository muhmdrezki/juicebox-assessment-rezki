# Phase E — Results page

**Branch:** `phase-e_results_Rezki` (cut from `phase-d_form_Rezki` @ `2e6e426`)
**Status:** ready for owner review

## Goal
Build Figma "Step 5": the result message with the user's name, plus what the PDF adds — a
summary of the user's input and a Lottie animation on the results page.

## What we agreed
- The Lottie plays as the small hexagon (a "submitted" moment) and rests on the exact Figma icon.
- Summary (not in Figma): a quiet "First name / Email" list under the message; README remark.
- Missing or invalid answers → silently back to `/form` (`router.replace`).
- Continue → home (answers kept); back → `/form` (opens on step 1, prefilled).

## What was built
| File | What it is | Level |
|---|---|---|
| `src/components/atoms/LottiePlayer` | + `onReady` callback (≈ `emit('ready')`) | atom |
| `src/components/molecules/HexBadge` | HexIcon with the Lottie on top, recoloured to `#CDAAFF`; icon stays if the Lottie can't play | molecule |
| `src/components/molecules/AnswerSummary` | `<dl>` of label/value pairs | molecule |
| `src/components/molecules/Prompt` | Icon + Bagoss 19px text block, shared by FormStep and results (review: DRY) | molecule |
| `src/store/Flow/index.ts` | `merge` that only accepts saved answers of the right shape | store |
| `src/app/globals.css` | Headings inherit their size (no browser default sizes) | — |
| `src/app/results/layout.tsx` | Title "Your reality check" | route |
| `src/app/results/page.tsx` + `page.module.css` | Reads the Zustand store, waits for `hydrated`, validates, redirects or shows the result | route |
| `src/styles/tokens.css` | `--paragraph-gap-question` (30px) | — |

## Measured against Figma (390 × 665)
| Element | Figma | Built |
|---|---|---|
| Hexagon | 180.5, 110, 29 × 31, `#CDAAFF` | 180.5, 110, 29 × 31 — Lottie plays (recoloured `#CDAAFF`), then the exact Figma icon |
| Message | 20, 165, 350 wide — Bagoss 19px / 120% | 20, 165, 350 × 45.6 — 19px / 22.8px |
| "This will take 2-3 minutes." | 30px below | 20, 240.6 (= 165 + 45.6 + 30) |
| Continue | 20, 581, 350 × 60, `#FAFAFA` + 8px ring | 20, 581, 350 × 60, `#FAFAFA` |
| Summary | — (ours) | centred under the message, 32px gap |

## How it works — in Vue 3 terms
- **Route guard ≈ `beforeEnter`**, written as an effect: `useEffect(() => { if (hydrated && !complete) router.replace('/form') }, …)`.
  It has to wait for `hydrated`, because the saved answers are only loaded in the browser.
- **`complete` ≈ `computed()`**: the saved answers are re-checked with the same validators as the form
  (never trust stored data).
- **`useFlowStore((s) => s.answers)` ≈ `storeToRefs(useFlowStore()).answers`.**
- **`HexBadge`**: `useState(false)` ≈ `ref(false)`; `<LottiePlayer onReady>` ≈ `@ready`; the icon is hidden
  once the Lottie is on screen ≈ `v-show="!lottieReady"`.
- **`<dl>/<dt>/<dd>`**: semantic label/value list, rendered with `.map` ≈ `<template v-for>`.
- **`Reveal`** (from phase b) fades the message, summary and button in.

## Accessibility notes
- `<h1>` = the thanks message; visually hidden `<h2>` "Your answers" before the summary list.
- Badge is decorative (`aria-hidden`); Lottie plays once (~2 s, A11Y-11); reduced motion → static icon.
- React escapes the name, so typed HTML is shown as text.

## Requirement IDs covered
R-RES-1, R-RES-2, R-RES-3, TR-2, TR-3, TR-5, EC-1, EC-3, EC-5, EC-6, EC-7, A11Y-8, A11Y-11, A11Y-12, A11Y-13, OB-3, OB-4.

## Checks
- typecheck / lint / build: ✅ pass
- **QA (`qa` agent): 2 bugs (hand-edited storage only) → fixed.** Design exact; Lottie plays then rests;
  summary trims/escapes; axe **0 violations**; full E2E run Home → Walkthrough → Form → Results → Home works;
  no horizontal scroll 320–1440; clean console.
  - Bug 1: saved answers without an email crashed the page → the store's `merge` now rejects anything that
    isn't two strings (verified: missing field, wrong types, broken JSON → redirect to `/form`).
  - Bug 2: hand-saved values shown untrimmed → the page shows trimmed values.
- **Code review (`code-reviewer` agent): approve with minor fixes — 1 major, fixed.**
  - [major] Badge ended on the Lottie's last frame, not the Figma icon → stages icon → lottie → done.
  - `onReady` now waits for Lottie's `DOMLoaded` event.
  - Tampered storage can no longer crash a page (`merge`).
  - Shared `Prompt` molecule replaces the duplicated icon + question block (form + results).
  - `actions={ready ? … : undefined}`; heading sizes via the global reset instead of a descendant selector.
  - Accepted: on a slow load the static icon is briefly replaced by the Lottie's first frame.

## Known gaps (do not report)
- Summary styling is ours (not in Figma), deliberately quiet.
- Next's dev-mode "N" badge overlaps the bottom-left corner in dev only.

## Fix after owner review — blank results page
- **Seen by the owner:** after submitting the email, `/results` showed only the header.
- **Cause:** the saved answers were loaded once, by `<FlowHydration />` in the root layout. When the dev
  server hot-reloaded the store file (while the tab stayed open), a fresh store started with
  `hydrated: false`, and the one-time loader never ran again, so the page waited forever.
  (Production loads the store once, but the design was fragile.)
- **Fix:** `useFlowHydration()` in `src/store/Flow/index.ts`. Every page that reads the answers (form,
  results) loads them itself after mount if they aren't loaded yet, and gets `hydrated` back.
  `<FlowHydration />` (phase d) is removed. ≈ restoring the persisted store in the page's `onMounted()`.
