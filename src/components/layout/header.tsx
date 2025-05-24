
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bookmark, WandSparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BookmarkList } from '@/components/bookmark-list';

interface HeaderProps {
  onRefinePromptFromBookmark?: (promptText: string) => void;
}

export function Header({ onRefinePromptFromBookmark }: HeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleRefineFromBookmarkAndCloseSheet = (promptText: string) => {
    setIsSheetOpen(false); // Close the sheet first
    if (onRefinePromptFromBookmark) {
      onRefinePromptFromBookmark(promptText); // Then call the original handler
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-gradient-to-r from-[hsl(var(--sidebar-background))] via-[hsla(var(--sidebar-background),0.9)] to-[hsla(var(--sidebar-background),0.8)] dark:from-[hsl(var(--sidebar-background))] dark:via-[hsla(var(--sidebar-background),0.9)] dark:to-[hsla(var(--sidebar-background),0.8)] bg-opacity-60 dark:bg-opacity-50 backdrop-blur-lg supports-[backdrop-filter]:bg-opacity-60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-auto">
          <WandSparkles className="h-7 w-7 sm:h-8 sm:w-8 text-[hsl(var(--pg-from))]" />
          <span className="font-bold text-xl sm:text-2xl tracking-tight">FixMyPrompt</span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="View Bookmarks" className="w-9 h-9">
                <Bookmark className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] p-0 bg-card/70 dark:bg-card/60 backdrop-blur-xl shadow-2xl border-l border-border/30 supports-[backdrop-filter]:bg-card/70">
              <SheetHeader className="p-6 pb-0">
                <SheetTitle>Bookmarked Prompts</SheetTitle>
              </SheetHeader>
              <BookmarkList onRefineThis={handleRefineFromBookmarkAndCloseSheet} />
            </SheetContent>
          </Sheet>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
