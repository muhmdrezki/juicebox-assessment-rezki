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
 * Page transitions: the whole screen is wrapped in React's <ViewTransition>
 * ≈ Vue's <Transition> around <router-view>. A navigation tagged
 * "nav-forward" slides the new screen in from the right, "nav-back" from the
 * left (CSS in globals.css); the header and the hexagon have their own
 * names, so they stay put / morph instead of sliding. This sits here (rendered
 * by every page) and not in a Next layout.tsx, because layouts stay mounted
 * across navigations and would never "enter" or "exit".
 *
 * Mobile: one column, actions pinned to the bottom (as in Figma).
 * Desktop (≥1024px, our own design): media on the left, content + actions
 * on the right.
 */
import { ViewTransition, type ReactNode } from 'react';
import AppHeader from '@/components/organisms/AppHeader';
import { cx } from '@/lib/cx';
import type { NavAction } from '@/lib/nav';
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

/** Which CSS animation runs for each transition type; untyped changes don't slide. */
const SLIDE = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' };

/** Page shell: header, optional media, main content and bottom actions. */
export default function ScreenLayout({ back, media, actions, children }: ScreenLayoutProps) {
  return (
    <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
      {/* data-screen + tabIndex={-1}: RouteFocus can focus the screen after a page change
          (not reachable with Tab itself), so the next Tab lands on "Go back". */}
      <div className={styles.screen} data-screen="" tabIndex={-1}>
        <AppHeader back={back} />

        <main className={cx(styles.main, media ? styles.withMedia : null)}>
          {media && <div className={styles.media}>{media}</div>}
          <div className={styles.content}>{children}</div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </main>
      </div>
    </ViewTransition>
  );
}
