'use client';

import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { BookmarkProvider } from '@/contexts/bookmark-context';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <BookmarkProvider>{children}</BookmarkProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
