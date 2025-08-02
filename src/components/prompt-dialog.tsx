
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
  Twitter,
  BarChart2,
  Info,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useBookmarks } from '@/contexts/bookmark-context';
import type { RefinedPromptClient, AiPlatform } from '@/types';
import { RefinedPromptScore } from '@/components/refined-prompt-score';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareDialog } from './share-dialog';
import BannerAd from '@/components/ads/banner-ad';

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
    url: (prompt) => `https://x.com/i/grok?prompt=${encodeURIComponent(prompt)}`,
    icon: Twitter
  },
];

const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

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
        <DialogContent className="sm:max-w-[600px] bg-card/80 border-border/40 dark:bg-card/70 dark:border-border/20 backdrop-blur-xl shadow-2xl supports-[backdrop-filter]:bg-card/80 dark:supports-[backdrop-filter]:bg-card/70 max-h-[90vh] overflow-y-auto">          <DialogHeader>            <div className="flex justify-between items-center">              <DialogTitle className="flex items-center">
                Refined Prompt: <span className="ml-2 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-sm text-sm font-medium">{prompt.tag}</span>
              </DialogTitle>
              <div>
                {/* <RefinedPromptScore promptText={prompt.prompt} /> */}
              </div>
            </div>
            <DialogDescription>Use this refined prompt in your favorite AI tools.</DialogDescription>
          </DialogHeader>          <div className="py-4">
            <Textarea value={prompt.prompt} readOnly rows={8} className="text-sm bg-muted/50" />
          </div><DialogFooter className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:justify-between sm:items-center sm:space-x-2">
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
            {/* Prompt Score Details - positioned below the action buttons */}          
            <div className="mt-4 pt-4 border-t border-border/30 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-primary/80" />
                Prompt Quality Analysis
              </h4>              <Tooltip>                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent align="start" className="max-w-[250px] p-3">
                  <p className="text-sm font-medium mb-1">Why Prompt Quality Matters</p>
                  <p className="text-xs">Higher quality prompts lead to more accurate, relevant, and useful AI responses. Our scoring system evaluates four key dimensions that affect AI performance.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              This analysis helps you understand how effective your prompt is likely to be. Hover over each metric for improvement tips.
            </p>
            <RefinedPromptScore promptText={prompt.prompt} showDetail={true}/>
          </div>
          
          {/* AdSense Banner Ad */}
          {/* {adsensePublisherId && (
            <BannerAd
              adClient={adsensePublisherId}
              adSlot="7144282791"       // Replace with your Ad Unit Slot ID
              adFormat="auto" 
              responsive="true"
              className="mt-4" 
            />
          )} */}
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
