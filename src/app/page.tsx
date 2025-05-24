
'use client';

import React from 'react';
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

const placeholderExamples = [
  "e.g., write a short story about a curious cat...",
  "e.g., explain quantum physics to a five-year-old...",
  "e.g., draft a marketing email for a new SaaS product...",
  "e.g., suggest healthy dinner recipes for the week...",
  "e.g., create a catchy slogan for an eco-friendly brand...",
  "e.g., write a short story about Diwali...",
  "e.g., describe a futuristic city powered by renewable energy...",
];

export default function HomePage({ params, searchParams }: HomePageProps) {
  const [userInput, setUserInput] = React.useState('');
  const [refinedPrompts, setRefinedPrompts] = React.useState<RefinedPromptClient[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPromptForModal, setSelectedPromptForModal] = React.useState<RefinedPromptClient | null>(null);
  const { toast } = useToast();

  const [currentPlaceholder, setCurrentPlaceholder] = React.useState(placeholderExamples[0]);
  const placeholderIndexRef = React.useRef(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      placeholderIndexRef.current = (placeholderIndexRef.current + 1) % placeholderExamples.length;
      setCurrentPlaceholder(placeholderExamples[placeholderIndexRef.current]);
    }, 4000); // Change placeholder every 4 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);


  const handleRefinePrompt = React.useCallback(async (promptText: string) => {
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
  
  const debouncedRefinePrompt = React.useCallback(debounce(handleRefinePrompt, 1500), [handleRefinePrompt]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setUserInput(newText);
    if (newText.trim().length > 20) { 
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
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-12 sm:mb-16 tracking-tighter text-center flex-wrap justify-center">
          <WandSparkles className="inline-block align-baseline w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-[hsl(var(--pg-from))] mr-2" />
          <span className="bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">
            Unlock AI's Full Potential
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
              placeholder={currentPlaceholder}
              rows={5}
              className="text-base p-4 shadow-lg rounded-lg"
              aria-label="Enter your prompt"
            />
             <Button 
              type="submit" 
              disabled={isLoading || !userInput.trim()} 
              className="w-full sm:w-auto text-base py-3 px-6 rounded-lg bg-gradient-to-r from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] hover:brightness-110 active:brightness-95 text-accent-foreground"
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
            <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--ag-from))] mx-auto" />
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center tracking-tight bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">Your Refined Prompts:</h2>
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
