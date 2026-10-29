/*
 * Homepage route ("/").
 *
 * Vue 3 equivalent: pages/Home/index.vue registered at path '/'.
 * In Next.js the folder path IS the route: app/page.tsx → "/".
 *
 * Phase (a) placeholder: shows the layout, fonts and header only.
 * The Lottie hexagon, GSAP, Lenis and the button arrive in phase (b).
 */
import ScreenLayout from '@/components/templates/ScreenLayout';
import styles from './page.module.css';

/** Homepage (placeholder until phase b). */
export default function HomePage() {
  return (
    <ScreenLayout>
      <h1 className={styles.headline}>
        Compare your thoughts on <span className={styles.highlight}>technology</span> with current
        industry opinions.
      </h1>
    </ScreenLayout>
  );
}
