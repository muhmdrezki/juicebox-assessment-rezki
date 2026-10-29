/*
 * Root layout — wraps every route. Loads the fonts, tokens and global CSS.
 *
 * Vue 3 equivalent: `index.html` + `App.vue` + `main.js` in one file.
 * `children` is the current route's page, like <router-view /> in App.vue.
 * This is a Server Component (no 'use client'), so it renders on the server
 * only and ships no JavaScript to the browser.
 */
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import FlowHydration from '@/providers/FlowHydration';
import SmoothScroll from '@/providers/SmoothScroll';
import '@/styles/tokens.css';
import './globals.css';

// next/font self-hosts the font files and exposes each one as a CSS variable
// on <html>. tokens.css reads them in --font-heading / --font-body.
// Vue equivalent: an @font-face block in app.scss, but Next also preloads
// the files and prevents layout shift while they load.
const bagoss = localFont({
  src: '../fonts/BagossStandard-Regular.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-bagoss',
});

const sohne = localFont({
  src: '../fonts/Sohne-Buch.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-sohne',
});

// Page <title> and description. Child routes set only `title`, and the
// template adds the brand: "Your details | juicebox" (WCAG 2.4.2).
// Vue equivalent: route `meta.title` + a router.afterEach that sets document.title.
export const metadata: Metadata = {
  title: {
    template: '%s | juicebox',
    default: 'juicebox — Get a reality check',
  },
  description: 'Compare your thoughts on technology with current industry opinions.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0d10', // --color-bg (tokens can't be read here)
};

/** Root layout: the <html> shell every page renders inside. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bagoss.variable} ${sohne.variable}`}>
      <body>
        {/* Without JavaScript nothing animates, so show the [data-reveal] content. */}
        <noscript>
          <style>{'[data-reveal] { visibility: visible !important; }'}</style>
        </noscript>
        {/* Restores the saved answers (Zustand store) after the page loads in the browser. */}
        <FlowHydration />
        {/* ≈ app.use(SmoothScrollPlugin): Lenis for every page */}
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
