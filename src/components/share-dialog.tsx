
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Mail, MessageCircle, Facebook, Linkedin, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  promptText: string;
  promptTag?: string;
}

interface SharePlatform {
  name: string;
  icon: LucideIcon;
  action: (promptText: string, promptTag?: string) => void;
  className?: string;
}

export function ShareDialog({ isOpen, onOpenChange, promptText, promptTag }: ShareDialogProps) {
  const { toast } = useToast();

  const handleGenericShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const platforms: SharePlatform[] = [
    {
      name: 'Copy Prompt',
      icon: Copy,
      action: async (text) => {
        try {
          await navigator.clipboard.writeText(text);
          toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
        } catch (error) {
          console.error('Failed to copy prompt:', error);
          toast({ title: 'Copy Failed', description: 'Could not copy prompt.', variant: 'destructive' });
        }
      },
      className: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
    },
    {
      name: 'Email',
      icon: Mail,
      action: (text, tag) => {
        const subject = encodeURIComponent(tag ? `Check out this prompt: ${tag}` : 'Check out this prompt');
        const body = encodeURIComponent(text);
        handleGenericShare(`mailto:?subject=${subject}&body=${body}`);
      },
      className: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white",
    },
    {
      name: 'X (formerly Twitter)',
      icon: X,
      action: (text) => {
        handleGenericShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
      },
      className: "bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white", // Twitter blue, now X
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: (text) => {
        handleGenericShare(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
      },
       className: "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white", // WhatsApp green
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: (text) => {
        handleGenericShare(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`);
      },
       className: "bg-blue-700 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-900 text-white", // Facebook blue
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: (text, tag) => {
        const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(tag ? `Refined Prompt: ${tag}` : 'Refined Prompt')}&summary=${encodeURIComponent(text)}`;
        handleGenericShare(linkedInUrl);
      },
      className: "bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-800 text-white", // LinkedIn blue
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/80 dark:bg-card/70 backdrop-blur-xl shadow-2xl border border-border/20 supports-[backdrop-filter]:bg-card/80">
        <DialogHeader>
          <DialogTitle>Share Prompt</DialogTitle>
          <DialogDescription>
            Share this prompt via your favorite platform.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {platforms.map((platform) => (
            <Button
              key={platform.name}
              variant="default"
              className={`flex flex-col items-center justify-center h-24 sm:h-28 p-2 text-center ${platform.className || 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
              onClick={() => {
                platform.action(promptText, promptTag);
                onOpenChange(false);
              }}
            >
              <platform.icon className="h-6 w-6 sm:h-8 sm:w-8 mb-1.5 sm:mb-2" />
              <span className="text-xs sm:text-sm">{platform.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
