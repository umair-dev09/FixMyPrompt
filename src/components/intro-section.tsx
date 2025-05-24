
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RefinedExample {
  tag: string;
  prompt: string;
}
interface ExamplePrompt {
  original: string;
  refined: RefinedExample[];
}

const allExamplePrompts: ExamplePrompt[] = [
  {
    original: "write an email to my boss for leave",
    refined: [
      { tag: "Formal", prompt: "Compose a formal email to my reporting manager requesting a leave of absence for [number] days, from [start date] to [end date], due to [reason]." },
      { tag: "Concise", prompt: "Request leave: [start date] - [end date] for [reason]. Seeking approval." },
    ]
  },
  {
    original: "explain black holes to a 5 year old",
    refined: [
      { tag: "Analogy", prompt: "Imagine a giant space vacuum cleaner, so strong it eats light! That's a black hole. Nothing escapes its super-duper munch!" },
      { tag: "Story", prompt: "Tell a short story about a star that played hide-and-seek and hid so well it became a black hole, a secret spot in space where even light can't find it." },
    ]
  },
  {
    original: "describe a futuristic city",
    refined: [
        { tag: "Vivid", prompt: "Paint a picture of a neon-drenched metropolis in 2242: flying vehicles weave between towering bioluminescent skyscrapers, holographic ads shimmer in the rain-slicked streets, and AI companions stroll beside citizens." },
        { tag: "Utopian", prompt: "Describe a sustainable futuristic city where nature and technology coexist harmoniously, featuring vertical farms, clean energy transport, and personalized public spaces." },
    ]
  },
  {
    original: "how to make a good cup of coffee",
    refined: [
        { tag: "Step-by-step", prompt: "Provide a beginner-friendly, step-by-step guide to brewing a perfect cup of coffee using a French press, including bean selection, grind size, water temperature, and brewing time." },
        { tag: "Expert", prompt: "Explain the key variables (grind consistency, water quality, brew ratio, extraction time) that coffee connoisseurs manipulate to achieve an exceptional pour-over coffee." },
    ]
  },
  {
      original: "generate a startup idea for a mobile app",
      refined: [
          { tag: "Niche", prompt: "Brainstorm a mobile app concept targeting a niche community, like urban gardeners or board game enthusiasts, solving a specific problem they face." },
          { tag: "Social Impact", prompt: "Propose a mobile app startup idea focused on social good, such as connecting volunteers with local charities or promoting mental wellness through gamified challenges." },
      ]
  },
  {
      original: "write a poem about the ocean",
      refined: [
          { tag: "Mysterious", prompt: "Craft a short, evocative poem about the ocean's hidden depths and ancient secrets, using metaphors that convey its vastness and mystery." },
          { tag: "Playful", prompt: "Write a lighthearted, rhyming poem about the fun and wonders of a day at the beach, focusing on playful waves and sandy shores, suitable for children." },
      ]
  },
  {
    original: "create a marketing slogan for a new eco-friendly water bottle",
    refined: [
        { tag: "Catchy", prompt: "Hydrate Smarter, Not Harder. Sip Sustainably." },
        { tag: "Benefit-driven", prompt: "The Last Bottle You'll Ever Need. Kind to You, Kinder to the Planet." },
    ]
  },
  {
    original: "plan a 3-day trip to Paris",
    refined: [
        { tag: "Budget", prompt: "Outline a 3-day Paris itinerary for budget travelers, focusing on free attractions, affordable food options, and public transport." },
        { tag: "Luxury", prompt: "Design an exclusive 3-day Parisian experience including Michelin-star dining, private museum tours, and luxury accommodation." },
    ]
  },
  {
    original: "what's the best way to learn a new language?",
    refined: [
        { tag: "Immersive", prompt: "Describe an immersive approach to learning a new language, emphasizing daily practice, cultural engagement, and speaking with native speakers." },
        { tag: "Tech-focused", prompt: "Suggest a language learning strategy leveraging apps, online communities, and AI tutors for rapid progress." },
    ]
  }
];

