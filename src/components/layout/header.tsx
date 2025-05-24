'use client';

import Link from 'next/link';
import { Bookmark, BrainCircuit } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BookmarkList } from '@/components/bookmark-list';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-gradient-to-r from-background to-muted/20 dark:from-background dark:to-muted/20 backdrop-blur supports-[backdrop-filter]:bg-transparent">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-auto">
          <BrainCircuit className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          <span className="font-bold text-xl sm:text-2xl tracking-tight">Prompt Alchemy</span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="View Bookmarks" className="w-9 h-9">
                <Bookmark className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] p-0">
              <SheetHeader className="p-6 pb-0">
                <SheetTitle>Bookmarked Prompts</SheetTitle>
              </SheetHeader>
              <BookmarkList />
            </SheetContent>
          </Sheet>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
