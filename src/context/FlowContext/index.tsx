'use client';
/*
 * FlowContext — the user's answers ({ firstName, email }), shared by the
 * form and the results page, and kept in sessionStorage so a refresh on
 * /results still works (cleared when the browser tab closes).
 *
 * Vue 3 equivalent: a Pinia store
 *   state:   answers
 *   actions: setAnswer(name, value)
 * <FlowProvider> in the root layout ≈ app.use(pinia), and
 * useFlow() in a page ≈ const flow = useFlowStore().
 *
 * Reading sessionStorage: useSyncExternalStore treats it as an outside
 * "store" React can subscribe to. On the server (no sessionStorage) it
 * returns null, so the first browser render matches the HTML.
 */
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';

export type Answers = { firstName: string; email: string };
export type AnswerName = keyof Answers;

type FlowValue = {
  answers: Answers;
  /** False until the browser has read sessionStorage (always false on the server). */
  ready: boolean;
  setAnswer: (name: AnswerName, value: string) => void;
};

const STORAGE_KEY = 'juicebox:answers';
const CHANGE_EVENT = 'juicebox:answers-change';
const EMPTY: Answers = { firstName: '', email: '' };

// Fallback when sessionStorage is blocked or full (e.g. some private modes):
// keep the answers in memory, and read from there once a write has failed.
let memoryCopy: string | null = null;
let storageOk = true;

/** Raw saved JSON (or null). Must return the same string while nothing changed. */
function readRaw(): string | null {
  if (!storageOk) return memoryCopy;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    storageOk = false;
    return memoryCopy;
  }
}

/** Save and tell subscribers ≈ a Pinia $subscribe trigger. */
function writeRaw(raw: string) {
  memoryCopy = raw;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, raw);
  } catch {
    storageOk = false; // from now on readRaw() uses memoryCopy
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Re-render when our answers change. */
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** Turn saved JSON into answers, ignoring anything malformed. */
function parse(raw: string | null): Answers {
  if (!raw) return EMPTY;
  try {
    const data: Partial<Answers> = JSON.parse(raw);
    return {
      firstName: typeof data.firstName === 'string' ? data.firstName : '',
      email: typeof data.email === 'string' ? data.email : '',
    };
  } catch {
    return EMPTY;
  }
}

// createContext ≈ defining the store; the default value is never used
// because every page sits inside <FlowProvider>.
const FlowContext = createContext<FlowValue | null>(null);

/** Provides the answers to the whole app ≈ app.use(pinia). */
export function FlowProvider({ children }: { children: ReactNode }) {
  // Server snapshot is undefined ("not read yet"); the browser returns string | null.
  const raw = useSyncExternalStore(subscribe, readRaw, () => undefined);

  // useMemo ≈ computed(): only re-parse when the saved JSON changes.
  const answers = useMemo(() => parse(raw ?? null), [raw]);

  // useCallback keeps the same function between renders (stable action).
  const setAnswer = useCallback((name: AnswerName, value: string) => {
    writeRaw(JSON.stringify({ ...parse(readRaw()), [name]: value }));
  }, []);

  const value = useMemo(() => ({ answers, ready: raw !== undefined, setAnswer }), [answers, raw, setAnswer]);

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

/** Read the answers in a page ≈ const flow = useFlowStore(). */
export function useFlow(): FlowValue {
  const value = useContext(FlowContext);
  if (!value) throw new Error('useFlow must be used inside <FlowProvider>');
  return value;
}
