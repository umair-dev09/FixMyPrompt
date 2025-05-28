
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, Lightbulb, SlidersHorizontal, TrendingUp, Cpu, ToyBrick, Palette, Workflow, Sparkles, BarChartBig, UserRoundCog } from 'lucide-react';
import { useTheme } from 'next-themes';

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
      original: "help me write a birthday wish for my best friend",
      refined: [
          { tag: "Heartfelt", prompt: "Craft a warm and heartfelt birthday message for my best friend, mentioning our long friendship and a funny memory we share." },
          { tag: "Short & Sweet", prompt: "Write a concise and cheerful birthday wish for my best friend, perfect for a text message." },
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
    original: "plan a 7-day family trip to Kerala",
    refined: [
        { tag: "Relaxing", prompt: "Create a relaxed 7-day family itinerary for Kerala, focusing on backwaters, beaches, and cultural experiences suitable for all ages." },
        { tag: "Adventure", prompt: "Outline an adventurous 7-day family trip to Kerala, including trekking in Munnar, wildlife safaris, and water sports." },
    ]
  },
  {
    original: "Suggest some fun activities for a weekend family picnic",
    refined: [
        { tag: "Creative", prompt: "Brainstorm 5 unique and engaging activities for a family picnic, including one that involves storytelling and another that uses nature elements." },
        { tag: "Simple", prompt: "List 3 easy and fun games for a family picnic that require minimal setup." },
    ]
  }
];

const EXAMPLES_TO_SHOW = 2;
const ROTATION_INTERVAL = 7000; // 7 seconds

const llmLogos = [
  { name: "OpenAI GPT", srcLight: "/logos/chatgpt-light.webp", srcDark: "/logos/chatgpt-dark.webp", alt: "OpenAI Logo", hint: "AI language" },
  { name: "Google Gemini", srcLight: "/logos/gemini-color.webp", srcDark: "/logos/gemini-color.webp", alt: "Gemini Logo", hint: "Google AI" },
  { name: "Anthropic Claude", srcLight: "/logos/claude-color.webp", srcDark: "/logos/claude-color.webp", alt: "Claude Logo", hint: "Anthropic AI" },
  { name: "MidJourney", srcLight: "/logos/midjourney-light.webp", srcDark: "/logos/midjourney-dark.webp", alt: "Midjourney AI Logo", hint: "Mistral language" },
  { name: "Github Copilot", srcLight: "/logos/copilot-color.webp", srcDark: "/logos/copilot-color.webp", alt: "Copilot Logo", hint: "Cohere enterprise" },
  { name: "Perplexity AI", srcLight: "/logos/perplexity-color.webp", srcDark: "/logos/perplexity-color.webp", alt: "Perplexity AI Logo", hint: "AI search" },
  { name: "Meta AI", srcLight: "/logos/meta-color.webp", srcDark: "/logos/meta-color.webp", alt: "Meta Logo", hint: "AI writing" },
  { name: "Grok AI", srcLight: "/logos/grok-light.webp", srcDark: "/logos/grok-dark.webp", alt: "Grok Logo", hint: "AI community" },
  { name: "Cursor", srcLight: "/logos/cursor-light.webp", srcDark: "/logos/cursor-dark.webp", alt: "Cursor AI Logo", hint: "AI image" },
];


const extendedLogos = [...llmLogos, ...llmLogos]; // Duplicate for seamless loop

