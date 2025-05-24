
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, WandSparkles } from 'lucide-react';
import { refinePrompt, type RefinePromptInput, type RefinePromptOutput } from '@/ai/flows/refine-prompt';
import type { RefinedPromptClient } from '@/types';
import { RefinedPromptCard } from '@/components/refined-prompt-card';
import { PromptDialog } from '@/components/prompt-dialog';
import { IntroSection } from '@/components/intro-section';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';

// Debounce function
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

interface HomePageProps {
  params?: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function HomePage({ params, searchParams }: HomePageProps) {
  const [userInput, setUserInput] = useState('');
  const [refinedPrompts, setRefinedPrompts] = useState<RefinedPromptClient[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPromptForModal, setSelectedPromptForModal] = useState<RefinedPromptClient | null>(null);
  const { toast } = useToast();

  const handleRefinePrompt = useCallback(async (promptText: string) => {
    if (!promptText.trim()) {
      setRefinedPrompts(null); // Clear results if input is empty
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const inputData: RefinePromptInput = { prompt: promptText };
      const result: RefinePromptOutput = await refinePrompt(inputData);
      
      if (result && result.refinedPrompts) {
         const promptsWithIds = result.refinedPrompts.map(p => ({
          ...p,
          id: crypto.randomUUID(),
          originalPrompt: promptText,
        }));
        setRefinedPrompts(promptsWithIds);
      } else {
        throw new Error("Invalid response structure from AI.");
      }
    } catch (err) {
      console.error("Error refining prompt:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to refine prompt. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setRefinedPrompts(null);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const debouncedRefinePrompt = useCallback(debounce(handleRefinePrompt, 1000), [handleRefinePrompt]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setUserInput(newText);
    if (newText.trim().length > 10) { // Start refining if input is somewhat substantial
        debouncedRefinePrompt(newText);
    } else if (!newText.trim()) {
        setRefinedPrompts(null); // Clear results if input becomes empty
        setError(null);
    }
  };

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (userInput.trim()) {
      handleRefinePrompt(userInput);
    }
  }

  const handleUseThisPrompt = (prompt: RefinedPromptClient) => {
    setSelectedPromptForModal(prompt);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <section className="max-w-3xl mx-auto text-center pt-20 sm:pt-28 lg:pt-32 mb-12 sm:mb-16 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0s' }}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-12 sm:mb-16 tracking-tighter flex flex-wrap justify-center items-baseline gap-x-1 sm:gap-x-2 lg:gap-x-3">
            <span className="inline-flex items-baseline">
              <WandSparkles className="w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-[hsl(var(--primary-gradient-from))] mr-2" />
              Unlock
            </span>
            <span>
              AI's Full Potential
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto">
            Transform your simple ideas into powerful, precise prompts. Get multiple AI-optimized variations in seconds.
          </p>
        </section>

        <section className="max-w-2xl mx-auto mb-12 sm:mb-16 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Textarea
              value={userInput}
              onChange={handleInputChange}
              placeholder="e.g., write a short story about a curious cat..."
              rows={5}
              className="text-base p-4 shadow-lg focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-lg"
              aria-label="Enter your prompt"
            />
             <Button 
              type="submit" 
              disabled={isLoading || !userInput.trim()} 
              className="w-full sm:w-auto text-base py-3 px-6 rounded-lg bg-gradient-to-r from-[hsl(var(--accent-gradient-from))] to-[hsl(var(--accent-gradient-to))] hover:brightness-110 active:brightness-95 text-accent-foreground"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <WandSparkles className="mr-2 h-5 w-5" />
              )}
              Refine Prompt
            </Button>
          </form>
        </section>
        
        {isLoading && (
          <div className="text-center py-8 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>
            <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--accent-gradient-from))] mx-auto" />
            <p className="mt-4 text-muted-foreground">Brewing refined prompts...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-8 text-destructive animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>
            <p>Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && refinedPrompts && refinedPrompts.length > 0 && (
          <section className="mb-12 sm:mb-16 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center tracking-tight">Your Refined Prompts:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {refinedPrompts.map((prompt) => (
                <RefinedPromptCard key={prompt.id} prompt={prompt} onUseThis={handleUseThisPrompt} />
              ))}
            </div>
          </section>
        )}

        {!isLoading && !error && (!refinedPrompts || refinedPrompts.length === 0) && (
          <div className="animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>
            <IntroSection />
          </div>
        )}

        {selectedPromptForModal && (
          <PromptDialog
            prompt={selectedPromptForModal}
            isOpen={!!selectedPromptForModal}
            onOpenChange={(open) => {
              if (!open) setSelectedPromptForModal(null);
            }}
          />
        )}
      </main>
      <footer className="py-6 sm:py-8 text-center text-sm text-muted-foreground border-t border-border/50 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }}>
        © {new Date().getFullYear()} FixMyPrompt. Unleash your creativity.
      </footer>
    </div>
  );
}
