import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { DataProvider } from '@/hooks/use-data-store';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Adherence Insights Explorer',
  description: 'A powerful, single-session analytics tool for clinical pharmacologists and researchers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', inter.variable)}>
        <DataProvider>
          {children}
          <Toaster />
        </DataProvider>
      </body>
    </html>
  );
}
