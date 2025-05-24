import type { Metadata } from 'next';
// Removed Geist font imports
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

// Removed Geist font setup

export const metadata: Metadata = {
  title: 'FixMyPrompt',
  description: 'Refine your prompts to perfection with FixMyPrompt.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Removed font variables from body className, it will now use Satoshi from globals.css and Tailwind config */}
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