const EXAMPLES_TO_SHOW = 2;
const ROTATION_INTERVAL = 7000; // 7 seconds

const llmLogos = [
  { name: "ChatGPT", src: "https://placehold.co/120x48.png", alt: "ChatGPT Logo", hint: "AI chatbot" },
  { name: "Gemini", src: "https://placehold.co/120x48.png", alt: "Gemini Logo", hint: "Google AI" },
  { name: "Claude", src: "https://placehold.co/120x48.png", alt: "Claude Logo", hint: "Anthropic AI" },
];

export function IntroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentExamples, setCurrentExamples] = useState<ExamplePrompt[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Initial setup
    const initialExamples: ExamplePrompt[] = [];
    if (allExamplePrompts.length > 0) {
        for (let i = 0; i < EXAMPLES_TO_SHOW; i++) {
            initialExamples.push(allExamplePrompts[i % allExamplePrompts.length]);
        }
    }
    setCurrentExamples(initialExamples);
    setCurrentIndex(0);
    setAnimationKey(k => k + 1); // Trigger initial animation
  }, []);


  useEffect(() => {
    if (allExamplePrompts.length <= EXAMPLES_TO_SHOW) {
      // No need to rotate if not enough examples to cycle through
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + EXAMPLES_TO_SHOW) % allExamplePrompts.length;
        const newExamples: ExamplePrompt[] = [];
        for (let i = 0; i < EXAMPLES_TO_SHOW; i++) {
          newExamples.push(allExamplePrompts[(nextIndex + i) % allExamplePrompts.length]);
        }
        setCurrentExamples(newExamples);
        setAnimationKey(prevKey => prevKey + 1); // Change key to re-trigger animation
        return nextIndex;
      });
    }, ROTATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array, effect runs once after initial render


  return (
    <div className="space-y-12 sm:space-y-16 my-8 sm:my-12">
      <section className="text-center animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">What is FixMyPrompt?</h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto">
          FixMyPrompt helps you transform your simple ideas into powerful, refined prompts.
          Get multiple variations tailored for different needs, ensuring you get the best results
          from your favorite AI tools.
        </p>
      </section>

      <section className="animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center tracking-tight">Example Transformations</h2>
        {currentExamples.length > 0 ? (
            <div key={animationKey} className="grid md:grid-cols-2 gap-6 sm:gap-8 animate-fadeInUp" style={{ animationDuration: '0.3s' }}>
            {currentExamples.map((example, index) => (
                <Card key={`${example.original}-${index}`} className="shadow-lg rounded-xl flex flex-col hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/50 dark:bg-card/40 backdrop-blur-lg hover:bg-card/60 dark:hover:bg-card/50 border border-border/10 supports-[backdrop-filter]:bg-card/50">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-semibold">Original: "{example.original}"</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 flex-grow">
                    {example.refined.map((refined, rIndex) => (
                    <div key={rIndex} className="p-3 bg-muted/50 rounded-lg">
                        <Badge variant="outline" className="mb-1.5 text-xs">{refined.tag}</Badge>
                        <p className="text-sm text-foreground/90">{refined.prompt}</p>
                    </div>
                    ))}
                </CardContent>
                </Card>
            ))}
            </div>
        ) : (
            <p className="text-center text-muted-foreground">Loading examples...</p>
        )}
      </section>

      <section className="text-center animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 tracking-tight">Works with popular AI models</h2>
        <div className="flex justify-center items-center space-x-4 sm:space-x-6 flex-wrap">
          {llmLogos.map(logo => (
            <div key={logo.name} className="p-2" title={logo.name}>
              <Image 
                src={logo.src} 
                alt={logo.alt} 
                width={100} 
                height={40} 
                className="rounded-md opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110"
                data-ai-hint={logo.hint}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
