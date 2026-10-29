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
 * hydration mismatch); <FlowHydration /> in the root layout loads them right
 * after, and sets `hydrated` to true.
 * If sessionStorage is blocked or full, safeSessionStorage keeps the answers
 * in memory instead, so the form never breaks.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeSessionStorage } from '@/lib/safeSessionStorage';
import { createFlowActions, type FlowActions } from './actions';
import { initialState, type FlowState } from './state';

export type { AnswerName, Answers } from './state';

export type FlowStore = FlowState & FlowActions;

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
      // Runs after the saved answers are loaded — also if loading failed — so
      // pages can trust `answers` from then on. (It saves once more; harmless.)
      onRehydrateStorage: () => () => useFlowStore.setState({ hydrated: true }),
    },
  ),
);
