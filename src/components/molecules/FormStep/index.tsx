/*
 * FormStep (molecule) — one screen of the form: the small hexagon and the
 * question (Prompt) at the top, and the field (passed in as children)
 * pinned to the bottom. Figma "Step 3" / "Step 4".
 *
 * Vue 3 equivalent: molecules/FormStep/index.vue with a `question` prop
 * and a default <slot /> for the input.
 *
 * The question IS the field's label (<label htmlFor>): visible, always
 * there, and read by screen readers when the input gets focus. It is also
 * the page's <h1>.
 */
import type { ReactNode } from 'react';
import HexIcon from '@/components/atoms/HexIcon';
import Prompt from '@/components/molecules/Prompt';
import styles from './index.module.css';

type FormStepProps = {
  /** id of the input this question labels. */
  inputId: string;
  question: string;
  /** The field ≈ default <slot />. */
  children: ReactNode;
};

/** Icon + question (as label) at the top, field at the bottom. */
export default function FormStep({ inputId, question, children }: FormStepProps) {
  return (
    <div className={styles.step}>
      <Prompt icon={<HexIcon />} spacing="lg">
        <h1>
          <label htmlFor={inputId}>{question}</label>
        </h1>
      </Prompt>

      <div className={styles.answer}>{children}</div>
    </div>
  );
}
