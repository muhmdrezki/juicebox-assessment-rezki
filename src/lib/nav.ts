/*
 * Shared prop types for anything that either navigates or performs an
 * action (Button, IconButton). One definition, so both behave the same.
 *
 * Vue 3 equivalent: a shared prop validator / TS interface imported by
 * several components' defineProps<…>().
 */

/** Navigate to a URL (renders a link). */
export type LinkAction = { href: string; onClick?: never };

/** Run a callback (renders a button). Only pass functions from 'use client' components. */
export type ClickAction = { href?: never; onClick: () => void };

/** Exactly one of the two — `?: never` makes TypeScript reject passing both. */
export type NavAction = LinkAction | ClickAction;
