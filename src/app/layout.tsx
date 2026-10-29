import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@/styles/tokens.css';
import './globals.css';

const graphik = localFont({
  src: '../fonts/Graphik-Regular.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-graphik',
});

export const metadata: Metadata = {
  title: 'juicebox — Get a reality check',
  description: 'Compare your thoughts on technology with current industry opinions.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0d11',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={graphik.variable}>
      <body>{children}</body>
    </html>
  );
}
