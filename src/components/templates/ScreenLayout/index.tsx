/*
 * ScreenLayout (template) — the skeleton every screen uses:
 *   header / media (the hexagon) / content / action bar at the bottom.
 *
 * Vue 3 equivalent: templates/ScreenLayout/index.vue with slots:
 *   children ≈ the default <slot />
 *   media    ≈ <slot name="media" />
 *   actions  ≈ <slot name="actions" />
 * React has no named slots, so named slots are just props that hold JSX.
 *
 * Mobile: one column, actions pinned to the bottom (as in Figma).
 * Desktop (≥1024px, our own design): media on the left, content + actions
 * on the right.
 */
import type { NavAction } from '@/lib/nav';
import AppHeader from '@/components/organisms/AppHeader';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './index.module.css';

type ScreenLayoutProps = {
  /** Back button behaviour; omit to hide it (homepage). */
  back?: NavAction;
  /** Visual area above the content, e.g. the Lottie hexagon. */
  media?: ReactNode;
  /** Bottom action bar, e.g. the primary button. */
  actions?: ReactNode;
  children: ReactNode;
};

/** Page shell: header, optional media, main content and bottom actions. */
export default function ScreenLayout({ back, media, actions, children }: ScreenLayoutProps) {
  return (
    // data-screen + tabIndex={-1}: RouteFocus can focus the screen after a page change
    // (not reachable with Tab itself), so the next Tab lands on "Go back".
    <div className={styles.screen} data-screen="" tabIndex={-1}>
      <AppHeader back={back} />

      <main className={cx(styles.main, media ? styles.withMedia : null)}>
        {media && <div className={styles.media}>{media}</div>}
        <div className={styles.content}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </main>
    </div>
  );
}
