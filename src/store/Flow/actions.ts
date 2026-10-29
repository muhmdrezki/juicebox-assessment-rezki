/*
 * Flow store — actions: the only way components change the answers.
 *
 * Vue 3 equivalent: store/Flow/actions.js → `actions: { setAnswer() { this.answers[name] = value } }`.
 * Zustand has no `this`: an action calls `set()` with the new state
 * (always a new object, never mutating the old one).
 */
import type { StoreApi } from 'zustand';
import type { FlowStore } from './index';
import type { AnswerName } from './state';

export type FlowActions = {
  setAnswer: (name: AnswerName, value: string) => void;
};

/** Build the actions for the store, given Zustand's own `set` function. */
export function createFlowActions(set: StoreApi<FlowStore>['setState']): FlowActions {
  return {
    setAnswer: (name, value) => set((state) => ({ answers: { ...state.answers, [name]: value } })),
  };
}
