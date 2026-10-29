# Phase D — Multistep form + validation

**Branch:** `phase-d_form_Rezki` (cut from `phase-c_walkthrough_Rezki` @ `a9cebbe`)
**Status:** ready for owner review

## Goal
Build Figma "Step 3" (first name) and "Step 4" (email): one question per screen, reusable
form components, validation (required + email format, **no regex**), accessible labels, errors
and focus — and keep the answers for the results page.

## What we agreed
- The question is the field's visible `<label>` (also the page `<h1>`).
- Error style (not in Figma): border `#FF9B9B`, 14px message under the field.
- Cursor in the field on arrival and on every step change (Figma shows the keyboard open).
- Desktop: big hexagon left, question + field right.
- Answers kept for the browser session (sessionStorage) and prefilled when coming back.
- Icons exported from Figma: small hexagon (29 × 31, `#CDAAFF`), "Arrow up" (18 × 18).

## What was built
| File | What it is | Level |
|---|---|---|
| `src/components/atoms/HexIcon` | Small purple hexagon (Figma SVG) | atom |
| `src/components/atoms/SubmitArrow` | 31px round submit button; 50% until there is text | atom |
| `src/components/atoms/Icon` | + `ArrowUpIcon` (Figma "Arrow up") | atom |
| `src/components/molecules/TextInput` | Field + error; `aria-invalid`, `aria-describedby`, polite live region; `action` slot | molecule |
| `src/components/molecules/FormStep` | Icon + question (`<h1><label>`) + field pinned to the bottom | molecule |
| `src/components/organisms/MultiStepForm` | Renders the current step from a config list; validates; moves focus | organism |
| `src/store/Flow` (`index`, `state`, `actions`) | Zustand store: answers `{ firstName, email }`, persisted to sessionStorage (≈ Pinia store) | store |
| `src/lib/safeSessionStorage.ts` | sessionStorage that never throws (memory fallback when blocked or full) | helper |
| `src/providers/FlowHydration` | Restores the saved answers after mount (`persist.rehydrate()`) | provider |
| `src/lib/validation.ts` | `validateFirstName`, `validateEmail`, `isEmailShape` — string methods only | helper |
| `src/app/form/layout.tsx`, `page.tsx`, `page.module.css` | Title "Your details"; owns the step; back / next / → `/results` | route |
| `src/app/layout.tsx` | Renders `<FlowHydration />` | — |
| `src/components/templates/ScreenLayout` | Content area grows (`flex: 1`) so a field can sit at the bottom | template |

## Measured against Figma (390 × 665)
| Element | Figma | Built |
|---|---|---|
| Hexagon icon | 180.5, 110, 29 × 31, `#CDAAFF` | 180.5, 110, 29 × 31, `#CDAAFF` |
| Question | 20, 173, 350 × 46 — Bagoss 19px / 120% | 20, 173, 350 × 46 — Bagoss 19px / 22.8px |
| Field | 20, 581, 350 × 60, radius 18, 1px white 60% | 20, 581, 350 × 60, radius 18, 1px white 60% |
| Placeholder | Söhne 16px, white 60% | Söhne 16px, white 60% |
| Arrow | 31 × 31 at the right, 12px padding, 50% | 326, 595.5, 31 × 31, 50% |

## Validation (no regular expressions)
| Field | Rule | Message |
|---|---|---|
| First name | `trim()` not empty | Please enter your first name. |
| First name | ≤ 50 characters (also `maxLength`) | Please use 50 characters or fewer. |
| Email | `trim()` not empty | Please enter your email address. |
| Email | no whitespace at all · exactly one `@` with text before it · a `.` after the `@` that isn't first or last · no `..` | Please enter a valid email address, e.g. name@example.com. |

Nothing turns red until the user presses Continue; after that the message updates live as they type.
Values are trimmed when saved.

## How it works — in Vue 3 terms
- **Zustand store ≈ a Pinia store** (replaced the first React Context version at the owner's request).
  `create(persist(...))` ≈ `defineStore` + pinia-plugin-persistedstate; no provider. In a page:
  `useFlowStore((s) => s.answers)` ≈ `storeToRefs(useFlowStore()).answers` — the selector means the page
  only re-renders when `answers` changes. `skipHydration` + `<FlowHydration />` load the saved answers
  right after the page is matched to the server HTML (no hydration warning); `hydrated` tells phase e when
  the answers are ready.
- **Page owns the step**, like a Vue page: `useState(0)` ≈ `ref(0)`. `MultiStepForm` gets
  `steps / step / values` as props and reports `onValueChange` / `onStepComplete` ≈ `emit`.
- **Config-driven steps:** the page's `STEPS` array is the whole form. A third question = one more entry.
- **Derived error** ≈ `computed()`: `error = triedStep === step ? validate(value) : null` — no error state to keep in sync.
- **`useEffect(() => input.focus(), [step])` ≈ `watch(step, …, { immediate: true })`.**
- **`ref` as a prop (React 19)** on `TextInput` ≈ a template ref on the inner `<input>`.
- **`value` + `onChange(value)` on `TextInput` ≈ `v-model`** (`modelValue` + `update:modelValue`).
- **TypeScript generic** `MultiStepForm<N>` ties step names to the answer keys (`'firstName' | 'email'`),
  so a typo in a step name is a compile error.
- **`<form noValidate onSubmit>` ≈ `@submit.prevent`**; Enter in the field or the arrow both submit.

## Requirement IDs covered
R-FORM-1, R-FORM-2, R-FORM-3, R-FORM-4, R-FORM-5, R-FORM-6, R-FORM-7, TR-2, TR-3, EC-1, EC-3, EC-5, EC-6,
A11Y-2, A11Y-3, A11Y-4, A11Y-5, A11Y-6, A11Y-7, A11Y-8, OB-3, OB-4.

## Checks
- typecheck / lint / build: ✅ pass; no regex in `src/`
- **QA (`qa` agent): pass** — design exact at 390 × 665; all validation cases; labels, autocomplete, focus,
  tab order; axe **0 violations** (step 1, step 2, error states); 320–1440 no horizontal scroll; flow incl.
  back, reload prefill, → /results.
  - Reported "error not announced (no `role=alert`)": not a regression — it was replaced (review fix) by an
    always-present `aria-live="polite"` container, which announces the message when it appears. Verified.
  - Image "fill + invalid parent position" warning seen mid-run: gone (HexagonArt now renders a positioned box).
- **Code review (`code-reviewer` agent): changes required → fixed.**
  - [major] Enter kept the same input, so the new question wasn't announced → a polite live region
    "Question 2 of 2: …" (keeps the phone keyboard open, unlike remounting the input).
  - Errors no longer interrupt on every keystroke (polite live region instead of `role="alert"`).
  - `triedStep` reset after a successful step.
  - Email: rejects any whitespace character and `..` (string methods, no regex).
  - Storage: if a write fails, answers are read from memory (input never looks frozen).
  - No double focus ring when the arrow button has focus (`.field:has(.input:focus-visible)`).
  - Desktop hexagon size lives once in `HexagonArt` (`box="small" | "desktopOnly"`), not in two page CSS files.
  - Arrow label from the step config: "Continue" on step 1, "Submit" on step 2.
  - ScreenLayout: dead `margin-top: auto` on the action bar removed.
  - Note for phase e: results must validate the saved answers, not trust them.

## Known gaps (do not report)
- `/results` doesn't exist yet (phase e) → finishing the email step leads to Next's 404.
- Error colour/size are our own (not in Figma).
- Next's dev-mode "N" badge overlaps the bottom-left corner in dev only.
