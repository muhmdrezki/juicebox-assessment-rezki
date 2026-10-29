/*
 * Shared prop types for anything that either navigates or performs an
 * action (Button, IconButton), plus the page-transition direction.
 *
 * Vue 3 equivalent: a shared prop validator / TS interface imported by
 * several components' defineProps<…>().
 */

/**
 * Which way a navigation goes, for the screen-to-screen slide
 * (forward slides the new screen in from the right, back from the left).
 * Leave it out and the screens only swap (the hexagon still morphs).
 */
export type NavDirection = 'forward' | 'back';

/** The React view-transition types for a direction ≈ a named <Transition> in Vue. */
export function transitionTypesFor(direction?: NavDirection): string[] | undefined {
  return direction ? [`nav-${direction}`] : undefined;
}

/** Navigate to a URL (renders a link). */
export type LinkAction = { href: string; onClick?: never; direction?: NavDirection };

/** Run a callback (renders a button). Only pass functions from 'use client' components. */
export type ClickAction = { href?: never; onClick: () => void; direction?: never };

/** Exactly one of the two — `?: never` makes TypeScript reject passing both. */
export type NavAction = LinkAction | ClickAction;
