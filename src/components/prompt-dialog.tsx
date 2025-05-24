
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Copy,
  Share2,
  Bookmark,
  ExternalLink,
  MessageSquareText,
  Brain,
  Bot,
  Search,
  Bird,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBookmarks } from '@/contexts/bookmark-context';
import type { RefinedPromptClient, AiPlatform } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareDialog } from './share-dialog';

interface PromptDialogProps {
  prompt: RefinedPromptClient;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const aiPlatforms: AiPlatform[] = [
  {
    name: 'ChatGPT',
    url: (prompt) => `https://chat.openai.com/?prompt=${encodeURIComponent(prompt)}`,
    icon: MessageSquareText
  },
  {
    name: 'Perplexity',
    url: (prompt) => `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`,
    icon: Search
  },
  {
    name: 'Gemini',
    url: (prompt) => `https://gemini.google.com/app?prompt=${encodeURIComponent(prompt)}`,
    icon: Brain
  },
  {
    name: 'Claude',
    url: (prompt) => `https://claude.ai/new?prompt=${encodeURIComponent(prompt)}`,
    icon: Bot
  },
  {
    name: 'Grok (on X)',
    url: (prompt) => `https://x.com/search?q=${encodeURIComponent(prompt)}`,
    icon: Bird
  },
];


export function PromptDialog({ prompt, isOpen, onOpenChange }: PromptDialogProps) {
  const { toast } = useToast();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(prompt.id);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        toast({ title: 'Copy Failed', description: 'Clipboard API not available in this browser.', variant: 'destructive' });
        return;
      }
      await navigator.clipboard.writeText(prompt.prompt);
      toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      toast({ title: 'Copy Failed', description: 'Could not copy prompt to clipboard.', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `FixMyPrompt: ${prompt.tag} Prompt`,
      text: prompt.prompt,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({ title: 'Shared!', description: 'Prompt shared successfully.' });
      } catch (error) {
        console.error('Share API error:', error);
        if (error instanceof Error && error.name === 'NotAllowedError') {
          toast({
            title: 'Share Canceled or Denied',
            description: 'Could not share. Prompt copied to clipboard instead.',
            variant: 'default',
          });
          await handleCopy();
        } else if (error instanceof Error && error.name === 'AbortError') {
          toast({ title: 'Share Canceled', description: 'You canceled the share operation.', variant: 'default' });
        } else {
          toast({
            title: 'Share Failed',
            description: 'Could not share. Prompt copied to clipboard instead.',
            variant: 'destructive',
          });
          await handleCopy();
        }
      }
    } else {
      await handleCopy();
      toast({ title: 'Share via Clipboard', description: 'Native share not supported. Prompt copied to clipboard.' });
    }
  };

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(prompt.id);
    } else {
      addBookmark(prompt);
    }
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-card/80 border-border/40 dark:bg-card/70 dark:border-border/20 backdrop-blur-xl shadow-2xl supports-[backdrop-filter]:bg-card/80 dark:supports-[backdrop-filter]:bg-card/70">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              Refined Prompt: <span className="ml-2 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-sm text-sm font-medium">{prompt.tag}</span>
            </DialogTitle>
            <DialogDescription>Use this refined prompt in your favorite AI tools.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea value={prompt.prompt} readOnly rows={8} className="text-sm bg-muted/50" />
          </div>
          <DialogFooter className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:justify-between sm:items-center sm:space-x-2">
            <Button onClick={handleCopy} variant="outline">
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" /> Open in...
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {aiPlatforms.map((platform) => (
                  <DropdownMenuItem
                    key={platform.name}
                    onClick={async () => {
                      await handleCopy();
                      window.open(platform.url(prompt.prompt), '_blank');
                    }}
                  >
                    {platform.icon && <platform.icon className="mr-2 h-4 w-4" />}
                    {platform.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setIsShareDialogOpen(true)} variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button
              onClick={handleBookmarkToggle}
              variant={bookmarked ? "default" : "outline"}
              className="min-w-36"
            >
              <Bookmark className={`mr-2 h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        promptText={prompt.prompt}
        promptTag={prompt.tag}
      />
    </>
  );
}
