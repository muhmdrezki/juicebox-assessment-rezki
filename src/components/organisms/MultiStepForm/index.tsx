'use client';
/*
 * MultiStepForm (organism) — shows one question at a time from a list of
 * step configs, validates on submit, and moves keyboard focus.
 *
 * Vue 3 equivalent: organisms/MultiStepForm/index.vue with props
 * { steps, step, values } and emits('update:value', name, value) /
 * emits('next'). The page owns the step index and the answers; this
 * component only renders, validates and reports.
 *
 * Adding a question = adding one entry to the `steps` config in the page.
 *
 * Validation UX:
 * - nothing is red while the user hasn't tried to continue;
 * - after a failed "Continue", the error updates live as they type
 *   (it is computed from the value, not stored);
 * - focus goes back to the field so the error is read with it.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import SubmitArrow from '@/components/atoms/SubmitArrow';
import FormStep from '@/components/molecules/FormStep';
import TextInput from '@/components/molecules/TextInput';
import type { Validator } from '@/lib/validation';
import styles from './index.module.css';

/** One question. `N` is the set of answer names, e.g. "firstName" | "email" (TS generic ≈ a typed prop). */
export type FormStepConfig<N extends string = string> = {
  name: N;
  question: string;
  placeholder: string;
  type: 'text' | 'email';
  autoComplete: string;
  maxLength?: number;
  validate: Validator;
  /** Accessible name of the arrow button; defaults to "Continue". */
  submitLabel?: string;
};

type MultiStepFormProps<N extends string> = {
  steps: readonly FormStepConfig<N>[];
  /** Index of the current step (owned by the page). */
  step: number;
  values: Readonly<Record<N, string>>;
  /** ≈ emit('update:value', name, value) */
  onValueChange: (name: N, value: string) => void;
  /** Current step is valid ≈ emit('next'). The page decides what comes next. */
  onStepComplete: () => void;
};

/** One-question-at-a-time form with validation and focus management. */
export default function MultiStepForm<N extends string>({
  steps,
  step,
  values,
  onValueChange,
  onStepComplete,
}: MultiStepFormProps<N>) {
  const current = steps[step];
  const value = values[current.name] ?? '';
  const input = useRef<HTMLInputElement>(null);

  // The step on which the user last pressed Continue with an invalid value.
  // Errors only show for that step ≈ a `touched` flag in VeeValidate.
  const [triedStep, setTriedStep] = useState<number | null>(null);
  const error = triedStep === step ? current.validate(value) : null; // ≈ computed()

  // ≈ watch(step, …, { immediate: true }): put the cursor in the new field
  // (also on arrival, like the open keyboard in the Figma design).
  useEffect(() => {
    input.current?.focus();
  }, [step]);

  // ≈ @submit.prevent="submit"
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (current.validate(value)) {
      setTriedStep(step);
      input.current?.focus();
      return;
    }
    setTriedStep(null); // the next step starts clean
    onValueChange(current.name, value.trim());
    onStepComplete();
  }

  return (
    // noValidate: we show our own messages instead of the browser's pop-ups.
    <form className={styles.form} noValidate onSubmit={submit}>
      {/* When Enter moves on, React reuses the same <input> (so the phone keyboard
          stays open), but focus doesn't "arrive" again and the new question isn't
          read. This polite live region announces it instead. */}
      <p className="visually-hidden" aria-live="polite">
        {`Question ${step + 1} of ${steps.length}: ${current.question}`}
      </p>

      <FormStep inputId={`field-${current.name}`} question={current.question}>
        <TextInput
          ref={input}
          id={`field-${current.name}`}
          name={current.name}
          type={current.type}
          value={value}
          onChange={(next) => onValueChange(current.name, next)}
          placeholder={current.placeholder}
          autoComplete={current.autoComplete}
          maxLength={current.maxLength}
          error={error}
          action={<SubmitArrow label={current.submitLabel ?? 'Continue'} ready={value.trim() !== ''} />}
        />
      </FormStep>
    </form>
  );
}
