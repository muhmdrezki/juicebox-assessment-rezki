import AppHeader from '@/components/AppHeader/AppHeader';
import styles from './Screen.module.css';

type ScreenProps = {
  backHref?: string;
  onBack?: () => void;
  className?: string;
  children: React.ReactNode;
};

/** Page shell shared by every route: header + full-height main column. */
export default function Screen({ backHref, onBack, className, children }: ScreenProps) {
  return (
    <div className={styles.screen}>
      <AppHeader backHref={backHref} onBack={onBack} />
      <main className={`${styles.main} ${className ?? ''}`}>{children}</main>
    </div>
  );
}
