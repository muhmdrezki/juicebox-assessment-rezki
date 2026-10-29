/*
 * HexagonArt (atom) — the Figma hexagon artwork ("Beauty.png" fill,
 * exported at 2×).
 *
 * Vue 3 equivalent: atoms/HexagonArt/index.vue wrapping one <img>, with
 * v-bind="$attrs" passing extra attributes through (here `...rest`).
 *
 * Two ways to size it:
 * - no `box`: the image fills its parent (the home hero animates its own box);
 * - `box="small"` (146 × 155, walkthrough) or `box="desktopOnly"` (hidden on
 *   phones, form): the atom renders its own box, and on desktop both grow to
 *   the same large size, so pages don't repeat that CSS. `className` then
 *   goes on the box (e.g. page margins).
 *
 * Always decorative: alt="" so screen readers skip it.
 */
import Image, { type ImageProps } from 'next/image';
import { cx } from '@/lib/cx';
import styles from './index.module.css';

/** next/image props, minus the ones this atom fixes (source, alt, fill sizing). */
type HexagonArtProps = Omit<ImageProps, 'src' | 'alt' | 'fill' | 'width' | 'height'> & {
  box?: 'small' | 'desktopOnly';
};

/** The gradient hexagon picture, filling its parent or its own box. */
export default function HexagonArt({ sizes = '274px', className, box, ...rest }: HexagonArtProps) {
  // next/image ≈ <img> that Next resizes and serves as WebP/AVIF.
  const image = (
    <Image src="/images/hexagon.png" alt="" fill sizes={sizes} className={cx(styles.art, !box && className)} {...rest} />
  );

  if (!box) return image;
  return <div className={cx(styles.box, styles[box], className)}>{image}</div>;
}
