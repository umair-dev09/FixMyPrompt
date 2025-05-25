
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  title: 'FixMyPrompt | AI-Powered Prompt Refinement Tool',
  description: 'Elevate your AI interactions with FixMyPrompt. Transform simple ideas into powerful, precise prompts for ChatGPT, Gemini, and more. Get multiple AI-optimized variations in seconds.',
  keywords: ['AI prompt generator', 'prompt engineering', 'refine prompts', 'AI writing assistant', 'ChatGPT prompts', 'Gemini prompts', 'LLM prompts', 'FixMyPrompt', 'prompt optimizer', 'AI tool'],
  robots: 'index, follow',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(320, 53%, 30%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(320, 53%, 35%)' },
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: 'FixMyPrompt | AI-Powered Prompt Refinement Tool',
    description: 'Transform your ideas into powerful, precise AI prompts with FixMyPrompt. Your expert prompt engineering assistant.',
    url: siteUrl,
    siteName: 'FixMyPrompt',
    images: [
      {
        url: `${siteUrl}/images/og-banner.png`, // Replace with your actual image URL
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
    images: [`${siteUrl}/images/og-banner.png`], // Replace with your actual image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4803528052284969`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased font-poppins">
        <Providers>
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
