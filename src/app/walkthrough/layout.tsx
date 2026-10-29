/*
 * Walkthrough route layout — only sets the page <title> (WCAG 2.4.2).
 *
 * Vue 3 equivalent: `meta: { title: 'How it works' }` on the route record.
 * Needed because page.tsx is a client component ('use client'), and Next
 * only reads `metadata` from server files.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'How it works',
};

/** Passes the page through unchanged. */
export default function WalkthroughLayout({ children }: { children: ReactNode }) {
  return children;
}
