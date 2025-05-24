'use client';

import React from 'react';
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
import { Copy, Share2, Bookmark, ExternalLink, MessageSquareText, Brain, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBookmarks } from '@/contexts/bookmark-context';
import type { RefinedPromptClient, AiPlatform } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PromptDialogProps {
  prompt: RefinedPromptClient;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const aiPlatforms: AiPlatform[] = [
  { name: 'ChatGPT', url: (prompt) => `https://chat.openai.com/?prompt=${encodeURIComponent(prompt)}`, icon: MessageSquareText },
  { name: 'Gemini', url: (prompt) => `https://gemini.google.com/app?prompt=${encodeURIComponent(prompt)}`, icon: Brain },
  { name: 'Claude', url: (prompt) => `https://claude.ai/new?prompt=${encodeURIComponent(prompt)}`, icon: Bot },
];


export function PromptDialog({ prompt, isOpen, onOpenChange }: PromptDialogProps) {
  const { toast } = useToast();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(prompt.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Refined Prompt: ${prompt.tag}`,
          text: prompt.prompt,
        });
        toast({ title: 'Shared!', description: 'Prompt shared successfully.' });
      } catch (error) {
        toast({ title: 'Share failed', description: 'Could not share the prompt.', variant: 'destructive' });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(prompt.prompt);
      toast({ title: 'Link Copied!', description: 'Prompt copied. You can share it manually.' });
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Refined Prompt: <span className="ml-2 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-sm text-sm font-medium">{prompt.tag}</span>
          </DialogTitle>
          <DialogDescription>Use this refined prompt in your favorite AI tools.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea value={prompt.prompt} readOnly rows={8} className="text-sm bg-muted/50" />
        </div>
        <DialogFooter className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                <DropdownMenuItem key={platform.name} onClick={() => window.open(platform.url(prompt.prompt), '_blank')}>
                  {platform.icon && <platform.icon className="mr-2 h-4 w-4" />}
                  {platform.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button onClick={handleBookmarkToggle} variant={bookmarked ? "default" : "outline"}>
            <Bookmark className={`mr-2 h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
