'use client';
/*
 * RouteFocus — after an in-app page change, puts keyboard focus at the start
 * of the new screen, so the next Tab reaches its first control (Go back)
 * instead of jumping to the end of the page (WCAG 2.4.3). Renders nothing.
 *
 * Vue 3 equivalent: router.afterEach(() => nextTick(() => focusScreen()))
 * in main.js.
 *
 * - Skipped on the first page load (the browser handles that).
 * - Skipped when the new page already focused something itself (the form
 *   puts the cursor in its field).
 */
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Focuses the new screen's root after client-side navigation. */
export default function RouteFocus() {
  const pathname = usePathname(); // ≈ useRoute().path
  const firstLoad = useRef(true);

  // ≈ watch(() => route.path, …). Runs after the new page's own effects.
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    if (document.activeElement && document.activeElement !== document.body) return;
    document.querySelector<HTMLElement>('[data-screen]')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
