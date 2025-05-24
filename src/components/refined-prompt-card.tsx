
'use client';

import React, { useState } from 'react'; // Added useState
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RefinedPromptClient } from '@/types';

interface RefinedPromptCardProps {
  prompt: RefinedPromptClient;
  onUseThis: (prompt: RefinedPromptClient) => void;
}

const tagExplanations: { [key: string]: string } = {
  Natural: 'This prompt is phrased in a casual, everyday manner.',
  Formal: 'This prompt uses precise and professional language.',
  SEO: 'This prompt is optimized for search engine visibility.',
  Emotional: 'This prompt aims to evoke feelings and connect on an emotional level.',
  Fun: 'A lighthearted and entertaining version of the prompt.',
  Concise: 'A shorter, to-the-point version, ideal for quick understanding.',
  Vivid: 'A descriptive version that paints a clear picture with rich details.',
  Story: 'A narrative version, framed as a short story or scenario.',
  Analogy: 'Uses comparisons to familiar concepts for easier understanding.',
  'Step-by-step': 'A structured version, breaking down tasks into clear actions.',
  Expert: 'A version using specialized terminology, aimed at knowledgeable audiences.',
  Niche: 'Targets a specific, focused group or interest.',
  'Social Impact': 'Focuses on creating positive social change or awareness.',
  Mysterious: 'An evocative version, hinting at deeper meanings or secrets.',
  Playful: 'A lighthearted and fun version, often using humor or whimsy.',
  Catchy: 'A memorable and attention-grabbing version, great for slogans.',
  'Benefit-driven': 'Highlights the advantages or positive outcomes.',
  Budget: 'Focuses on cost-effectiveness and affordability.',
  Luxury: 'Emphasizes high-end quality and exclusivity.',
  Immersive: 'A version designed for deep engagement and active participation.',
  'Tech-focused': 'Leverages technology and digital tools for solutions.',
  // Add more common tags and their explanations as needed
};

export function RefinedPromptCard({ prompt, onUseThis }: RefinedPromptCardProps) {
  const description = tagExplanations[prompt.tag] || `A prompt refined for a '${prompt.tag}' style.`;
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);

  const titleMaxLen = 120;
  const isTitleTruncated = prompt.prompt.length > titleMaxLen;

  const toggleTitleExpansion = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click or other parent events
    setIsTitleExpanded(!isTitleExpanded);
  };

  return (
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full hover:scale-[1.03] rounded-xl bg-card/50 dark:bg-card/40 backdrop-blur-lg hover:bg-card/60 dark:hover:bg-card/50 border border-border/10 supports-[backdrop-filter]:bg-card/50">
      <CardHeader className="pb-3">
        <Badge variant="secondary" className="w-fit mb-2 text-xs">{prompt.tag}</Badge>
        <CardTitle className="text-lg leading-snug font-semibold">
          {isTitleTruncated && !isTitleExpanded
            ? (
              <>
                {prompt.prompt.substring(0, titleMaxLen)}...
                <button
                  onClick={toggleTitleExpansion}
                  className="text-xs text-primary hover:underline ml-1 focus:outline-none"
                  aria-label="Read more prompt title"
                >
                  Read more
                </button>
              </>
            )
            : isTitleTruncated && isTitleExpanded
            ? (
              <>
                {prompt.prompt}
                <button
                  onClick={toggleTitleExpansion}
                  className="text-xs text-primary hover:underline ml-1 focus:outline-none"
                  aria-label="Read less prompt title"
                >
                  Read less
                </button>
              </>
            )
            : prompt.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <CardDescription className="text-sm line-clamp-3 text-muted-foreground/90">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onUseThis(prompt)}
          className="w-full bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] hover:brightness-110 active:brightness-95 text-primary-foreground transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 ease-out rounded-lg"
          size="lg"
        >
          Use This Prompt
        </Button>
      </CardFooter>
    </Card>
  );
}
