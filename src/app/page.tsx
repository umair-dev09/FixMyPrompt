'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, WandSparkles, Mic, MicOff, Sparkles } from 'lucide-react';
import { refinePrompt, type RefinePromptInput, type RefinePromptOutput } from '@/ai/flows/refine-prompt';
import type { RefinedPromptClient } from '@/types';
import { RefinedPromptCard } from '@/components/refined-prompt-card';
import { PromptDialog } from '@/components/prompt-dialog';
import { IntroSection } from '@/components/intro-section';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import BannerAd from '@/components/ads/banner-ad';
import { PromptScoreDisplay } from '@/components/prompt-score-display';
import { FloatingFeedback } from '@/components/floating-feedback';
import { SessionFeedback } from '@/components/session-feedback';
import { FeedbackNotification } from '@/components/feedback-notification';

// Debug mode for testing feedback system (remove in production)
const isDebugMode = process.env.NODE_ENV === 'development' && false; // Set to true for testing

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

// Prompt type options with dynamic placeholders
const promptTypeOptions = [
  { 
    value: 'default', 
    label: 'General Purpose', 
    icon: '🎯', 
    description: 'For general tasks and everyday use',
    placeholder: 'e.g., explain quantum physics to a five-year-old...'
  },
  { 
    value: 'image-generation', 
    label: 'Image Generation', 
    icon: '🎨', 
    description: 'For creating visual content and artwork',
    placeholder: 'e.g., a majestic dragon flying over a medieval castle at sunset...'
  },
  { 
    value: 'video-generation', 
    label: 'Video Generation', 
    icon: '🎬', 
    description: 'For video content and animations',
    placeholder: 'e.g., create a 30-second video of a cat playing with a ball...'
  },
  { 
    value: 'code-generation', 
    label: 'Code Generation', 
    icon: '💻', 
    description: 'For programming and software development',
    placeholder: 'e.g., create a React component for a user login form...'
  },
  { 
    value: 'creative-writing', 
    label: 'Creative Writing', 
    icon: '✍️', 
    description: 'For stories, novels, and creative content',
    placeholder: 'e.g., write a short mystery story about a missing painting...'
  },
  { 
    value: 'business-content', 
    label: 'Business Content', 
    icon: '💼', 
    description: 'For marketing, sales, and professional content',
    placeholder: 'e.g., draft a marketing email for a new SaaS product launch...'
  },
  { 
    value: 'educational-content', 
    label: 'Educational Content', 
    icon: '📚', 
    description: 'For learning materials and tutorials',
    placeholder: 'e.g., create a lesson plan for teaching fractions to 4th graders...'
  },
  { 
    value: 'data-analysis', 
    label: 'Data Analysis', 
    icon: '📊', 
    description: 'For data insights and statistical analysis',
    placeholder: 'e.g., analyze sales data and identify trends for Q4 2024...'
  },
  { 
    value: 'social-media', 
    label: 'Social Media', 
    icon: '📱', 
    description: 'For posts, captions, and social content',
    placeholder: 'e.g., create Instagram captions for a fitness brand...'
  },
];

const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

