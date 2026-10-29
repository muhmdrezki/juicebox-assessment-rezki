# juicebox — Frontend Developer Assessment

A mobile-first web app built from the Juicebox Figma design:
**Home → Walkthrough → Form → Results.**

- **Live:** https://juicebox-assessment-rezki.vercel.app
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · CSS Modules + CSS variables ·
  GSAP · Lenis · lottie-web · Swiper · Zustand

---

## Run it locally

Requirements: **Node.js 20.9 – 24** (tested on Node 24) and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (after `build`) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |

Tip: the design is mobile. In the browser's dev tools use device mode at **390 × 844**
(iPhone 12/13/14). The desktop layout appears at **1024px and wider**.

---

## What's in the app

| Screen | Route | Highlights |
|---|---|---|
| Homepage | `/` | Lottie hexagon cross-faded by GSAP into the Figma artwork, five floating statements, GSAP intro, Lenis smooth scrolling, accessible "Get a reality check" link |
| Walkthrough | `/walkthrough` | Swiper.js (A11y + Keyboard modules), copy that "lights up" word by word (GSAP), progress dots, Continue / **Get started** → form |
| Multistep form | `/form` | First name, then email; config-driven steps; validation (required + email format); visible labels, error messages, focus management |
| Results | `/results` | Thanks message with the name, summary of the user's input, Lottie hexagon badge, Continue → home |

Answers are kept for the browser session (sessionStorage), so a refresh on `/results` still works.
Opening `/results` without valid answers sends the user back to `/form`.

---

## Tech choices

