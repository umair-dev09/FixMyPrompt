'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
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


export default function HomePage() {
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
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 tracking-tight flex items-center justify-center">
            <Wand2 className="w-10 h-10 mr-3 text-primary" />
            Refine Your Prompts
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your initial prompt below. We'll magically generate three enhanced versions for you to use.
          </p>
        </section>

        <section className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={userInput}
              onChange={handleInputChange}
              placeholder="e.g., write a short story about a curious cat..."
              rows={5}
              className="text-base p-4 shadow-sm focus:ring-2 focus:ring-primary"
              aria-label="Enter your prompt"
            />
             <Button 
              type="submit" 
              disabled={isLoading || !userInput.trim()} 
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Refine Prompt
            </Button>
          </form>
        </section>
        
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Brewing refined prompts...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-8 text-destructive">
            <p>Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && refinedPrompts && refinedPrompts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Your Refined Prompts:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refinedPrompts.map((prompt) => (
                <RefinedPromptCard key={prompt.id} prompt={prompt} onUseThis={handleUseThisPrompt} />
              ))}
            </div>
          </section>
        )}

        {!isLoading && !error && (!refinedPrompts || refinedPrompts.length === 0) && (
          <IntroSection />
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
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Prompt Alchemy. Unleash your creativity.
      </footer>
    </div>
  );
}
