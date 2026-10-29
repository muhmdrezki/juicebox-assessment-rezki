'use client';
/*
 * Reveal (atom) — fades and lifts its content in with GSAP when it mounts.
 * Reused on every screen (headline, buttons, copy) instead of repeating
 * the same tween.
 *
 * Vue 3 equivalent: a wrapper component with <slot /> and an onMounted()
 * that runs a GSAP tween on the root element ($refs.root).
 *
 * 'use client' marks this as a browser component (it needs effects).
 * Server components are the default in Next.js; Vue has no such split.
 *
 * Reduced motion: GSAP only runs when motion is OK; otherwise the content is
 * simply shown (globals.css only hides [data-reveal] when motion is OK).
 */
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK_QUERY } from '@/lib/motion';

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before the reveal starts, to sequence elements. */
  delay?: number;
  className?: string;
};

/** Wraps content and reveals it (fade + rise) once on mount. */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  // useRef ≈ a template ref: ref="root" + this.$refs.root (or `const root = ref(null)`).
  const root = useRef<HTMLDivElement>(null);

  // useGSAP ≈ onMounted(() => …) whose tweens are auto-reverted on unmount.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        gsap.fromTo(
          root.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className} data-reveal="">
      {children}
    </div>
  );
}
