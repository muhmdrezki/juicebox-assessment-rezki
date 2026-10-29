/*
 * Results route layout — only sets the page <title> (WCAG 2.4.2).
 *
 * Vue 3 equivalent: `meta: { title: 'Your reality check' }` on the route record.
 * Needed because page.tsx is a client component, and Next only reads
 * `metadata` from server files.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Your reality check',
};

/** Passes the page through unchanged. */
export default function ResultsLayout({ children }: { children: ReactNode }) {
  return children;
}
