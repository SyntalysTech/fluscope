import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fluscope.vercel.app'),
  title: 'Fluscope - Design flows. Ship with confidence.',
  description: 'Visual product flow canvas with a dual-layer audit engine. Detect logic gaps and UX risks instantly.',
  keywords: ['product design', 'user flow', 'UX audit', 'node builder', 'logic canvas', 'AI audit'],
  authors: [{ name: 'Syntalys' }],
  openGraph: {
    title: 'Fluscope - Design flows. Ship with confidence.',
    description: 'The skeleton for your product flows. Structural validation, AI audits, and zero friction.',
    url: 'https://fluscope.vercel.app',
    siteName: 'Fluscope',
    images: [
      {
        url: '/logos/logo-horizontal-text-alone-1600x400.png',
        width: 1200,
        height: 300,
        alt: 'Fluscope - Design & Audit Flows',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluscope - Logic-First Design',
    description: 'Stop shipping broken flows. Start auditing with Fluscope.',
    images: ['/logos/logo-horizontal-text-alone-1600x400.png'],
  },
  icons: {
    icon: '/logos/logo-favicon-64x64.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased text-slate-200 bg-[#0F172A]`}>
        {children}
      </body>
    </html>
  );
}
