
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, WandSparkles, Mic, MicOff } from 'lucide-react';
import { refinePrompt, type RefinePromptInput, type RefinePromptOutput } from '@/ai/flows/refine-prompt';
import type { RefinedPromptClient } from '@/types';
import { RefinedPromptCard } from '@/components/refined-prompt-card';
import { PromptDialog } from '@/components/prompt-dialog';
import { IntroSection } from '@/components/intro-section';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import BannerAd from '@/components/ads/banner-ad';

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

const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

export default function HomePage({ params, searchParams }: HomePageProps) {
  const [userInput, setUserInput] = React.useState('');
  const [refinedPrompts, setRefinedPrompts] = React.useState<RefinedPromptClient[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPromptForModal, setSelectedPromptForModal] = React.useState<RefinedPromptClient | null>(null);
  const { toast } = useToast();

  const [currentPlaceholder, setCurrentPlaceholder] = React.useState(placeholderExamples[0]);
  const placeholderIndexRef = React.useRef(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Dictation state
  const [isDictating, setIsDictating] = useState(false);
  const [isSpeechApiAvailable, setIsSpeechApiAvailable] = useState(false);
  const recognitionRef = useRef<any>(null);


  React.useEffect(() => {
    const intervalId = setInterval(() => {
      placeholderIndexRef.current = (placeholderIndexRef.current + 1) % placeholderExamples.length;
      setCurrentPlaceholder(placeholderExamples[placeholderIndexRef.current]);
    }, 4000);

    // Speech Recognition API setup
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSpeechApiAvailable(true);
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    } else {
      setIsSpeechApiAvailable(false);
    }

    return () => {
      clearInterval(intervalId);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);


  const handleRefinePrompt = React.useCallback(async (promptText: string) => {
    if (!promptText.trim()) {
      setRefinedPrompts(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const inputData: RefinePromptInput = { prompt: promptText };
      const result: RefinePromptOutput = await refinePrompt(inputData);

      if (result && result.refinedPrompts && Array.isArray(result.refinedPrompts) && result.refinedPrompts.length > 0) {
         const promptsWithIds = result.refinedPrompts.map(p => ({
          ...p,
          id: crypto.randomUUID(),
          originalPrompt: promptText,
        }));
        setRefinedPrompts(promptsWithIds);
        setError(null); // Clear any previous errors
      } else {
        setRefinedPrompts(null);
        const noPromptsMessage = "No refined prompts were generated. The AI might not have found improvements or the response was empty.";
        setError(noPromptsMessage);
        toast({
          title: "Refinement Issue",
          description: noPromptsMessage,
          variant: "destructive",
        });
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
        setRefinedPrompts(null);
        setError(null);
    }
  };

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (userInput.trim()) {
      handleRefinePrompt(userInput);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (userInput.trim()) {
        handleSubmit();
      }
    }
  };

  const handleUseThisPrompt = (prompt: RefinedPromptClient) => {
    setSelectedPromptForModal(prompt);
  };

  const handleSetInputForRefinement = (promptText: string) => {
    setUserInput(promptText);
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    textareaRef.current?.focus();
  };

  const handleToggleDictation = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Dictation Not Supported',
        description: 'Your browser does not support speech recognition.',
        variant: 'destructive',
      });
      return;
    }

    const recognition = recognitionRef.current;

    if (isDictating) {
      recognition.stop();
      setIsDictating(false);
    } else {
      recognition.onstart = () => {
        setIsDictating(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        if (transcript) {
          setUserInput((prevInput) =>
            prevInput + (prevInput.endsWith(' ') || prevInput === '' ? '' : ' ') + transcript
          );
        }
      };

      recognition.onerror = (event: any) => {
        setIsDictating(false);
        let errorMsg = 'An error occurred during dictation.';
        if (event.error === 'no-speech') {
          errorMsg = 'No speech was detected. Please try again.';
        } else if (event.error === 'audio-capture') {
          errorMsg = 'Microphone problem. Please ensure it is connected and enabled.';
        } else if (event.error === 'not-allowed') {
          errorMsg = 'Permission to use microphone was denied. Please enable it in your browser settings.';
        } else if (event.error === 'network') {
            errorMsg = 'A network error occurred. Please check your connection.';
        }
        toast({
          title: 'Dictation Error',
          description: errorMsg,
          variant: 'destructive',
        });
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      try {
        recognition.start();
      } catch (e) {
          setIsDictating(false);
          toast({
              title: 'Dictation Error',
              description: 'Could not start dictation. Please check microphone permissions.',
              variant: 'destructive',
          });
      }
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header onRefinePromptFromBookmark={handleSetInputForRefinement} />
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
              ref={textareaRef}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={currentPlaceholder}
              rows={5}
              className="text-base p-4 shadow-lg rounded-lg"
              aria-label="Enter your prompt"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="flex-grow sm:flex-grow-0 text-base py-3 px-6 rounded-lg bg-gradient-to-r from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] hover:brightness-110 active:brightness-95 text-accent-foreground transform hover:scale-[1.03] active:scale-[0.97]"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <WandSparkles className="mr-2 h-5 w-5" />
                )}
                Refine Prompt
              </Button>
              <Button
                type="button"
                onClick={handleToggleDictation}
                disabled={!isSpeechApiAvailable}
                variant={isDictating ? "secondary" : "outline"}
                size="lg"
                className="px-4"
                aria-label={isDictating ? "Stop dictation" : "Start dictation"}
              >
                {isDictating ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                <span className="ml-2 sm:hidden lg:inline">{isDictating ? 'Stop' : 'Dictate'}</span>
              </Button>
            </div>
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
                <RefinedPromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onUseThis={handleUseThisPrompt}
                  onRefineThis={handleSetInputForRefinement}
                />
              ))}
            </div>
            {/* AdSense Banner Ad */}
            {/* {adsensePublisherId && (
              <BannerAd
                adClient={adsensePublisherId}
                adSlot="7144282791"      // Replace with your Ad Unit Slot ID
                adFormat="auto"
                responsive="true"
                className="mt-8"
              />
            )} */}
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
      <footer className="py-6 sm:py-8 border-t border-border/50 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <a href="https://instagram.com/your_handle_here" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[hsl(var(--ag-from))] transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://facebook.com/your_page_here" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[hsl(var(--ag-from))] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://x.com/your_handle_here" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-[hsl(var(--ag-from))] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
          <div className="text-center sm:text-left mb-4 sm:mb-0 order-first sm:order-none">
             © {new Date().getFullYear()} FixMyPrompt. Unleash your creativity.
          </div>
          <div>
            <a
              href="mailto:umair@fixmyprompt.io?subject=Inquiry%20about%20FixMyPrompt&body=Hey%2C%20I%20want%20to%20talk%20about%20FixMyPrompt."
              className="hover:text-[hsl(var(--ag-from))] transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
