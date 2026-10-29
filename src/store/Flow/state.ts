/*
 * Flow store — state: the user's answers, shared by the form and results.
 *
 * Vue 3 equivalent: store/Flow/state.js → `state: () => ({ answers: … })`
 * in a Pinia defineStore.
 */

export type Answers = { firstName: string; email: string };
export type AnswerName = keyof Answers;

export type FlowState = {
  answers: Answers;
  /**
   * False until the saved answers have been loaded from sessionStorage
   * (always false on the server). Pages wait for it before trusting `answers`.
   */
  hydrated: boolean;
};

/** Starting state, also what the server renders. */
export const initialState: FlowState = {
  answers: { firstName: '', email: '' },
  hydrated: false,
};
