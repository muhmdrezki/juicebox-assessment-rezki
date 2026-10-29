@AGENTS.md

# Claude Code workflow for this repo

## Phases and branches
| Phase | Branch | Log |
|---|---|---|
| a. Setup, fonts, tokens, base layout, agent workflow | `phase-a_setup_Rezki` | `docs/progress/phase-a-setup.md` |
| b. Homepage (Lottie + GSAP + Lenis) | `phase-b_homepage_Rezki` | `docs/progress/phase-b-homepage.md` |
| c. Walkthrough (Swiper) | `phase-c_walkthrough_Rezki` | `docs/progress/phase-c-walkthrough.md` |
| d. Multistep form + validation | `phase-d_form_Rezki` | `docs/progress/phase-d-form.md` |
| e. Results page | `phase-e_results_Rezki` | `docs/progress/phase-e-results.md` |
| f. Accessibility pass, README, deploy prep | `phase-f_a11y-readme_Rezki` | `docs/progress/phase-f-a11y-readme.md` |

Each phase branch is cut from the previous phase branch (`main` → a → b → …).

## Loop for every phase
1. **Discuss**: propose scope, options and a recommendation; list the requirement IDs touched.
2. Wait for the owner to say **"execute"**. No code before that.
3. **Build** on the phase branch (Engineer rules, `.claude/agents/engineer.md`).
4. Run `npm run typecheck && npm run lint && npm run build`.
5. **QA** sub-agent (`qa`) and **Code Reviewer** sub-agent (`code-reviewer`), in parallel.
6. Fix blockers/majors, then write the phase log from `docs/progress/_template.md`.
7. Stop and report to the owner, explaining the key code in Vue 3 terms.
8. **Commit only when the owner says so. Push only on the owner's go.**

## Talking to the owner
- Short, plain words; map every React idea to Vue 3.
- Record every decision in `docs/decisions.md` (date, decision, why).
