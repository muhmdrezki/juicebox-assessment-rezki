/*
 * Dots (atom) — the walkthrough progress indicator: one dot per step, the
 * current one in brand purple. Figma "Dots": 8px dots, 8px gap.
 *
 * Vue 3 equivalent: atoms/Dots/index.vue with props { count, active } and
 * a v-for over Array.from({ length: count }).
 *
 * Visual only (aria-hidden): screen readers already hear "2 of 3" from the
 * slider itself, so the dots are not clickable and not announced
 * (decision 2026-10-29: keep Figma's 25% white for inactive dots).
 */
import { cx } from '@/lib/cx';
import styles from './index.module.css';

type DotsProps = {
  count: number;
  /** Zero-based index of the current step. */
  active: number;
  className?: string;
};

/** Row of progress dots; `active` is highlighted. */
export default function Dots({ count, active, className }: DotsProps) {
  return (
    <div className={cx(styles.dots, className)} aria-hidden="true">
      {/* v-for="i in count" :key="i" */}
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={cx(styles.dot, i === active && styles.active)} />
      ))}
    </div>
  );
}
