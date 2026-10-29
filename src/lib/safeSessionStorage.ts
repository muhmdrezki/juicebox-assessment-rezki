/*
 * safeSessionStorage — sessionStorage that never throws.
 * Some browsers block storage (private modes) or it can be full; then the
 * values are kept in memory for this page instead, and the app keeps working.
 * Used by the Zustand store's `persist` middleware.
 *
 * Vue 3 equivalent: the custom `storage` option you can give
 * pinia-plugin-persistedstate.
 */
import type { StateStorage } from 'zustand/middleware';

const memory = new Map<string, string>();

/** getItem / setItem / removeItem with an in-memory fallback. */
export const safeSessionStorage: StateStorage = {
  getItem(name) {
    // The memory copy is the newest value written on this page (if any).
    const inMemory = memory.get(name);
    if (inMemory !== undefined) return inMemory;
    try {
      return window.sessionStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    memory.set(name, value);
    try {
      window.sessionStorage.setItem(name, value);
    } catch {
      // blocked or full: the in-memory copy is used
    }
  },
  removeItem(name) {
    memory.delete(name);
    try {
      window.sessionStorage.removeItem(name);
    } catch {
      // nothing to remove
    }
  },
};
