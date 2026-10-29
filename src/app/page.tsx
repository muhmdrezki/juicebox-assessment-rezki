/*
 * Homepage route ("/") — Figma "Step 1".
 *
 * Vue 3 equivalent: pages/Home/index.vue registered at path '/'.
 * In Next.js the folder path IS the route: app/page.tsx → "/".
 *
 * This page stays a Server Component (rendered to HTML on the server); only
 * the animated pieces inside it (HeroAnimation, Reveal) run in the browser.
 * It fills the ScreenLayout template's slots:
 *   media   ≈ <template #media>   → the hexagon hero
 *   actions ≈ <template #actions> → the button
 *   children ≈ default slot      → the headline
 */
import Button from '@/components/atoms/Button';
import Reveal from '@/components/atoms/Reveal';
import HeroAnimation from '@/components/organisms/HeroAnimation';
import ScreenLayout from '@/components/templates/ScreenLayout';
import styles from './page.module.css';

/** Homepage: animated hero, headline and the button into the walkthrough. */
export default function HomePage() {
  return (
    <ScreenLayout
      media={<HeroAnimation />}
      actions={
        <Reveal delay={0.6}>
          {/* Figma prototype: this button opens the walkthrough (decision 2026-10-29). */}
          <Button href="/walkthrough" variant="primary">
            Get a reality check
          </Button>
        </Reveal>
      }
    >
      <Reveal delay={0.4}>
        <h1 className={styles.headline}>
          Compare your thoughts on <span className={styles.highlight}>technology</span> with current
          industry opinions.
        </h1>
      </Reveal>
    </ScreenLayout>
  );
}
