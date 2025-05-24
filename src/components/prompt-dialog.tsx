
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      toast({ title: 'Copy Failed', description: 'Could not copy prompt to clipboard.', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `FixMyPrompt: ${prompt.tag}`,
      text: prompt.prompt,
      // Consider adding a URL if applicable: url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({ title: 'Shared!', description: 'Prompt shared successfully.' });
      } catch (error) {
        console.error('Share API error:', error);
        
        let toastTitle = 'Share Error';
        let toastDescription = 'Could not complete the share action. Attempting to copy to clipboard instead.';

        if (error instanceof DOMException) {
          if (error.name === 'AbortError') {
            // User cancelled the share operation
            toast({ title: 'Share Canceled', description: 'You canceled the share dialog.' });
            return; // Don't proceed to copy if user explicitly canceled
          } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            toastTitle = 'Share Permission Denied';
            toastDescription = 'Native sharing was not allowed by your browser or settings. The prompt will be copied to your clipboard.';
          }
        }
        
        toast({
          title: toastTitle,
          description: toastDescription,
          variant: 'default',
        });

        // Fallback to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(prompt.prompt);
            toast({ title: 'Copied to Clipboard', description: 'Prompt copied as sharing was not available/allowed.' });
          } catch (copyError) {
            console.error('Fallback clipboard copy error:', copyError);
            toast({ title: 'Copy Failed', description: 'Could not copy prompt. Please copy it manually.', variant: 'destructive' });
          }
        } else {
          toast({ title: 'Copy Not Supported', description: 'Clipboard access is not available. Please copy the prompt manually.', variant: 'destructive' });
        }
      }
    } else {
      // Web Share API not supported, try to copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(prompt.prompt);
          toast({
            title: 'Share Not Supported',
            description: 'Native sharing isn\'t available on your browser/device. Prompt copied to clipboard!',
          });
        } catch (copyError) {
          console.error('Clipboard copy error:', copyError);
          toast({ title: 'Copy Failed', description: 'Could not copy prompt to clipboard. Please copy it manually.', variant: 'destructive' });
        }
      } else {
        // Clipboard API also not available
        toast({
          title: 'Action Not Supported',
          description: 'Sharing and clipboard copy are not available on your browser. Please copy the prompt manually.',
          variant: 'destructive',
        });
      }
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
      <DialogContent className="sm:max-w-[600px] bg-card/70 dark:bg-card/60 backdrop-blur-xl shadow-2xl border border-border/20 supports-[backdrop-filter]:bg-card/70">
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
