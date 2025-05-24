'use client';

import type { RefinedPromptClient } from '@/types';
import React, { createContext, useContext, useState, useEffect, useCallback, type PropsWithChildren } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkContextType {
  bookmarks: RefinedPromptClient[];
  addBookmark: (prompt: RefinedPromptClient) => void;
  removeBookmark: (promptId: string) => void;
  isBookmarked: (promptId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const BOOKMARKS_STORAGE_KEY = 'promptAlchemyBookmarks';

export function BookmarkProvider({ children }: PropsWithChildren) {
  const [bookmarks, setBookmarks] = useState<RefinedPromptClient[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error("Failed to save bookmarks to localStorage", error);
      }
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = useCallback((prompt: RefinedPromptClient) => {
    setBookmarks((prevBookmarks) => {
      if (prevBookmarks.find(bp => bp.id === prompt.id)) {
        toast({ title: "Already Bookmarked", description: "This prompt is already in your bookmarks." });
        return prevBookmarks;
      }
      toast({ title: "Bookmarked!", description: "Prompt added to your bookmarks." });
      return [...prevBookmarks, prompt];
    });
  }, [toast]);

  const removeBookmark = useCallback((promptId: string) => {
    setBookmarks((prevBookmarks) => {
      toast({ title: "Bookmark Removed", description: "Prompt removed from your bookmarks." });
      return prevBookmarks.filter((p) => p.id !== promptId);
    });
  }, [toast]);

  const isBookmarked = useCallback((promptId: string) => {
    return bookmarks.some((p) => p.id === promptId);
  }, [bookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