| Choice | Why |
|---|---|
| **Next.js App Router + TypeScript strict** | Required by the brief; server components by default, `'use client'` only where state, effects or browser APIs are needed (animations, Swiper, form, store). |
| **CSS Modules + design tokens** | Every colour, font size, spacing, radius, size and duration lives in [`src/styles/tokens.css`](src/styles/tokens.css) as a CSS variable, named after the Figma variable it came from. Components never hard-code design values. |
| **Fonts** | The Figma uses **Bagoss** (headings) and **Söhne Buch** (body), both from the supplied `Fonts.zip`. Self-hosted with `next/font/local`, subset to Latin woff2 (~20 KB each); Bagoss's variable font is pinned to its "Standard Regular" instance. |
| **GSAP + `@gsap/react`** | `useGSAP()` reverts every tween on unmount (no leaks); `gsap.matchMedia()` runs animations only when motion is OK. |
| **lottie-web (light SVG build)** | Loaded in the browser only (dynamic `import()`), JSON fetched from `/public` so it's not in the JS bundle, destroyed on unmount. |
| **Lenis** | Smooth scrolling app-wide, driven by GSAP's ticker so both share one animation frame; destroyed on unmount. |
| **Swiper.js** | `swiper/react` with the A11y and Keyboard modules; controlled by the page (the slider follows the page's index). |
| **Zustand** | Small store for the answers, shared by form and results; `persist` middleware saves to sessionStorage. Loaded after mount (`skipHydration`) to avoid a server/client mismatch; saved data is re-validated. |
| **No regular expressions** | Email validation uses plain string methods (one `@`, text before it, a `.` after it, no whitespace, no `..`). |
| **No automated tests** | Not required by the brief. Each phase was checked in a real browser (layout measured against Figma, axe-core, keyboard) and code-reviewed — see [`docs/progress/`](docs/progress). |

### Folder structure (atomic design)

```
src/
  app/                      routes — the only place that reads the store
    page.tsx                /
    walkthrough/            /walkthrough  (each route: page.tsx + layout.tsx for its <title>)
    form/                   /form
    results/                /results
  components/
    atoms/                  Button, IconButton, Icon, Logo, HexIcon, HexagonArt, LottiePlayer,
                            Reveal, HighlightText, Dots, SubmitArrow
    molecules/              TextInput, FormStep, Prompt, HexBadge, AnswerSummary
    organisms/              AppHeader, HeroAnimation, WalkthroughSlider, MultiStepForm
    templates/              ScreenLayout (header + media + content + actions slots)
  store/Flow/               Zustand store: index / state / actions
  hooks/                    usePrefersReducedMotion
  lib/                      validation, gsap set-up, motion queries, cx, safeSessionStorage, nav types
  providers/                SmoothScroll (Lenis)
  styles/tokens.css         design tokens
  fonts/                    self-hosted woff2
public/
  images/hexagon.png        hexagon artwork exported from Figma (2×)
  lottie/hexagon.json       the supplied Lottie
```

A component is a folder with `index.tsx` + `index.module.css`. Lower levels only take props and call
callbacks; pages connect them to the store. Every file has a header comment, including its Vue 3
equivalent (the author's background).

---

## Accessibility

Target: **WCAG 2.2 AA**, applied wherever the design doesn't decide otherwise.

- **Semantic HTML:** one `<h1>` per page, real `<a>` for navigation and `<button>` for actions,
  `<label>` for every field, `<dl>` for the answer summary, `lang="en"`, a unique `<title>` per route.
- **Keyboard:** everything works without a mouse — Swiper with arrow keys, Enter submits the form,
  logical tab order, one consistent `#CDAAFF` focus ring.
- **Focus management:** after a page change, focus moves to the new screen, so the next Tab reaches
  "Go back"; the cursor is placed in the form field on arrival and on each step; when the walkthrough
  swaps Continue for Get started, focus follows to the new button.
- **Form errors:** shown after the first Continue, then updated live; `aria-invalid`,
  `aria-describedby` and a polite live region announce them. `autocomplete="given-name"` / `"email"`.
- **Screen readers:** walkthrough steps announced ("Step 2 of 3. …"); the next form question
  announced; decorative Lottie, artwork, icons and floating statements are hidden (`aria-hidden`, `alt=""`).
- **Motion:** with `prefers-reduced-motion: reduce`, GSAP doesn't run, Lottie isn't loaded (static
  icon/artwork instead), Lenis is off and slides change instantly. Without that setting, every
  animation stops within ~5 seconds (WCAG 2.2.2).
- **Robustness:** if JavaScript fails, a CSS safety net reveals any content waiting to be animated;
  blocked or full storage falls back to memory.
- **Checked with** axe-core 4.10 on every page and state: 0 violations.

### Contrast

| Pair | Ratio | |
|---|---|---|
| Text `#FAFAFA` on background `#0C0D10` | 18.6 : 1 | ✅ |
| Captions / placeholders (white 60%) | 7.3 : 1 | ✅ |
| Walkthrough dimmed copy (white 50%) | 5.2 : 1 | ✅ |
| Highlight / focus ring `#CDAAFF` | 10.0 : 1 | ✅ |
| Dark labels on purple / white buttons | 10.0 / 18.6 : 1 | ✅ |
| Error `#FF9B9B` | 9.6 : 1 | ✅ |
| Inactive walkthrough dots (white 25%) | 2.2 : 1 | ⚠️ see remarks |
| Form arrow button while the field is empty | 2.6 : 1 | ⚠️ see remarks |

---

## Remarks — where the build differs from, or adds to, the design

The PDF is followed strictly; where it says "match the Figma", the Figma wins. WCAG is applied only
where the design is silent. Every deviation:

| # | Remark | Why |
|---|---|---|
| 1 | The homepage button opens the **walkthrough**, not the form directly. | The PDF says "navigates to the form section"; the Figma prototype links Step 1 → walkthrough, whose last slide ("Get Started") opens the form, as the PDF also asks. |
| 2 | The supplied Lottie is a **flat purple hexagon**; the Figma hexagon is a gradient image on that shape. On the homepage the Lottie plays, then GSAP cross-fades it into the Figma artwork (exported from Figma). | Keeps "Lottie + GSAP" and ends on a pixel-perfect frame. |
| 3 | Results: the Lottie plays once as the small hexagon (recoloured to the icon's `#CDAAFF`), then hands over to the exact Figma icon. | The PDF asks for a Lottie on the results page; the design shows only the icon. |
| 4 | Results: a quiet **"First name / Email" summary** under the message. | Required by the PDF ("display user input summary"); not in the design. |
| 5 | **Form error style** (soft red `#FF9B9B` border + 14px message) is ours. | Not in the design. |
| 6 | The form's **arrow button** looks as in Figma (faint) while the field is empty and becomes full white once there is text. | The design only shows the empty state. Its faint state is 2.6 : 1. |
| 7 | **Inactive walkthrough dots** keep Figma's 25% white (2.2 : 1). | Pixel-perfect wins; the dots are a non-interactive progress indicator and screen readers hear "Step N of 3" instead. |
| 8 | **Walkthrough copy lights up word by word** (50% → 100% white). | The Figma frames show this effect frozen part-way (the dim value was measured from a Figma export). |
| 9 | **Animations stop** within ~5 s (Lottie plays once). | WCAG 2.2.2; the Figma is static, so this doesn't contradict it. |
| 10 | **Bagoss** is supplied as a **trial** font (`BagossTRIALVF.ttf`). | Used because the Figma uses it; a licensed file should replace it for production. |
| 11 | **Desktop layout** is our own design (the Figma is mobile only). | See below. |

---

## Desktop

The CSS is mobile first: the base styles are the 390px Figma screens, and the desktop layout only
**adds** rules inside `@media (min-width: 1024px)` blocks at the end of each module — nothing is undone.

At ≥ 1024px the [`ScreenLayout`](src/components/templates/ScreenLayout) template switches to **two
columns**: the hexagon (its `media` slot) on the left at 1.35× size, and the content + action button on
the right at the mobile width (390px), left-aligned. The header spans the 1152px container.
Each page decides what goes in the `media` slot (on the form and results the hexagon is desktop-only),
so a new screen gets the desktop layout for free.

---

## Deploy

Deployed with the Vercel CLI (`npx vercel --prod`); no configuration needed — Vercel detects
Next.js and runs `npm run build`. Importing the GitHub repository on vercel.com works the same way.
`engines.node` is `>=20.9.0 <25`.

---

## Project notes

- Requirements with IDs: [`docs/requirements.md`](docs/requirements.md)
- Decisions log: [`docs/decisions.md`](docs/decisions.md)
- Progress log per phase (what was built, how it maps to Vue 3, QA and review results):
  [`docs/progress/`](docs/progress)
- AI agent rules: [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), [`.claude/agents/`](.claude/agents)
