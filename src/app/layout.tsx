
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

export const metadata: Metadata = {
  title: 'FixMyPrompt | AI-Powered Prompt Refinement & Scoring Tool',
  description: 'Elevate your AI interactions with FixMyPrompt. Transform simple ideas into powerful, precise prompts with built-in quality scoring for ChatGPT, Gemini, and more. Get multiple AI-optimized variations in seconds.',
  keywords: ['AI prompt generator', 'prompt engineering', 'refine prompts', 'AI writing assistant', 'prompt quality score', 'prompt analytics', 'ChatGPT prompts', 'Gemini prompts', 'LLM prompts', 'FixMyPrompt', 'prompt optimizer', 'AI tool'],
  robots: 'index, follow',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(320, 53%, 30%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(320, 53%, 35%)' },
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: 'FixMyPrompt | AI-Powered Prompt Refinement & Scoring Tool',
    description: 'Transform your ideas into powerful, precise AI prompts with built-in quality scoring. Your expert prompt engineering assistant.',
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
    title: 'FixMyPrompt | AI-Powered Prompt Refinement & Scoring Tool',
    description: 'Elevate your AI interactions with FixMyPrompt. Get optimized prompts with quality scoring in seconds.',
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
        {adsensePublisherId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
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
