
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RefinedPromptClient } from '@/types';

interface RefinedPromptCardProps {
  prompt: RefinedPromptClient;
  onUseThis: (prompt: RefinedPromptClient) => void;
}

export function RefinedPromptCard({ prompt, onUseThis }: RefinedPromptCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full hover:scale-[1.03] rounded-xl bg-card/50 dark:bg-card/40 backdrop-blur-lg hover:bg-card/60 dark:hover:bg-card/50 border border-border/10 supports-[backdrop-filter]:bg-card/50">
      <CardHeader className="pb-3">
        <Badge variant="secondary" className="w-fit mb-2 text-xs">{prompt.tag}</Badge>
        <CardTitle className="text-lg leading-snug font-semibold">{prompt.prompt.substring(0, 120)}{prompt.prompt.length > 120 ? "..." : ""}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <CardDescription className="text-sm line-clamp-3 text-muted-foreground/90">
          {prompt.prompt}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onUseThis(prompt)}
          className="w-full bg-gradient-to-r from-[hsl(var(--primary-gradient-from))] via-[hsl(var(--primary-gradient-via))] to-[hsl(var(--primary-gradient-to))] hover:brightness-110 active:brightness-95 text-primary-foreground transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 ease-out rounded-lg"
          size="lg"
        >
          Use This Prompt
        </Button>
      </CardFooter>
    </Card>
  );
}
