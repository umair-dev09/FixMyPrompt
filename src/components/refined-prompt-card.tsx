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
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <Badge variant="secondary" className="w-fit mb-2">{prompt.tag}</Badge>
        <CardTitle className="text-xl leading-tight">{prompt.prompt.substring(0, 150)}{prompt.prompt.length > 150 ? "..." : ""}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm line-clamp-4">
          {prompt.prompt}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onUseThis(prompt)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Use This Prompt
        </Button>
      </CardFooter>
    </Card>
  );
}
