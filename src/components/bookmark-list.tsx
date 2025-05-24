
'use client';

import React, { useState } from 'react'; // Ensured useState is imported
import { useBookmarks } from '@/contexts/bookmark-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PromptDialog } from '@/components/prompt-dialog';
import type { RefinedPromptClient } from '@/types';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Trash2 } from 'lucide-react';

export function BookmarkList() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [selectedPrompt, setSelectedPrompt] = useState<RefinedPromptClient | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpansion = (itemId: string, field: 'title' | 'description', event: React.MouseEvent) => {
    event.stopPropagation();
    const key = `${itemId}_${field}`;
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isItemFieldExpanded = (itemId: string, field: 'title' | 'description') => {
    return !!expandedItems[`${itemId}_${field}`];
  };

  const promptTitleMaxLen = 100;
  const originalPromptMaxLen = 100;

  if (bookmarks.length === 0) {
    return <p className="p-6 text-center text-muted-foreground">You have no bookmarked prompts yet.</p>;
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-6 grid gap-4">
          {bookmarks.map((prompt) => {
            const isPromptTitleTruncated = prompt.prompt.length > promptTitleMaxLen;
            const isOriginalPromptTruncated = prompt.originalPrompt.length > originalPromptMaxLen;

            return (
              <Card key={prompt.id} className="shadow-md bg-card/50 dark:bg-card/40 backdrop-blur-lg border border-border/10 supports-[backdrop-filter]:bg-card/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">{prompt.tag}</Badge>
                      <CardTitle className="text-lg">
                        {isPromptTitleTruncated && !isItemFieldExpanded(prompt.id, 'title')
                          ? (
                            <>
                              {prompt.prompt.substring(0, promptTitleMaxLen)}...
                              <button
                                onClick={(e) => toggleExpansion(prompt.id, 'title', e)}
                                className="text-xs text-primary hover:underline ml-1 focus:outline-none"
                                aria-label="Read more bookmarked prompt title"
                              >
                                Read more
                              </button>
                            </>
                          )
                          : isPromptTitleTruncated && isItemFieldExpanded(prompt.id, 'title')
                          ? (
                            <>
                              {prompt.prompt}
                              <button
                                onClick={(e) => toggleExpansion(prompt.id, 'title', e)}
                                className="text-xs text-primary hover:underline ml-1 focus:outline-none"
                                aria-label="Read less bookmarked prompt title"
                              >
                                Read less
                              </button>
                            </>
                          )
                          : prompt.prompt}
                      </CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="h-9 px-3"
                      onClick={() => removeBookmark(prompt.id)} 
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <CardDescription className="text-xs italic mt-1">
                    Original: {' '}
                    {isOriginalPromptTruncated && !isItemFieldExpanded(prompt.id, 'description')
                      ? (
                        <>
                          {prompt.originalPrompt.substring(0, originalPromptMaxLen)}...
                          <button
                            onClick={(e) => toggleExpansion(prompt.id, 'description', e)}
                            className="text-xs text-primary hover:underline ml-1 focus:outline-none"
                            aria-label="Read more original prompt"
                          >
                            Read more
                          </button>
                        </>
                      )
                      : isOriginalPromptTruncated && isItemFieldExpanded(prompt.id, 'description')
                      ? (
                        <>
                          {prompt.originalPrompt}
                          <button
                            onClick={(e) => toggleExpansion(prompt.id, 'description', e)}
                            className="text-xs text-primary hover:underline ml-1 focus:outline-none"
                            aria-label="Read less original prompt"
                          >
                            Read less
                          </button>
                        </>
                      )
                      : prompt.originalPrompt}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => setSelectedPrompt(prompt)} className="w-full">Use This Prompt</Button>
                </CardFooter>
              </Card>
            );
          })}
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
