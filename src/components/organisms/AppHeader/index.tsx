/*
 * AppHeader (organism) — top bar: back button | logo | restart button.
 * Figma "Variant4": 390 × 86, horizontal, space-between, 20px side padding.
 *
 * Vue 3 equivalent: organisms/AppHeader/index.vue. It only takes props and
 * never touches the store, so any page can reuse it.
 */
import IconButton, { type NavAction } from '@/components/atoms/IconButton';
import Logo from '@/components/atoms/Logo';
import { ArrowLeftIcon, RestartIcon } from '@/components/atoms/Icon';
import styles from './index.module.css';

type AppHeaderProps = {
  /** Back button: go to a URL or run a callback. Omit to hide it (homepage). */
  back?: NavAction;
};

/** Shared header used by every screen. Restart always goes to the homepage. */
export default function AppHeader({ back }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      {/* Left slot: empty on the homepage, keeps the logo centred. */}
      <div className={styles.side}>
        {/* {...back} spreads { href } or { onClick } as props ≈ v-bind="back" */}
        {back && <IconButton label="Go back" icon={<ArrowLeftIcon />} {...back} />}
      </div>

      <Logo />

      <div className={`${styles.side} ${styles.end}`}>
        <IconButton label="Start over" icon={<RestartIcon />} href="/" />
      </div>
    </header>
  );
}
