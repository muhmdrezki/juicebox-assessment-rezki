# Phase F — Accessibility pass, README, deploy prep

**Branch:** `phase-f_a11y-readme_Rezki` (cut from `phase-e_results_Rezki` @ `92e960c`)
**Status:** ready for owner review (deploy to Vercel after approval)

## Goal
Finish the assessment: close the last design gap (form entrance motion), check accessibility across
the whole app, write the README with all remarks, and make the build ready for Vercel.

## What we agreed
- Form gets the same kind of entrance motion as the other screens (owner noticed it had none).
- Deploy to Vercel after this phase (Claude runs the Vercel CLI; the owner logs in).
- Don't delete the stray `package-lock.json` one folder up; set `turbopack.root` instead.

## What was built
| File | What it is |
|---|---|
| `src/components/molecules/FormStep` | GSAP entrance: icon + question rise in on arrival and on every new question; field fades in once (opacity only, stays focusable) |
| `src/app/globals.css`, `layout.tsx` | `[data-fade]` pre-hide (opacity) + 2.5 s safety net + `<noscript>` fallback |
| `next.config.ts` | `turbopack.root` = this folder (no "workspace root" warning) |
| `package.json` | `engines.node >= 20.9.0` (Next 16 minimum) |
| `README.md` | Setup, scripts, tech choices, structure, accessibility + contrast table, remarks, desktop, deploy |
| `src/providers/RouteFocus` | After a page change, focuses the new screen (if the page didn't focus something itself) so the next Tab reaches "Go back" |
| `src/components/templates/ScreenLayout` | Screen root is focusable by code (`data-screen`, `tabIndex={-1}`) |
| `src/app/layout.tsx` | Homepage title "Get a reality check \| juicebox" (same pattern as the other pages) |

## How it works — in Vue 3 terms
- **Two `useGSAP` calls in FormStep:** one with `dependencies: [question]` ≈ `watch(() => props.question, …, { immediate: true })`
  (prompt animates on every step), one without ≈ `onMounted` (field fades in once).
- **Opacity, not visibility, for the field:** a `visibility: hidden` input can't receive focus, and the page
  puts the cursor in the field immediately; `opacity: 0` keeps it focusable.

## Accessibility pass
Contrast (computed, WCAG formula):

| Pair | Ratio |
|---|---|
| Text #FAFAFA on #0C0D10 / on glow #222737 | 18.6 / 14.2 |
| White 60% (captions, placeholders, borders) | 7.3 (6.3 on glow) |
| White 50% (walkthrough dim copy) | 5.2 |
| #CDAAFF (highlight, focus) | 10.0 |
| #0C0D10 on #CDAAFF / #FAFAFA | 10.0 / 18.6 |
| #FF9B9B (errors) | 9.6 |
| #B488F2 active dot | 7.2 |
| Inactive dot white 25% | 2.2 ⚠️ (Figma; README remark) |
| Idle submit circle white 30% | 2.6 ⚠️ (Figma; README remark) |
| Icon-button glass white 5% | 1.1 — the icon itself is 18.6, so the control is identifiable |

## Requirement IDs covered
TR-4, TR-7, TR-8, EC-4, OB-8, OB-9, A11Y-1 … A11Y-13 (whole-app pass).

## Checks
- typecheck / lint / build: ✅ pass; build has no workspace-root warning
- Form motion: verified with real key presses — prompt rises in, field fades in, focus stays in the field;
  step 2 re-animates the question; layout unchanged (icon 180.5,110 · question 20,173 · arrow 326,595.5)
- **QA (`qa` agent, whole app): pass, 2 minor issues → fixed.** Keyboard-only E2E works; focus ring everywhere;
  axe **0 violations on all 8 states** (home, walkthrough 1 & 3, form step 1/2 ± error, results); labels,
  autocomplete, live regions, one h1 + unique titles; no horizontal scroll at 320 / 1440; 200% text OK; clean console.
  Reduced motion: verified via a faked `matchMedia` (no Lottie loaded, no GSAP movement); real OS setting not emulatable.
  - Focus fell to `<body>` after a page change → `RouteFocus` (verified: next Tab = "Go back"; the form keeps its field focus).
  - Homepage title style differed → "Get a reality check | juicebox".
- **Code review (`code-reviewer` agent): approve with minor fixes → fixed.** Deploy wording (CLI), `engines`
  `>=20.9.0 <25`, unused `--space-4` removed, README folder tree (+ `public/`, per-route layouts), `root: __dirname`.
  Live URL added after the deploy. Accepted: on very slow JS (> 2.5 s) the safety net shows content before GSAP fades it in.

## Known gaps (do not report)
- Remarks 1–11 in the README are deliberate.
- Next's dev-mode "N" badge (dev only).
