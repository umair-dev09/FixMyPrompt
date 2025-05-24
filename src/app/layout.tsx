
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Fallback for local dev

export const metadata: Metadata = {
  title: 'FixMyPrompt | AI-Powered Prompt Refinement Tool',
  description: 'Elevate your AI interactions with FixMyPrompt. Transform simple ideas into powerful, precise prompts for ChatGPT, Gemini, and more. Get multiple AI-optimized variations in seconds.',
  keywords: ['AI prompt generator', 'prompt engineering', 'refine prompts', 'AI writing assistant', 'ChatGPT prompts', 'Gemini prompts', 'LLM prompts', 'FixMyPrompt'],
  robots: 'index, follow',
  themeColor: [ // Adapted from your globals.css primary colors
    { media: '(prefers-color-scheme: light)', color: 'hsl(320, 53%, 30%)' }, // Deep Purple (Darker for Light Theme UI)
    { media: '(prefers-color-scheme: dark)', color: 'hsl(320, 53%, 35%)' },  // Deep Purple (Brighter for Dark Theme UI)
  ],
  manifest: '/manifest.json', // Assuming you might add a manifest later
  openGraph: {
    title: 'FixMyPrompt | AI-Powered Prompt Refinement Tool',
    description: 'Transform your ideas into powerful, precise AI prompts with FixMyPrompt.',
    url: siteUrl,
    siteName: 'FixMyPrompt',
    images: [
      {
        url: 'https://placehold.co/1200x630.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'FixMyPrompt - AI Prompt Refinement Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FixMyPrompt | AI-Powered Prompt Refinement Tool',
    description: 'Elevate your AI interactions with FixMyPrompt. Get optimized prompts in seconds.',
    // site: '@yourtwitterhandle', // Add your Twitter handle if you have one
    // creator: '@yourtwitterhandle',
    images: ['https://placehold.co/1200x630.png'], // Replace with your actual Twitter card image URL
  },
  // For more specific App Router metadata options:
  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* The body will now use Poppins font via globals.css and Tailwind config */}
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
