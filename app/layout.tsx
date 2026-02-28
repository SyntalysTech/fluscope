import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fluscope - Inspect your product flows',
  description: 'Draw your product flow. Fluscope detects missing states, logic gaps and UX risks.',
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
