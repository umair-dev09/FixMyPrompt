'use client';

import { useBookmarks } from '@/contexts/bookmark-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PromptDialog } from '@/components/prompt-dialog';
import type { RefinedPromptClient } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trash2 } from 'lucide-react';

export function BookmarkList() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [selectedPrompt, setSelectedPrompt] = React.useState<RefinedPromptClient | null>(null);

  if (bookmarks.length === 0) {
    return <p className="p-6 text-center text-muted-foreground">You have no bookmarked prompts yet.</p>;
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-6 grid gap-4">
          {bookmarks.map((prompt) => (
            <Card key={prompt.id} className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="secondary" className="mb-2">{prompt.tag}</Badge>
                    <CardTitle className="text-lg">{prompt.prompt.substring(0, 100)}{prompt.prompt.length > 100 ? '...' : ''}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeBookmark(prompt.id)} aria-label="Remove bookmark">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <CardDescription className="text-xs italic mt-1">Original: {prompt.originalPrompt.substring(0,100)}{prompt.originalPrompt.length > 100 ? '...' : ''}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setSelectedPrompt(prompt)} className="w-full">Use This Prompt</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
      {selectedPrompt && (
        <PromptDialog
          prompt={selectedPrompt}
          isOpen={!!selectedPrompt}
          onOpenChange={(open) => {
            if (!open) setSelectedPrompt(null);
          }}
        />
      )}
    </>
  );
}
