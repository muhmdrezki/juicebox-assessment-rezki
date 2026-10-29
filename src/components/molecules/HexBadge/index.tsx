'use client';
/*
 * HexBadge (molecule) — the small hexagon on the results page, brought to
 * life by the supplied Lottie (a hexagon of the same shape) as a
 * "submitted" moment. It plays once, then hands over to the exact Figma icon.
 *
 * Vue 3 equivalent: molecules/HexBadge/index.vue stacking <HexIcon> and
 * <LottiePlayer @ready="stage = 'lottie'" @complete="stage = 'done'">,
 * with v-show on each layer.
 *
 * Stages: 'icon' (Lottie loading, or can't play: reduced motion / failed)
 *       → 'lottie' (playing; icon hidden)
 *       → 'done' (finished; Lottie hidden, Figma icon shown — pixel-perfect).
 * If the Lottie loads slowly, the icon is briefly replaced by its first frame.
 * CSS recolours the Lottie to Figma's icon colour (#CDAAFF).
 */
import { useState } from 'react';
import HexIcon from '@/components/atoms/HexIcon';
import LottiePlayer from '@/components/atoms/LottiePlayer';
import { cx } from '@/lib/cx';
import styles from './index.module.css';

type Stage = 'icon' | 'lottie' | 'done';

/** Small hexagon: Lottie once, then the Figma icon. Decorative. */
export default function HexBadge() {
  const [stage, setStage] = useState<Stage>('icon'); // ≈ const stage = ref('icon')

  return (
    <div className={styles.badge} aria-hidden="true">
      <HexIcon className={cx(stage === 'lottie' && styles.hidden)} />
      <LottiePlayer
        src="/lottie/hexagon.json"
        plays={1}
        onReady={() => setStage('lottie')}
        onComplete={() => setStage('done')}
        className={cx(styles.lottie, stage === 'done' && styles.hidden)}
      />
    </div>
  );
}
