'use client';
/*
 * HighlightText (atom) — a paragraph that "lights up" word by word, from
 * Figma's dimmed white (#FAFAFA 50%) to full white, while it is `active`.
 * Figma shows this effect frozen part-way; we animate it to the end
 * (decision 2026-10-29).
 *
 * Vue 3 equivalent: atoms/HighlightText/index.vue that splits `text` into
 * <span v-for="word in words"> and runs a GSAP stagger in
 * watch(() => props.active, …).
 *
 * - Screen readers get the sentence once, as plain text (visually hidden);
 *   the animated word spans are aria-hidden.
 * - The dim state is applied by GSAP, not CSS: if JavaScript fails, the
 *   text is simply full white.
 * - Reduced motion: GSAP doesn't run, so the text stays full white.
 * - Alignment is inherited from the parent (no text-align here).
 */
import { useRef } from 'react';
import { cx } from '@/lib/cx';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK_QUERY } from '@/lib/motion';
import styles from './index.module.css';

type HighlightTextProps = {
  text: string;
  /** Animate while true; when it turns false the words dim again. */
  active: boolean;
  className?: string;
};

/** Paragraph whose words brighten one after another while active. */
export default function HighlightText({ text, active, className }: HighlightTextProps) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  // ≈ watch(() => props.active, …, { immediate: true }).
  // Inactive: words wait dimmed. Active: they brighten one by one.
  // revertOnUpdate: the previous state is undone before each re-run.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const dim = getComputedStyle(root.current!).getPropertyValue('--text-dim-opacity') || '0.5';
        if (active) {
          gsap.fromTo(
            '[data-word]',
            { opacity: dim },
            { opacity: 1, duration: 0.4, stagger: 0.06, ease: 'none', delay: 0.2 },
          );
        } else {
          gsap.set('[data-word]', { opacity: dim });
        }
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <p ref={root} className={cx(styles.text, className)}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {/* v-for="(word, i) in words" — static copy, so the index is a stable key */}
        {words.map((word, i) => (
          <span key={i} data-word="">
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </p>
  );
}
