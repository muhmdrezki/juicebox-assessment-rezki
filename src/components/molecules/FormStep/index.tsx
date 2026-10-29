'use client';
/*
 * FormStep (molecule) — one screen of the form: the small hexagon and the
 * question (Prompt) at the top, and the field (passed in as children)
 * pinned to the bottom. Figma "Step 3" / "Step 4".
 *
 * Vue 3 equivalent: molecules/FormStep/index.vue with a `question` prop,
 * a default <slot /> for the input, and GSAP in onMounted + watch(question).
 *
 * The question IS the field's label (<label htmlFor>): visible, always
 * there, and read by screen readers when the input gets focus. It is also
 * the page's <h1>.
 *
 * Motion (Figma prototype: "smart animate" into Step 3):
 * - the question rises in on arrival and again on every new question (the icon
 *   stays still: it is the target of the page-transition hexagon morph);
 * - the field fades in once on arrival — opacity only, never `visibility`,
 *   so it stays focusable (the cursor is put in it straight away).
 * Reduced motion: no animation; [data-fade] is only pre-hidden when motion is OK.
 */
import { useRef, type ReactNode } from 'react';
import HexIcon from '@/components/atoms/HexIcon';
import Prompt from '@/components/molecules/Prompt';
import { gsap, useGSAP } from '@/lib/gsap';
import { HEXAGON_MORPH } from '@/lib/morph';
import { MOTION_OK_QUERY } from '@/lib/motion';
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
  const root = useRef<HTMLDivElement>(null);

  // ≈ watch(() => props.question, …, { immediate: true }): the question rises in
  // on arrival and whenever the question changes (step 1 ↔ 2).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        gsap.fromTo('[data-fade="prompt"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [question], revertOnUpdate: true },
  );

  // ≈ onMounted: the field fades in once (not on step change, so the phone keyboard stays steady).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        gsap.fromTo('[data-fade="field"]', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.25, ease: 'power1.out' });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.step}>
      {/* HEXAGON_MORPH.mobile: on phones the walkthrough hexagon shrinks into this icon
          on "Get started" (on desktop the big hexagon on the left takes that role).
          The icon itself is not animated here, so the morph lands exactly on it. */}
      <Prompt icon={<HexIcon className={HEXAGON_MORPH.mobile} />} spacing="lg">
        <h1 data-fade="prompt">
          <label htmlFor={inputId}>{question}</label>
        </h1>
      </Prompt>

      <div className={styles.answer} data-fade="field">
        {children}
      </div>
    </div>
  );
}
