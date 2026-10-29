'use client';
/*
 * HeroAnimation (organism) — the homepage visual: the hexagon with five short
 * statements floating around it, brought in by GSAP.
 *
 * Vue 3 equivalent: organisms/HeroAnimation/index.vue with a v-for over the
 * labels, an onMounted() that builds a gsap.timeline(), and a
 * @complete="revealArt" listener on the LottiePlayer child.
 *
 * The hexagon has two layers (decision 2026-10-29):
 *   1. the supplied Lottie — a flat #B488F2 hexagon that morphs (the Figma
 *      shape's base colour), played once;
 *   2. the Figma artwork (the gradient "Beauty.png" fill, exported 2×).
 * When the Lottie finishes, GSAP cross-fades it into the artwork, so the
 * final frame is pixel-perfect. If the Lottie is slow or fails to load, a
 * fallback timer cross-fades anyway.
 *
 * The whole block is decorative, so it is hidden from screen readers
 * (aria-hidden): the headline below carries the message.
 */
import { useRef } from 'react';
import HexagonArt from '@/components/atoms/HexagonArt';
import LottiePlayer from '@/components/atoms/LottiePlayer';
import { cx } from '@/lib/cx';
import { gsap, useGSAP } from '@/lib/gsap';
import { HEXAGON_MORPH } from '@/lib/morph';
import { MOTION_OK_QUERY } from '@/lib/motion';
import styles from './index.module.css';

/**
 * The floating statements from Figma. `id` picks the position class in
 * index.module.css; "\n" is a line break where Figma breaks the line.
 */
const LABELS = [
  { id: 'growth', text: 'WA businesses feel confident about future growth' },
  { id: 'creativity', text: 'AI cant replace creativity' },
  { id: 'sales', text: 'Sales measure true success' },
  { id: 'connection', text: 'Human connection drives WA business' },
  { id: 'barrier', text: 'The primary barrier to digital\ntransformation is financial investment' },
] as const;

/** Seconds to wait for the Lottie before showing the artwork anyway. */
const LOTTIE_FALLBACK_S = 4;

/**
 * True once the intro has finished in this visit. Coming back to the
 * homepage later (e.g. from the walkthrough) skips the intro and shows the
 * final state at once, so the page transition's hexagon morph has a visible
 * target to land on. Module-level ≈ a variable outside setup() in a Vue SFC.
 */
let introPlayed = false;

/** Homepage hero: Lottie hexagon → Figma artwork, plus floating labels. */
export default function HeroAnimation() {
  const root = useRef<HTMLDivElement>(null);
  // Set inside useGSAP (so it belongs to its GSAP context); called by the Lottie.
  const revealArt = useRef<() => void>(undefined);

  // `scope: root` ≈ selectors only search inside this component's own DOM.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        // Already seen this visit: final state straight away (artwork, labels), no intro.
        if (introPlayed) {
          gsap.set('[data-hero="hexagon"], [data-hero="label"], [data-hero="art"]', { autoAlpha: 1 });
          gsap.set('[data-hero="lottie"]', { autoAlpha: 0 });
          return;
        }

        gsap.set('[data-hero="art"]', { autoAlpha: 0 }); // hidden until the Lottie has played

        // Intro: hexagon grows in, then the labels appear one by one.
        // Marked as played only when it finishes (so React's dev double-run doesn't skip it).
        gsap
          .timeline({ defaults: { ease: 'power3.out' }, onComplete: () => void (introPlayed = true) })
          .fromTo('[data-hero="hexagon"]', { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 1.2 })
          .fromTo(
            '[data-hero="label"]',
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 },
            '-=0.7', // start before the hexagon finishes
          );

        // Cross-fade Lottie → artwork, once (whichever comes first: Lottie done or fallback).
        let done = false;
        revealArt.current = () => {
          if (done) return;
          done = true;
          gsap
            .timeline({ defaults: { duration: 0.8, ease: 'power1.inOut' } })
            .to('[data-hero="art"]', { autoAlpha: 1 })
            .to('[data-hero="lottie"]', { autoAlpha: 0 }, '<'); // '<' = same start time
        };
        gsap.delayedCall(LOTTIE_FALLBACK_S, () => revealArt.current?.());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.hero} aria-hidden="true">
      {/* HEXAGON_MORPH: morphs into the walkthrough's hexagon on "Get a reality check". */}
      <div className={cx(styles.hexagon, HEXAGON_MORPH.always)} data-hero="hexagon" data-reveal="">
        <div className={styles.lottie} data-hero="lottie">
          {/* onComplete ≈ @complete="revealArt" */}
          <LottiePlayer src="/lottie/hexagon.json" plays={1} onComplete={() => revealArt.current?.()} className={styles.fill} />
        </div>
        <HexagonArt sizes="(min-width: 1024px) 370px, 274px" preload data-hero="art" />
      </div>

      {/* v-for="label in LABELS" :key="label.id" */}
      {LABELS.map((label) => (
        <p key={label.id} className={cx(styles.label, styles[label.id])} data-hero="label" data-reveal="">
          {label.text}
        </p>
      ))}
    </div>
  );
}
