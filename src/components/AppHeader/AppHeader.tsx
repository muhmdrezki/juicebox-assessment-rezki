import Image from 'next/image';
import Link from 'next/link';
import styles from './AppHeader.module.css';

type AppHeaderProps = {
  /** Link target for the back button. */
  backHref?: string;
  /** Click handler for the back button (e.g. previous form step). */
  onBack?: () => void;
};

export default function AppHeader({ backHref, onBack }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      {backHref && (
        <Link href={backHref} className={`${styles.iconButton} ${styles.back}`} aria-label="Go back">
          <ArrowLeftIcon />
        </Link>
      )}
      {!backHref && onBack && (
        <button type="button" onClick={onBack} className={`${styles.iconButton} ${styles.back}`} aria-label="Go back">
          <ArrowLeftIcon />
        </button>
      )}

      <Image
        className={styles.logo}
        src="/juicebox-logo.svg"
        alt="juicebox"
        width={124}
        height={29}
        priority
      />

      <Link href="/" className={`${styles.iconButton} ${styles.restart}`} aria-label="Start over">
        <RestartIcon />
      </Link>
    </header>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M14 8H2m0 0 5-5M2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13 6.5A5.5 5.5 0 0 0 3.2 4.6M3 9.5a5.5 5.5 0 0 0 9.8 1.9M3 2v3h3m7 9v-3h-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
