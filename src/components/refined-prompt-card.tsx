
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RefinedPromptClient } from '@/types';
import { RefinedPromptScore } from '@/components/refined-prompt-score';
import { QuickFeedback } from '@/components/quick-feedback';

interface RefinedPromptCardProps {
  prompt: RefinedPromptClient;
  onUseThis: (prompt: RefinedPromptClient) => void;
  onRefineThis: (promptText: string) => void; // New prop
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
};

export function RefinedPromptCard({ prompt, onUseThis, onRefineThis }: RefinedPromptCardProps) {
  const description = tagExplanations[prompt.tag] || `A prompt refined for a '${prompt.tag}' style.`;
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);

  const titleMaxLen = 120;
  const isTitleTruncated = prompt.prompt.length > titleMaxLen;

  const toggleTitleExpansion = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTitleExpanded(!isTitleExpanded);
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted for prompt:', prompt.tag, feedback);
    // Here you could also send to your backend if needed
  };

  return (
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full hover:scale-[1.03] rounded-xl bg-card/50 dark:bg-card/40 backdrop-blur-lg hover:bg-card/60 dark:hover:bg-card/50 border border-border/10 supports-[backdrop-filter]:bg-card/50">      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="w-fit text-xs">{prompt.tag}</Badge>
          <RefinedPromptScore promptText={prompt.prompt} />
        </div>
        <CardTitle className="text-lg leading-snug font-semibold">
          {isTitleTruncated && !isTitleExpanded
            ? (
              <>
                {prompt.prompt.substring(0, titleMaxLen)}...
                <button
                  onClick={toggleTitleExpansion}
                  className="text-xs text-accent hover:underline ml-1 focus:outline-none"
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
                  className="text-xs text-accent hover:underline ml-1 focus:outline-none"
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
      <CardFooter className="flex flex-col gap-2">
        <Button
          onClick={() => onUseThis(prompt)}
          className="w-full bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] hover:brightness-110 active:brightness-95 text-primary-foreground transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 ease-out rounded-lg"
          size="lg"
        >
          Use This Prompt
        </Button>
        <Button
          onClick={() => onRefineThis(prompt.prompt)}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Refine this prompt
        </Button>
        
        {/* Feedback Component */}
        <QuickFeedback
          promptId={`${prompt.tag}-${Date.now()}`}
          promptText={prompt.prompt}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      </CardFooter>
    </Card>
  );
}
