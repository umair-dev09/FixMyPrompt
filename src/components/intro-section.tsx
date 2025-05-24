import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const examplePrompts = [
  {
    original: "write an email to my boss for leave",
    refined: [
      { tag: "Formal", prompt: "Compose a formal email to my reporting manager requesting a leave of absence for [number] days, from [start date] to [end date], due to [reason]." },
      { tag: "Concise", prompt: "Request leave: [start date] - [end date] to boss. Reason: [reason]." },
    ]
  },
  {
    original: "explain black holes to a 5 year old",
    refined: [
      { tag: "Simple", prompt: "Imagine a super-duper hungry giant in space that eats everything, even light! That's a black hole. It's so strong, nothing can escape once it gets too close." },
      { tag: "Creative", prompt: "Tell a story about a star that got so tired it collapsed into a tiny, super-heavy ball, creating a 'cosmic vacuum cleaner' called a black hole." },
    ]
  }
];

const llmLogos = [
  { name: "ChatGPT", src: "https://placehold.co/120x48.png", alt: "ChatGPT Logo", hint: "AI chatbot" },
  { name: "Gemini", src: "https://placehold.co/120x48.png", alt: "Gemini Logo", hint: "Google AI" },
  { name: "Claude", src: "https://placehold.co/120x48.png", alt: "Claude Logo", hint: "Anthropic AI" },
];

export function IntroSection() {
  return (
    <div className="space-y-12 sm:space-y-16 my-8 sm:my-12">
      <section className="text-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">What is Prompt Alchemy?</h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto">
          Prompt Alchemy helps you transform your simple ideas into powerful, refined prompts.
          Get multiple variations tailored for different needs, ensuring you get the best results
          from your favorite AI tools.
        </p>
      </section>

      <section className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center tracking-tight">Example Transformations</h2>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {examplePrompts.map((example, index) => (
            <Card key={index} className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">Original: "{example.original}"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
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
      </section>

      <section className="text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
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
