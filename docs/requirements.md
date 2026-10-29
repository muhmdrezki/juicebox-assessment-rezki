# Requirements — single source of truth

Every agent (Engineer, QA, Code Reviewer) checks work against the IDs below.
Source: *Juicebox Frontend Developer Assessment* PDF (12.07.2024) and the Figma
file "Test Design" (mobile only, 390 × 844).

**Rule of precedence (decided 2026-10-29):** follow the PDF strictly. Where the
PDF says "match the Figma", the Figma wins. WCAG 2.2 AA is applied only where
the design is silent; any remaining gap is listed as a remark in the README.

---

## 1. Features (PDF "Assessment Steps")

| ID | Requirement | PDF wording (short) |
|---|---|---|
| R-HOME-1 | Homepage shows a Lottie animation | "Integrate Lottie" |
| R-HOME-2 | The animation uses GSAP | "Use GSAP for animation" |
| R-HOME-3 | Smooth scrolling with Lenis | "Implement smooth scrolling with Lenis" |
| R-HOME-4 | A button that navigates onward | "Include a button that navigates to the form section" |
| R-HOME-5 | That button is accessible | "focus states, ARIA labels if needed" |
| R-WALK-1 | Tutorial screens built with Swiper.js | "Use Swiper.js for the tutorial screens" |
| R-WALK-2 | Each screen matches the design | "Ensure each screen matches the design specifications" |
| R-WALK-3 | "Get Started" on the last slide goes to the form | "Add a 'Get Started' button on the last slide…" |
| R-FORM-1 | Field: First Name (text input) | |
| R-FORM-2 | Field: Email address (email input) | |
| R-FORM-3 | Reusable form components | "e.g., TextInput, SelectDropdown" |
| R-FORM-4 | Validation: required + valid format | "required fields, appropriate formats" |
| R-FORM-5 | Accessible form | "labels, error messages, tab order" |
| R-FORM-6 | Styled with CSS variables | |
| R-FORM-7 | Pixel-perfect to the design | |
| R-RES-1 | Results page shows a result message | |
| R-RES-2 | Results page shows a summary of the user's input | |
| R-RES-3 | Lottie on the results page | PDF overview: "Results page with a Lottie animation" |

## 2. Technical requirements (PDF)

| ID | Requirement |
|---|---|
| TR-1 | Next.js & TypeScript |
| TR-2 | Styling with CSS variables; pixel-perfect implementation |
| TR-3 | Reusable components wherever possible |
| TR-4 | Meets accessibility standards (we use WCAG 2.2 AA — section 4) |
| TR-5 | GSAP for animations, Lottie integrated |
| TR-6 | Code in a Git repository (GitHub) |
| TR-7 | README: how to run locally + other relevant information |
| TR-8 | Optional: deployed version (Vercel) |

## 3. Evaluation criteria (PDF)

| ID | Criterion | What the reviewer looks for |
|---|---|---|
| EC-1 | Functionality | Everything in section 1 works end to end |
| EC-2 | Code quality | Clean, readable, maintainable |
| EC-3 | Design fidelity | Matches Figma pixel-perfectly (mobile) |
| EC-4 | Accessibility | Section 4 passes |
| EC-5 | Reusable components | Atomic levels, no duplication |
| EC-6 | CSS variables | All design values come from `src/styles/tokens.css` |
| EC-7 | Animations | Smooth and performant GSAP + Lottie |

## 4. Accessibility checklist (WCAG 2.2 AA, applied where the design is silent)

| ID | WCAG | Check |
|---|---|---|
| A11Y-1 | 1.4.3 / 1.4.11 | Text contrast ≥ 4.5:1; UI parts ≥ 3:1 (design colours kept — gaps noted in README) |
| A11Y-2 | 2.1.1 | Everything works with the keyboard only, incl. Swiper and the form |
| A11Y-3 | 2.4.7 / 2.4.11 | Visible focus ring, never hidden behind other content |
| A11Y-4 | 2.4.3 | Logical tab order; focus moves to the new input on each form step |
| A11Y-5 | 1.3.1 / 3.3.2 | Every input has a real label (placeholder alone is not enough) |
| A11Y-6 | 3.3.1 / 3.3.3 | Errors shown in text with a hint, announced to screen readers |
| A11Y-7 | 1.3.5 | `autocomplete="given-name"` / `"email"` |
| A11Y-8 | 2.4.2 / 3.1.1 / 1.3.1 | Unique page `<title>`, `lang="en"`, one `<h1>` per page |
| A11Y-9 | 1.4.10 / 1.4.4 | Works at 320px wide and at 200% text size |
| A11Y-10 | 2.5.8 | Targets ≥ 24 × 24px |
| A11Y-11 | 2.2.2 | Auto-moving content stops within 5 s (Lottie settles) |
| A11Y-12 | 2.3.3 | `prefers-reduced-motion` respected by GSAP, Lottie and Lenis |
| A11Y-13 | 1.1.1 | Decorative Lottie / images hidden from screen readers |

## 5. Owner's brief (on top of the PDF)

| ID | Requirement |
|---|---|
| OB-1 | App Router, TypeScript strict |
| OB-2 | CSS Modules + design tokens (colours, fonts, spacing, radii) |
| OB-3 | Mobile first; desktop added only in `@media (min-width: 1024px)` |
| OB-4 | Desktop layout (our design): two columns — hexagon left, content right |
| OB-5 | GSAP / Lenis / Lottie instances cleaned up on unmount |
| OB-6 | Atomic folder structure (see AGENTS.md) |
| OB-7 | Every file and function commented with its Vue 3 equivalent |
| OB-8 | README: setup, tech choices, accessibility notes, how desktop is added |
| OB-9 | Ready to deploy on Vercel |
| OB-10 | No automated tests (not required by the PDF) |
