/*
 * Prompt (molecule) — the "chatbot" block at the top of the form and results
 * screens: a small hexagon, then the Bagoss 19px text under it.
 * Figma "Chatbot textbox": padding 24 top, centred, icon → text gap
 * 32px on the form (`spacing="lg"`) and 24px on the results (`spacing="md"`).
 *
 * Vue 3 equivalent: molecules/Prompt/index.vue with <slot name="icon" />
 * and a default <slot /> for the text.
 */
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './index.module.css';

type PromptProps = {
  /** The hexagon (static HexIcon or animated HexBadge) ≈ named slot "icon". */
  icon: ReactNode;
  /** Gap between icon and text, from Figma. */
  spacing: 'md' | 'lg';
  /** The heading/text ≈ default slot. Gets the Bagoss 19px style. */
  children: ReactNode;
};

/** Icon above centred prompt text. */
export default function Prompt({ icon, spacing, children }: PromptProps) {
  return (
    <div className={cx(styles.prompt, styles[spacing])}>
      {icon}
      <div className={styles.text}>{children}</div>
    </div>
  );
}