export function IntroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentExamples, setCurrentExamples] = useState<ExamplePrompt[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Initial setup
    const initialExamples: ExamplePrompt[] = [];
    if (allExamplePrompts.length > 0) {
        for (let i = 0; i < EXAMPLES_TO_SHOW; i++) {
            initialExamples.push(allExamplePrompts[i % allExamplePrompts.length]);
        }
    }
    setCurrentExamples(initialExamples);
    setCurrentIndex(0); // Ensure currentIndex is initialized
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
  }, []);


  return (
    <div className="space-y-12 sm:space-y-16 my-8 sm:my-12">
      <section className="text-center animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0s' }}>        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">What is FixMyPrompt?</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto">
          FixMyPrompt helps you transform your simple ideas into powerful, refined prompts.
          Get multiple variations tailored for different needs, with built-in prompt quality scoring
          to help you craft more effective prompts for your favorite AI tools.
        </p>
      </section>

      <section className="animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center tracking-tight bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">Example Transformations</h2>
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
                        <Badge variant="secondary" className="mb-1.5 text-xs">{refined.tag}</Badge>
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

      <section className="text-center animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 tracking-tight bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">Works with All popular AI models</h2>
        <div
          className="w-full inline-flex flex-nowrap overflow-hidden py-4 [mask-image:_linear-gradient(to_right,transparent_0,_black_30px,_black_calc(100%-30px),transparent_100%)] group"
        >
          <ul className="flex items-center justify-center md:justify-start animate-infinite-scroll group-hover:[animation-play-state:paused]">
            {extendedLogos.map((logo, index) => (
              <li key={`${logo.name}-1-${index}`} className="mx-4 sm:mx-6 flex-shrink-0" title={logo.name}>
                <Image
                  src={mounted && theme === 'dark' ? logo.srcDark : logo.srcLight}
                  alt={logo.alt}
                  width={65}
                  height={65}
                  className="rounded-md opacity-80 group-hover:opacity-100 transition-opacity duration-300 hover:!opacity-100 hover:scale-110 mx-5"
                  data-ai-hint={logo.hint}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="text-center py-12 sm:py-16 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-12 tracking-tight">
          Why a <span className="bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">Perfect Prompt</span> Matters
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto mb-10 sm:mb-16">
          In the world of AI, your prompt is everything. It's the bridge between your idea and the AI's output.
          Here’s why mastering your prompts unlocks true AI power:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Unlock Precision</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Vague prompts lead to vague answers. A precise prompt tells the AI exactly what you need, delivering focused and accurate results.
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Boost Efficiency</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Stop wasting time on trial-and-error. A well-crafted prompt gets you closer to your desired output on the first try.
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Ignite Creativity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Think of prompts as your creative brief for the AI. The better the brief, the more imaginative the AI's response can be.
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Gain Control</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Prompts are your steering wheel for AI. Master them, and you dictate the style, tone, format, and depth of the AI's output.
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Maximize Value</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Get the most out of your AI tools. Effective prompting ensures you leverage their full potential, turning simple requests into powerful solutions.
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <Cpu className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Unlock Complex Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Well-structured prompts can guide AI to perform more complex reasoning, break down problems, and deliver comprehensive outputs.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* New SEO-focused Section */}
      <section className="text-center py-12 sm:py-16 animate-fadeInUp" style={{ animationDuration: '0.5s', animationDelay: '0.4s' }}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-12 tracking-tight bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-transparent bg-clip-text">
          Supercharge Your AI: Advanced Prompting Techniques
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto mb-10 sm:mb-16">
          Go beyond basic queries. Effective prompt engineering unlocks sophisticated AI capabilities, helping you achieve unparalleled results and efficiency.
        </p>        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Card 1: Prompt Quality Scoring - NEW */}
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <BarChartBig className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Prompt Quality Scoring</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Evaluate your prompts with our advanced scoring system that analyzes clarity, specificity, length, and actionability to help you craft more effective AI interactions.
            </CardContent>
          </Card>

          {/* Card 2: Tailor for Specific AI Models */}
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <ToyBrick className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Tailor for Specific AI Models</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Unlock the unique strengths of models like GPT-4, Gemini, or Claude by crafting prompts that leverage their specific architectures. Get nuanced outputs by fine-tuning requests for any LLM.
            </CardContent>
          </Card>

          {/* Card 2: Master Tone & Style Consistency */}
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <Palette className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Master Tone & Style</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Command the AI's voice for formal reports, creative narratives, or brand-aligned comms. Define tone, style, and personality for perfectly tailored AI-generated content.
            </CardContent>
          </Card>

          {/* Card 3: Automate Complex Workflows */}
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <Workflow className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Automate Complex Workflows</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Instruct AI to perform multi-step tasks, from summarizing documents and extracting key data to generating code, streamlining your productivity on complex projects.
            </CardContent>
          </Card>          {/* Card 4: Amplify Creative Brainstorming */}
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Amplify Creative Ideation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Turn AI into your ultimate ideation partner. Generate diverse concepts for marketing, content creation, or problem-solving, and break through creative barriers.
            </CardContent>
          </Card>

          {/* Card 6: Create Personalized Experiences */}
          <Card className="shadow-lg rounded-xl flex flex-col text-left p-6 hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-card/60 dark:bg-card/50 backdrop-blur-lg hover:bg-card/70 dark:hover:bg-card/60 border border-border/20 supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] text-accent-foreground shadow-md">
                  <UserRoundCog className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">Craft Personalized Interactions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground/90">
              Develop prompts that enable AI to understand user context and preferences, delivering personalized responses, recommendations, and support for enhanced engagement.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

