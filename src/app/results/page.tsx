'use client';
/*
 * Results route ("/results") — Figma "Step 5": the result message with the
 * user's name, a summary of their answers (PDF requirement) and the Lottie
 * hexagon. "Continue" goes back to the homepage.
 *
 * Vue 3 equivalent: pages/Results/index.vue reading the Pinia store, with a
 * route guard (beforeEnter) that sends users without answers to /form.
 * Here the "guard" is an effect, because the saved answers are only loaded
 * once the page runs in the browser (`hydrated`). Unlike beforeEnter, the
 * header (and desktop hexagon) show for a moment before the redirect.
 */
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Button from '@/components/atoms/Button';
import HexagonArt from '@/components/atoms/HexagonArt';
import { HEXAGON_MORPH } from '@/lib/morph';
import Reveal from '@/components/atoms/Reveal';
import AnswerSummary from '@/components/molecules/AnswerSummary';
import HexBadge from '@/components/molecules/HexBadge';
import Prompt from '@/components/molecules/Prompt';
import ScreenLayout from '@/components/templates/ScreenLayout';
import { validateEmail, validateFirstName } from '@/lib/validation';
import { useFlowHydration, useFlowStore } from '@/store/Flow';
import styles from './page.module.css';

/** Results: thanks message, answer summary and Continue → home. */
export default function ResultsPage() {
  const router = useRouter();
  const answers = useFlowStore((s) => s.answers); // ≈ storeToRefs(useFlowStore()).answers
  const hydrated = useFlowHydration(); // loads the saved answers after mount

  // Never trust saved data: show it trimmed, and check it with the same rules as the form (≈ computed()).
  const firstName = answers.firstName.trim();
  const email = answers.email.trim();
  const complete = !validateFirstName(firstName) && !validateEmail(email);

  // ≈ a route guard: once the saved answers are loaded, send incomplete visits
  // back to the form. replace() so "back" doesn't return to this empty page.
  useEffect(() => {
    if (hydrated && !complete) router.replace('/form');
  }, [hydrated, complete, router]);

  // Until the answers are loaded (a split second), show only the header — no "Thanks, !".
  const ready = hydrated && complete;

  return (
    <ScreenLayout
      back={{ href: '/form', direction: 'back' }}
      // Desktop: the big hexagon is "the hexagon" for the page-transition morph.
      media={<HexagonArt box="desktopOnly" className={HEXAGON_MORPH.desktop} sizes="370px" loading="eager" />}
      actions={
        ready ? (
          <Reveal delay={0.6}>
            <Button href="/" variant="light" direction="forward">
              Continue
            </Button>
          </Reveal>
        ) : undefined
      }
    >
      {ready && (
        <>
          {/* HEXAGON_MORPH.mobile: on phones the form's small icon carries over into this badge. */}
          <Prompt icon={<HexBadge className={HEXAGON_MORPH.mobile} />} spacing="md">
            <Reveal className={styles.message}>
              <h1>Thanks, {firstName}! Now, it’s time to get a reality check.</h1>
              <p>This will take 2-3 minutes.</p>
            </Reveal>
          </Prompt>

          <Reveal delay={0.3} className={styles.summary}>
            <h2 className="visually-hidden">Your answers</h2>
            <AnswerSummary
              items={[
                { label: 'First name', value: firstName },
                { label: 'Email', value: email },
              ]}
            />
          </Reveal>
        </>
      )}
    </ScreenLayout>
  );
}
