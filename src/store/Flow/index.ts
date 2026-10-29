/*
 * Flow store (Zustand) — the answers { firstName, email }, saved in
 * sessionStorage so a refresh on /results still works (cleared when the
 * browser tab closes).
 *
 * Vue 3 equivalent: store/Flow/index.js → defineStore('flow', { state, actions })
 * with pinia-plugin-persistedstate. Use it like Pinia, no provider needed:
 *   const answers = useFlowStore((s) => s.answers)   ≈ storeToRefs(useFlowStore()).answers
 *   const setAnswer = useFlowStore((s) => s.setAnswer)
 * The selector `(s) => s.answers` means a component only re-renders when
 * that part of the store changes.
 *
 * `persist` saves `answers` to sessionStorage. `skipHydration` stops it from
 * loading them while the server HTML is being matched (that would cause a
 * hydration mismatch); every page that needs the answers calls
 * useFlowHydration(), which loads them right after mount and returns
 * `hydrated` (true once they are in).
 * If sessionStorage is blocked or full, safeSessionStorage keeps the answers
 * in memory instead, so the form never breaks.
 */
import { useEffect } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeSessionStorage } from '@/lib/safeSessionStorage';
import { createFlowActions, type FlowActions } from './actions';
import { initialState, type Answers, type FlowState } from './state';

export type { AnswerName, Answers } from './state';

export type FlowStore = FlowState & FlowActions;

/** The saved answers if they have the right shape ({ firstName: string, email: string }), else null. */
function readAnswers(saved: unknown): Answers | null {
  if (typeof saved !== 'object' || saved === null || !('answers' in saved)) return null;
  const answers = saved.answers;
  if (typeof answers !== 'object' || answers === null) return null;
  if (!('firstName' in answers) || !('email' in answers)) return null;
  const { firstName, email } = answers;
  return typeof firstName === 'string' && typeof email === 'string' ? { firstName, email } : null;
}

export const useFlowStore = create<FlowStore>()(
  persist(
    (set) => ({
      ...initialState,
      ...createFlowActions(set),
    }),
    {
      name: 'juicebox:answers', // sessionStorage key
      storage: createJSONStorage(() => safeSessionStorage),
      partialize: (state) => ({ answers: state.answers }), // save only the answers
      skipHydration: true,
      // How saved data joins the store. Never trust it: if it isn't two strings
      // (e.g. edited by hand), start empty instead of crashing a page.
      merge: (saved, current) => ({ ...current, answers: readAnswers(saved) ?? current.answers }),
      // Runs after the saved answers are loaded — also if loading failed — so
      // pages can trust `answers` from then on. (It saves once more; harmless.)
      onRehydrateStorage: () => () => useFlowStore.setState({ hydrated: true }),
    },
  ),
);

/**
 * Load the saved answers into the store (once, after mount) and return
 * `hydrated`. Call it in every page that reads the answers.
 * ≈ restoring a persisted Pinia store in the page's onMounted().
 * Each page triggers it itself, so it also works after a hot reload in
 * development (when the store module is re-created).
 */
export function useFlowHydration(): boolean {
  useEffect(() => {
    if (!useFlowStore.persist.hasHydrated()) void useFlowStore.persist.rehydrate();
  }, []);
  return useFlowStore((s) => s.hydrated);
}
