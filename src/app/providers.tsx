'use client';

import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { BookmarkProvider } from '@/contexts/bookmark-context';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BookmarkProvider>{children}</BookmarkProvider>
    </ThemeProvider>
  );
}
