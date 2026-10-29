/*
 * Button (atom) — the 350 × 60 text button in its three Figma styles:
 *   primary → purple fill   ("Get a reality check")
 *   outline → 1px white line ("Continue" in the walkthrough)
 *   light   → white fill with an 8px soft ring ("Get started", results "Continue")
 *
 * Vue 3 equivalent: atoms/BaseButton/index.vue with a `variant` prop and
 * <component :is="href ? RouterLink : 'button'">.
 * `children` ≈ the default <slot /> (the label).
 *
 * Navigation uses a real link (<a>), actions use a real <button>: screen
 * readers announce the right role, and links can be opened in a new tab.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import type { LinkAction } from '@/lib/nav';
import styles from './index.module.css';

type Variant = 'primary' | 'outline' | 'light';

/**
 * Navigate (`href`, see lib/nav.ts) or act (`onClick` and/or
 * `type="submit"` inside a form) — never both.
 */
type ButtonAction =
  | (LinkAction & { type?: never })
  | { href?: never; onClick?: () => void; type?: 'button' | 'submit' };

type ButtonProps = ButtonAction & {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

/** Full-width text button; a link when `href` is given. */
export default function Button({ variant = 'primary', children, className, href, onClick, type = 'button' }: ButtonProps) {
  const classes = cx(styles.button, styles[variant], className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
