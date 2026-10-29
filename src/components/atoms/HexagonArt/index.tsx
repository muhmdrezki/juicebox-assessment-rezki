/*
 * HexagonArt (atom) — the Figma hexagon artwork ("Beauty.png" fill,
 * exported at 2×). Fills its parent, so the parent decides the size
 * (274 × 290 on home, 146 × 155 in the walkthrough).
 *
 * Vue 3 equivalent: atoms/HexagonArt/index.vue wrapping one <img>, with
 * v-bind="$attrs" passing extra attributes through (here `...rest`).
 *
 * Always decorative: alt="" so screen readers skip it.
 */
import Image, { type ImageProps } from 'next/image';
import { cx } from '@/lib/cx';
import styles from './index.module.css';

/** next/image props, minus the ones this atom fixes (source, alt, fill sizing). */
type HexagonArtProps = Omit<ImageProps, 'src' | 'alt' | 'fill' | 'width' | 'height'>;

/** The gradient hexagon picture; size it with the parent element. */
export default function HexagonArt({ sizes = '274px', className, ...rest }: HexagonArtProps) {
  // next/image ≈ <img> that Next resizes and serves as WebP/AVIF.
  return <Image src="/images/hexagon.png" alt="" fill sizes={sizes} className={cx(styles.art, className)} {...rest} />;
}
