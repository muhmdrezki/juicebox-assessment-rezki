/*
 * SubmitArrow (atom) — the 31px round arrow button inside the form input.
 * Figma: circle #FFF 60% at 50% opacity, white "Arrow up" icon.
 *
 * Vue 3 equivalent: atoms/SubmitArrow/index.vue rendering
 * <button type="submit" :aria-label="label">.
 *
 * `ready` brightens it once there is something to send (the design only
 * shows the empty state — decision 2026-10-29).
 */
import { ArrowUpIcon } from '@/components/atoms/Icon';
import { cx } from '@/lib/cx';
import styles from './index.module.css';

type SubmitArrowProps = {
  /** Accessible name, e.g. "Continue" (the icon is hidden). */
  label: string;
  /** True when the field has a value: full opacity. */
  ready?: boolean;
};

/** Round submit button with an up arrow. Submits the surrounding <form>. */
export default function SubmitArrow({ label, ready = false }: SubmitArrowProps) {
  return (
    <button type="submit" className={cx(styles.submit, ready && styles.ready)} aria-label={label}>
      <ArrowUpIcon />
    </button>
  );
}
