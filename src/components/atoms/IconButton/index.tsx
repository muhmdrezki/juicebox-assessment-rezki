/*
 * IconButton (atom) — the 46px round glass button (back, restart).
 *
 * Vue 3 equivalent: atoms/IconButton/index.vue rendering
 * <component :is="href ? RouterLink : 'button'">. React has no <component :is>,
 * so we branch with a plain `if`.
 *
 * Props ≈ defineProps(): `href` makes it a link (navigation),
 * `onClick` ≈ emit('click') makes it a button (an action).
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { transitionTypesFor, type NavAction } from '@/lib/nav';
import styles from './index.module.css';

// `href` or `onClick`, never both (see lib/nav.ts).
type IconButtonProps = NavAction & {
  /** Accessible name, read by screen readers (the icon itself is hidden). */
  label: string;
  /** The icon to show, e.g. <ArrowLeftIcon /> ≈ the default <slot />. */
  icon: ReactNode;
  className?: string;
};

/** Round icon-only control; a link when `href` is given, otherwise a button. */
export default function IconButton({ label, icon, href, direction, onClick, className }: IconButtonProps) {
  const classes = cx(styles.iconButton, className);

  // <Link> ≈ <RouterLink>: client-side navigation, renders a real <a>.
  if (href !== undefined) {
    return (
      <Link href={href} className={classes} aria-label={label} transitionTypes={transitionTypesFor(direction)}>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={label}>
      {icon}
    </button>
  );
}
