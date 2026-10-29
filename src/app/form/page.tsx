'use client';
/*
 * Form route ("/form") — Figma "Step 3" (first name) and "Step 4" (email).
 *
 * Vue 3 equivalent: pages/Form/index.vue. The page wires things together:
 *   const step = ref(0)                 → useState(0)
 *   const flow = useFlowStore()         → useFlowStore(selector) (Zustand, saved in sessionStorage)
 *   <MultiStepForm @update:value @next> → onValueChange / onStepComplete props
 *
 * Back: previous question (answers kept), or the walkthrough from the first.
 * After the last question: /results.
 */
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import HexagonArt from '@/components/atoms/HexagonArt';
import MultiStepForm, { type FormStepConfig } from '@/components/organisms/MultiStepForm';
import ScreenLayout from '@/components/templates/ScreenLayout';
import { useFlowHydration, useFlowStore, type AnswerName } from '@/store/Flow';
import { FIRST_NAME_MAX, validateEmail, validateFirstName } from '@/lib/validation';

/** The questions, in order. Copy from Figma. `name` is the key in the answers. */
const STEPS: readonly FormStepConfig<AnswerName>[] = [
  {
    name: 'firstName',
    question: 'Let’s start with the basics. Type in your first name.',
    placeholder: 'First name',
    type: 'text',
    autoComplete: 'given-name',
    maxLength: FIRST_NAME_MAX,
    validate: validateFirstName,
  },
  {
    name: 'email',
    question: 'How should we contact you? Type in your email address.',
    placeholder: 'Email address',
    type: 'email',
    autoComplete: 'email',
    validate: validateEmail,
    submitLabel: 'Submit',
  },
];

/** Multistep form: first name, then email, then the results page. */
export default function FormPage() {
  const [step, setStep] = useState(0); // ≈ const step = ref(0)
  // ≈ const { answers } = storeToRefs(useFlowStore()); const { setAnswer } = useFlowStore()
  useFlowHydration(); // prefill saved answers after mount
  const answers = useFlowStore((s) => s.answers);
  const setAnswer = useFlowStore((s) => s.setAnswer);
  const router = useRouter();

  function goBack() {
    if (step > 0) setStep(step - 1);
    else router.push('/walkthrough');
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else router.push('/results');
  }

  return (
    <ScreenLayout
      back={{ onClick: goBack }}
      media={
        // Desktop only (our design): the big hexagon in the left column.
        <HexagonArt box="desktopOnly" sizes="370px" loading="eager" />
      }
    >
      <MultiStepForm
        steps={STEPS}
        step={step}
        values={answers}
        onValueChange={setAnswer}
        onStepComplete={next}
      />
    </ScreenLayout>
  );
}