export default function HomePage({ params, searchParams }: HomePageProps) {
  const [userInput, setUserInput] = React.useState('');
  const [promptType, setPromptType] = React.useState('default');
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

  // Session tracking and feedback
  const [sessionData, setSessionData] = useState({
    promptsRefined: 0,
    sessionStart: Date.now(),
    mostUsedFeatures: [] as string[],
  });
  const [showSessionFeedback, setShowSessionFeedback] = useState(false);
  const [feedbackCompleted, setFeedbackCompleted] = useState(false);
  const [lastFeedbackTime, setLastFeedbackTime] = useState<number | null>(null);

  // Add state for less intrusive feedback notification
  const [showFeedbackNotification, setShowFeedbackNotification] = useState(false);

  // Mobile viewport handling for dropdown
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle prompt type change
  const handlePromptTypeChange = (newType: string) => {
    setPromptType(newType);
    // Clear current results when changing prompt type to avoid confusion
    if (refinedPrompts && refinedPrompts.length > 0) {
      setRefinedPrompts(null);
      setError(null);
    }
    
    // Show feedback toast
    const selectedOption = promptTypeOptions.find(option => option.value === newType);
    if (selectedOption && newType !== 'default') {
      toast({
        title: `Switched to ${selectedOption.label}`,
        description: `Your prompts will now be optimized for ${selectedOption.description.toLowerCase()}.`,
        duration: 3000,
      });
    }
  };

  // Track session activity
  const updateSessionData = useCallback(() => {
    setSessionData(prev => ({
      ...prev,
      promptsRefined: prev.promptsRefined + 1,
    }));
  }, []);

  // Feedback handlers
  const handleGeneralFeedback = useCallback((feedback: any) => {
    console.log('General feedback received:', feedback);
    toast({
      title: "Thank you for your feedback!",
      description: "We appreciate your input and will use it to improve FixMyPrompt.",
    });
  }, [toast]);

  const handleSessionFeedback = useCallback((feedback: any) => {
    console.log('Session feedback received:', feedback);
    toast({
      title: "Thank you for your session feedback!",
      description: "Your input helps us make FixMyPrompt better.",
    });
    
    // Mark feedback as completed and close dialog
    setFeedbackCompleted(true);
    setShowSessionFeedback(false);
    setLastFeedbackTime(Date.now());
    
    // Store completion state in localStorage
    localStorage.setItem('fixmyprompt_feedback_completed', Date.now().toString());
    localStorage.setItem('fixmyprompt_last_feedback', Date.now().toString());
  }, [toast]);

  // Check for session feedback trigger
  useEffect(() => {
    // Initialize feedback state from localStorage
    const lastFeedbackStored = localStorage.getItem('fixmyprompt_last_feedback');
    const feedbackCompletedStored = localStorage.getItem('fixmyprompt_feedback_completed');
    
    if (lastFeedbackStored) {
      setLastFeedbackTime(parseInt(lastFeedbackStored));
    }
    
    if (feedbackCompletedStored) {
      const completedTime = parseInt(feedbackCompletedStored);
      const timeSinceCompletion = Date.now() - completedTime;
      // Reset feedback completion after 24 hours (86400000 ms)
      if (timeSinceCompletion < 86400000) {
        setFeedbackCompleted(true);
      } else {
        // Reset if it's been more than 24 hours
        localStorage.removeItem('fixmyprompt_feedback_completed');
        setFeedbackCompleted(false);
      }
    }
  }, []);

  // Enhanced session feedback logic
  useEffect(() => {
    // Don't show feedback if already completed recently or currently showing
    if (feedbackCompleted || showSessionFeedback) return;
    
    // Check if user dismissed feedback for longer period
    const dismissedUntil = localStorage.getItem('fixmyprompt_feedback_dismissed');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      return; // Still in dismissed period
    }
    
    const checkSessionFeedback = () => {
      const timeSpent = Math.floor((Date.now() - sessionData.sessionStart) / 60000); // minutes
      
      // More intelligent triggering conditions (or debug mode):
      // 1. User has refined at least 5 prompts (increased from 3)
      // 2. OR spent at least 8 minutes (increased from 5)
      // 3. AND hasn't given feedback in the last 24 hours
      // 4. AND hasn't dismissed it for extended period
      const shouldShowFeedback = isDebugMode || (
        (sessionData.promptsRefined >= 5 || timeSpent >= 8) &&
        (!lastFeedbackTime || (Date.now() - lastFeedbackTime) > 86400000) // 24 hours
      );
      
      if (shouldShowFeedback) {
        // Show less intrusive notification first
        setTimeout(() => {
          if (!feedbackCompleted && !showSessionFeedback && !showFeedbackNotification) {
            setShowFeedbackNotification(true);
          }
        }, 5000); // Increased delay to 5 seconds
      }
    };

    checkSessionFeedback();
  }, [sessionData, showSessionFeedback, feedbackCompleted, lastFeedbackTime]);


  React.useEffect(() => {
    // Update placeholder based on prompt type
    const selectedOption = promptTypeOptions.find(option => option.value === promptType);
    if (selectedOption) {
      setCurrentPlaceholder(selectedOption.placeholder);
    }

    const intervalId = setInterval(() => {
      placeholderIndexRef.current = (placeholderIndexRef.current + 1) % placeholderExamples.length;
      if (promptType === 'default') {
        setCurrentPlaceholder(placeholderExamples[placeholderIndexRef.current]);
      }
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
  }, [promptType]);


  const handleRefinePrompt = React.useCallback(async (promptText: string) => {
    if (!promptText.trim()) {
      setRefinedPrompts(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const inputData: RefinePromptInput = { 
        prompt: promptText,
        promptType: promptType !== 'default' ? promptType : undefined
      };
      const result: RefinePromptOutput = await refinePrompt(inputData);

      if (result && result.refinedPrompts && Array.isArray(result.refinedPrompts) && result.refinedPrompts.length > 0) {
         const promptsWithIds = result.refinedPrompts.map(p => ({
          ...p,
          id: crypto.randomUUID(),
          originalPrompt: promptText,
        }));
        setRefinedPrompts(promptsWithIds);
        setError(null); // Clear any previous errors
        
        // Track successful refinement
        updateSessionData();
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
  }, [toast, promptType]);

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

  // Get current prompt type details
  const currentPromptType = promptTypeOptions.find(option => option.value === promptType);

  // Prompt type tips
  const getPromptTypeTips = (type: string) => {
    const tips = {
      'image-generation': 'Try including details like style, mood, lighting, colors, and composition for better results.',
      'video-generation': 'Describe camera movements, scene transitions, duration, and visual storytelling elements.',
      'code-generation': 'Specify the programming language, framework, functionality, and any requirements.',
      'creative-writing': 'Include genre, tone, character details, setting, and desired word count or format.',
      'business-content': 'Define your target audience, brand voice, goals, and desired call-to-action.',
      'educational-content': 'Specify learning level, objectives, teaching methods, and engagement strategies.',
      'data-analysis': 'Describe your data type, analysis goals, preferred visualizations, and expected insights.',
      'social-media': 'Include platform specifications, target audience, hashtag strategy, and engagement goals.',
      'default': 'Be specific about what you want to achieve and provide relevant context.'
    };
    return tips[type as keyof typeof tips] || tips.default;
  };

  // Keyboard shortcuts for prompt type switching
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in textarea
      if (event.target === textareaRef.current) return;
      
      // Ctrl/Cmd + 1-9 for quick prompt type switching
      if ((event.ctrlKey || event.metaKey) && event.key >= '1' && event.key <= '9') {
        const index = parseInt(event.key) - 1;
        if (index < promptTypeOptions.length) {
          event.preventDefault();
          handlePromptTypeChange(promptTypeOptions[index].value);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Custom styles for mobile dropdown positioning and text wrapping */}
      <style jsx global>{`
        @media (max-width: 640px) {
          [data-radix-select-content] {
            max-width: calc(100vw - 1rem) !important;
            left: 0.5rem !important;
            right: 0.5rem !important;
            transform: none !important;
          }
          
          [data-radix-select-viewport] {
            max-height: 50vh !important;
            overflow-y: auto !important;
          }
        }
        
        /* Line clamp utility for mobile text wrapping */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      <Header onRefinePromptFromBookmark={handleSetInputForRefinement} />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <section className="max-w-3xl mx-auto text-center pt-20 sm:pt-28 lg:pt-32 mb-12 sm:mb-16 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0s' }}>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-12 sm:mb-16 tracking-tighter text-center flex-wrap justify-center">
            <WandSparkles className="inline-block align-baseline w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-[hsl(var(--pg-from))] mr-2" />
            <span className="bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">
            Unlock AI's Full Potential
            </span>
        </h1>          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto">
            Transform your simple ideas into powerful, precise prompts with real-time quality scoring. Get multiple AI-optimized variations in seconds.
          </p>
        </section>        <section className="max-w-2xl mx-auto mb-12 sm:mb-16 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Prompt Type Selector */}
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="prompt-type" className="flex items-center text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 mr-2 text-[hsl(var(--ag-from))]" />
                  Choose Your Prompt Type
                </label>
                <div className="hidden sm:flex items-center text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-muted/50">Ctrl+1-9</span>
                  <span className="ml-1">for quick switching</span>
                </div>
              </div>
              <Select value={promptType} onValueChange={handlePromptTypeChange}>
                <SelectTrigger className="w-full h-12 sm:h-14 text-sm sm:text-base shadow-lg rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-[hsl(var(--ag-from))]/50 transition-all duration-200 hover:shadow-xl touch-manipulation">
                  <SelectValue>
                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0">
                        {promptTypeOptions.find(option => option.value === promptType)?.icon}
                      </div>
                      <div className="flex flex-col items-start min-w-0 flex-1 overflow-hidden">
                        <span className="font-medium text-foreground text-sm  text-left sm:text-base truncate w-full">
                          {promptTypeOptions.find(option => option.value === promptType)?.label}
                        </span>
                        {!isMobile && (
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {promptTypeOptions.find(option => option.value === promptType)?.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[calc(100vw-2rem)] sm:w-full max-w-md sm:max-w-none max-h-[60vh] sm:max-h-[320px] bg-background/95 backdrop-blur-lg border border-border/50 shadow-2xl rounded-lg">
                  {promptTypeOptions.map((option, index) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer hover:bg-accent/80 dark:hover:bg-accent/40 transition-all duration-200 rounded-md m-1 touch-manipulation min-h-[48px] sm:min-h-auto data-[highlighted]:bg-accent/80 dark:data-[highlighted]:bg-accent/40"
                    >
                      <div className="flex items-start gap-2 sm:gap-3 w-full min-w-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0 mt-0.5">
                          {option.icon}
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-medium text-foreground text-sm text-left flex-1 min-w-0 truncate">
                              {option.label}
                            </span>
                            {!isMobile && (
                              <span className="text-xs text-muted-foreground/70 ml-2 flex-shrink-0">
                                Ctrl+{index + 1}
                              </span>
                            )}
                          </div>
                          <span className={`text-xs leading-tight w-full text-left text-muted-foreground/90 dark:text-muted-foreground/80 ${
                            isMobile ? 'line-clamp-2 break-words mobile-dropdown-description' : 'whitespace-normal'
                          }`}>
                            {option.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <label htmlFor="prompt-input" className="flex items-center text-sm font-medium text-foreground mb-3">
                <WandSparkles className="w-4 h-4 mr-2 text-[hsl(var(--ag-from))]" />
                Enter Your Prompt
              </label>
              
              {/* Prompt Type Tips */}
              {promptType !== 'default' && (
                <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-[hsl(var(--ag-from))]/5 to-[hsl(var(--ag-to))]/5 border border-[hsl(var(--ag-from))]/10">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0">
                      💡
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[hsl(var(--ag-from))] mb-1">
                        Tips for {currentPromptType?.label}:
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {getPromptTypeTips(promptType)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Textarea
                id="prompt-input"
                ref={textareaRef}
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={currentPlaceholder}
                rows={5}
                className={`text-base p-4 shadow-lg rounded-lg transition-all duration-300 ${userInput.trim().length > 5 ? 'rounded-b-none' : ''} focus:shadow-xl focus:border-[hsl(var(--ag-from))]/50`}
                aria-label="Enter your prompt"
              />
              {userInput.trim().length > 5 && (
                <PromptScoreDisplay 
                  promptText={userInput} 
                  className="animate-fadeIn" 
                />
              )}
            </div>
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
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">
                Your Refined Prompts:
              </h2>
              {promptType !== 'default' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--ag-from))]/10 to-[hsl(var(--ag-to))]/10 border border-[hsl(var(--ag-from))]/20">
                  <span className="text-sm">
                    {promptTypeOptions.find(option => option.value === promptType)?.icon}
                  </span>
                  <span className="text-sm font-medium text-[hsl(var(--ag-from))]">
                    Optimized for {promptTypeOptions.find(option => option.value === promptType)?.label}
                  </span>
                </div>
              )}
            </div>
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
      
      {/* Floating Feedback Widget */}
      <FloatingFeedback onFeedbackSubmit={handleGeneralFeedback} />
      
      {/* Less intrusive feedback notification */}
      <FeedbackNotification
        isVisible={showFeedbackNotification}
        onDismiss={() => {
          setShowFeedbackNotification(false);
          setLastFeedbackTime(Date.now());
          localStorage.setItem('fixmyprompt_last_feedback', Date.now().toString());
        }}
        onOpenFeedback={() => {
          setShowFeedbackNotification(false);
          setShowSessionFeedback(true);
        }}
        sessionData={{
          promptsRefined: sessionData.promptsRefined,
          timeSpent: Math.floor((Date.now() - sessionData.sessionStart) / 60000),
        }}
      />
      
      {/* Session Feedback Modal */}
      <SessionFeedback
        isOpen={showSessionFeedback}
        onClose={() => {
          setShowSessionFeedback(false);
          // Mark as dismissed for this session
          setLastFeedbackTime(Date.now());
          localStorage.setItem('fixmyprompt_last_feedback', Date.now().toString());
        }}
        sessionData={{
          promptsRefined: sessionData.promptsRefined,
          timeSpent: Math.floor((Date.now() - sessionData.sessionStart) / 60000),
          mostUsedFeatures: sessionData.mostUsedFeatures,
        }}
        onFeedbackSubmit={handleSessionFeedback}
      />
      
      <footer className="mt-auto border-t border-border/30 bg-background/80 backdrop-blur-sm animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Main Footer Content */}
          <div className="py-8 sm:py-10">
            <div className="flex flex-col items-center text-center space-y-6">
              
              {/* Brand Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] bg-clip-text text-transparent">
                  FixMyPrompt
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Empowering creativity through intelligent AI prompt engineering
                </p>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
                <a
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Terms & Conditions
                </a>
                <a
                  href="mailto:fixmyprompt@gmail.com?subject=Inquiry%20about%20FixMyPrompt&body=Hey%2C%20I%20want%20to%20talk%20about%20FixMyPrompt."
                  className="text-sm text-muted-foreground hover:text-[hsl(var(--ag-from))] transition-colors duration-200 font-medium"
                >
                  Contact Us
                </a>
              </nav>

              {/* Social Media Icons */}
              <div className="flex items-center justify-center space-x-4">
                {/* <a href="https://instagram.com/fixmyprompt" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-[hsl(var(--ag-from))] transition-colors duration-200"> */}
                  <div className="text-muted-foreground hover:text-[hsl(var(--ag-from))] transition-colors duration-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                {/* </a> */}
                {/* <a href="https://facebook.com/fixmyprompt" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-[hsl(var(--ag-from))] transition-colors duration-200"> */}
                  <div className="text-muted-foreground hover:text-[hsl(var(--ag-from))] transition-colors duration-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </div>
                {/* </a> */}
                {/* <a href="https://twitter.com/fixmyprompt" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-muted-foreground hover:text-[hsl(var(--ag-from))] transition-colors duration-200"> */}
                  <div className="text-muted-foreground hover:text-[hsl(var(--ag-from))] transition-colors duration-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  </div>
                {/* </a> */}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/20 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground/80">
              <p>
                © {new Date().getFullYear()} FixMyPrompt. All rights reserved.
              </p>
              <p className="hidden sm:block">
                Professional AI tools for everyone
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

