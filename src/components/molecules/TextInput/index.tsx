/*
 * TextInput (molecule) — one text/email field in the Figma style, with its
 * error message and all the accessibility wiring:
 *   aria-invalid      → screen readers say "invalid entry"
 *   aria-describedby  → they read the error message after the label
 *   aria-live region  → the error is announced (politely) when it appears
 *
 * Vue 3 equivalent: molecules/TextInput/index.vue used with v-model:
 *   value + onChange(value) ≈ modelValue + emit('update:modelValue')
 *   action               ≈ <slot name="action" /> (here: the submit arrow)
 *
 * The visible label lives outside (the question in FormStep), linked by `id`
 * with <label htmlFor>, so this component only needs the input's id.
 */
import type { ReactNode, Ref } from 'react';
import { cx } from '@/lib/cx';
import styles from './index.module.css';

type TextInputProps = {
  /** Must match the <label htmlFor> that names this field. */
  id: string;
  name: string;
  type?: 'text' | 'email';
  value: string;
  /** ≈ emit('update:modelValue', value) */
  onChange: (value: string) => void;
  placeholder?: string;
  /** Lets browsers and phones autofill, e.g. "given-name", "email" (WCAG 1.3.5). */
  autoComplete?: string;
  maxLength?: number;
  /** Error text; when set, the field is marked invalid. */
  error?: string | null;
  /** Content shown inside the field on the right ≈ named slot "action". */
  action?: ReactNode;
  /** React 19: `ref` is a normal prop ≈ exposing the input via a template ref. */
  ref?: Ref<HTMLInputElement>;
};

/** Text field with an optional inline action and an accessible error message. */
export default function TextInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  maxLength,
  error,
  action,
  ref,
}: TextInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className={cx(styles.wrapper, error && styles.invalid)}>
      <div className={styles.field}>
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          // e.target.value ≈ $event.target.value in a Vue @input handler
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={styles.input}
        />
        {action}
      </div>

      {/* Always in the page, so screen readers watch it; it speaks politely when the
          message appears or changes (role="alert" would interrupt on every keystroke). */}
      <div aria-live="polite">
        {/* v-if="error" */}
        {error && (
          <p id={errorId} className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
