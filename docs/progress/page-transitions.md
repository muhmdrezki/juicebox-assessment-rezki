# Follow-up — Page transitions

**Branch:** `page-transitions_Rezki` (cut from `main` @ `6e51a3e`)

## Goal
The owner noticed screens simply swap ("Get started" → form had no transition). The Figma prototype
links screens with "smart animate", so changing screens should feel like one continuous flow.

## What we agreed (option a)
- The **header stays still**.
- **The hexagon morphs** into the next screen's hexagon (home → walkthrough → form icon → results badge, and back).
- The rest of the screen **slides**: from the right going forward, from the left going back.
- Reduced motion: no transition, the screens swap.

## What was built
| File | What it is |
|---|---|
| `src/components/templates/ScreenLayout` | Wraps every screen in React's `<ViewTransition enter/exit>` (slide per transition type) |
| `src/lib/nav.ts` | `NavDirection` (`'forward'` or `'back'`) + `transitionTypesFor()`; `direction` on `LinkAction` |
| `src/components/atoms/Button`, `IconButton` | `direction` prop → `<Link transitionTypes>` |
| `src/app/*/page.tsx` | Directions on every navigation; `router.push(href, { transitionTypes })` in walkthrough / form |
| `src/lib/morph.ts` + `globals.css` | "The hexagon" of each screen via global classes: `vt-hexagon` (every width), `vt-hexagon-mobile`, `vt-hexagon-desktop` |
| `src/components/organisms/AppHeader` | Inline `viewTransitionName: 'site-header'` (CSS Modules would rename it) |
| `src/components/organisms/HeroAnimation` | Intro plays once per visit; coming back shows the final state so the morph lands on it |
| `src/components/molecules/FormStep` | Only the question animates (the icon is the morph target) |
| `src/components/molecules/HexBadge` | Accepts `className` |
| `src/styles/tokens.css` | `--duration-page` 450ms, `--duration-page-out`, `--duration-page-in`, `--page-slide` 60px |

## Which element is "the hexagon"
| Screen | Phone (< 1024px) | Desktop (≥ 1024px) |
|---|---|---|
| Home | hero hexagon, 274px | hero hexagon, 370px |
| Walkthrough | hexagon, 146px | hexagon, 370px |
| Form | small icon, 29px | big left hexagon, 370px |
| Results | badge, 29px | big left hexagon, 370px |

Exactly one per screen and width (two with the same name would cancel the transition). On desktop
the hexagon stays in place while the content slides.

## How it works — in Vue 3 terms
- **`<ViewTransition>` in ScreenLayout ≈ `<Transition>` around `<router-view>`**. Next route changes are
  React transitions, so the browser's View Transitions API animates old → new screen.
- **`transitionTypes={['nav-forward']}` on a link ≈ choosing the `<Transition name>` per navigation**;
  the CSS for `::view-transition-old/new(.nav-forward)` does the slide.
- **Shared element** (no Vue built-in; ≈ a FLIP animation between routes): elements with the same
  `view-transition-name` on the old and new screen are animated as one object.
- **Module-level `introPlayed`** ≈ a variable outside `setup()`: shared by every mount in this visit.

## Checks
- typecheck / lint / build: ✅
- Browser: every screen change (home ↔ walkthrough → form → results → home) runs the morph + slide;
  header never animates; one named hexagon per screen at 390 and 1440; back to home lands on a visible
  hexagon; focus after navigation unchanged (Tab → "Go back"; form keeps its field focus).
- Code review: changes required → fixed (desktop duplicate hexagon, invisible home target on back, form
  icon offset by the question's rise, hard-coded durations, duplicated slide CSS).
