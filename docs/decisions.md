# Decisions log

| Date | Decision | Why |
|---|---|---|
| 2026-10-29 | Follow the PDF strictly; where it says "match the Figma", the Figma wins | Owner's rule; PDF is what we are graded on |
| 2026-10-29 | WCAG 2.2 AA as "accessibility standards", applied only where the design is silent; gaps → README remarks | PDF names no standard; WCAG AA is the industry and Australian norm |
| 2026-10-29 | Fonts: Bagoss (Standard Regular) for headings, Söhne Buch for body | Used in Figma; both supplied in `Fonts.zip`. Graphik from the first scaffold was wrong |
| 2026-10-29 | Bagoss variable font pinned to wght 400 / wdth 100 and subset to Latin woff2 (~23 KB) | Figma uses only "Standard Regular"; the 620 KB variable file is too heavy |
| 2026-10-29 | Logo exported from Figma as SVG and inlined in the `Logo` atom | Pixel-perfect; colour from CSS via `currentColor` |
| 2026-10-29 | Flow: Home → Walkthrough → Form → Results; Results "Continue" goes home | Matches the Figma prototype links; nothing follows Results in the design |
| 2026-10-29 | Form data in React Context + sessionStorage; `/results` without data redirects to `/form` | No email in the URL; survives refresh |
| 2026-10-29 | Desktop (≥1024px, our design): two columns — hexagon left, content + actions right | Figma is mobile only; a 390px column looks lost on desktop |
| 2026-10-29 | Lottie loops settle/stop after ~5 s | WCAG 2.2.2; Figma is static so this doesn't contradict the design |
| 2026-10-29 | Inactive dots keep Figma's 25% white (non-interactive progress indicator); noted in README | Strict PDF: pixel-perfect wins |
| 2026-10-29 | Form arrow button: Figma look while empty, brighter once the user types | The design doesn't show the filled state |
| 2026-10-29 | Atomic folder structure; component = folder with `index.tsx` + `index.module.css` | Owner's convention (from their Vue 3 rules) |
| 2026-10-29 | One branch per phase, chained from `main`; progress log per phase in `docs/progress/` | Reviewable history; owner reviews each phase |
| 2026-10-29 | Commit only on the owner's say-so; push only on the owner's go | Owner's rule |
| 2026-10-29 | No automated tests | Not required by the PDF |
| 2026-10-29 | Keep `AGENTS.md` (Next.js block + our rules); `CLAUDE.md` imports it; agents: engineer, qa, code-reviewer | Shared rulebook for any AI tool |
| 2026-10-29 | Homepage option A: GSAP intro on load + Lenis app-wide (not a scroll-driven hero) | Button on screen without scrolling (fades in within ~1 s); end state = Figma; Lenis helps any page taller than the screen |
| 2026-10-29 | Floating home labels hidden from screen readers; home button → /walkthrough (README remark: PDF says "form section") | Labels are decorative fragments; Figma prototype links Step 1 → Step 2.1 |
| 2026-10-29 | Hexagon = supplied Lottie (flat #B488F2 morph, the Figma shape's base colour) cross-faded by GSAP into the Figma artwork (`Beauty.png` fill, exported 2×) | The Lottie alone can't match Figma's gradient; this keeps "Lottie + GSAP" and a pixel-perfect end frame |
| 2026-10-29 | Back/restart icons and the hexagon artwork exported from Figma | Pixel-perfect (owner: "if you can get assets from Figma, get them") |
| 2026-10-29 | Walkthrough copy lights up word by word (GSAP) from #FAFAFA 50% to 100%; only the text slides | Figma shows the effect frozen; dim value measured from a Figma export |
| 2026-10-29 | Walkthrough back is always a button: previous slide, or router.push('/') on slide 1 | Swapping link ↔ button lost keyboard focus |
| 2026-10-29 | No regular expressions in the code; HighlightText splits on a plain space | Owner's rule |
