/*
 * AnswerSummary (molecule) — a short list of what the user typed, e.g.
 * "First name — Rezki", "Email — rezki@example.com".
 * Not in Figma: the PDF requires a summary of the user's input (R-RES-2).
 *
 * Vue 3 equivalent: molecules/AnswerSummary/index.vue with an `items` prop
 * and <template v-for> over <dt>/<dd> pairs.
 *
 * A description list (<dl>) is the semantic HTML for label/value pairs:
 * screen readers announce it as a list of terms and their values.
 */
import { cx } from '@/lib/cx';
import styles from './index.module.css';

export type SummaryItem = { label: string; value: string };

type AnswerSummaryProps = {
  items: readonly SummaryItem[];
  className?: string;
};

/** Label/value list of the user's answers. */
export default function AnswerSummary({ items, className }: AnswerSummaryProps) {
  return (
    <dl className={cx(styles.summary, className)}>
      {items.map((item) => (
        <div key={item.label} className={styles.row}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
