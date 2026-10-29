'use client';
/*
 * FlowHydration — loads the saved answers into the Zustand store once the
 * page is running in the browser. Renders nothing.
 *
 * Vue 3 equivalent: the line in main.js that restores a Pinia store from
 * sessionStorage after `app.mount()` (what pinia-plugin-persistedstate does
 * for you). Here it must wait until after hydration, so the first browser
 * render matches the server HTML.
 */
import { useEffect } from 'react';
import { useFlowStore } from '@/store/Flow';

/** Restores the Flow store from sessionStorage after mount (≈ onMounted). */
export default function FlowHydration() {
  useEffect(() => {
    void useFlowStore.persist.rehydrate();
  }, []);

  return null;
}
