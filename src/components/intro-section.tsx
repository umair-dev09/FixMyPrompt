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
  { name: "ChatGPT", src: "https://placehold.co/100x40.png", alt: "ChatGPT Logo", hint: "AI chatbot" },
  { name: "Gemini", src: "https://placehold.co/100x40.png", alt: "Gemini Logo", hint: "Google AI" },
  { name: "Claude", src: "https://placehold.co/100x40.png", alt: "Claude Logo", hint: "Anthropic AI" },
];

export function IntroSection() {
  return (
    <div className="space-y-12 my-8">
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">What is Prompt Alchemy?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Prompt Alchemy helps you transform your simple ideas into powerful, refined prompts.
          Get multiple variations tailored for different needs, ensuring you get the best results
          from your favorite AI tools.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Example Transformations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {examplePrompts.map((example, index) => (
            <Card key={index} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Original: "{example.original}"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {example.refined.map((refined, rIndex) => (
                  <div key={rIndex} className="p-3 bg-muted/50 rounded-md">
                    <Badge variant="outline" className="mb-1">{refined.tag}</Badge>
                    <p className="text-sm text-foreground/80">{refined.prompt}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-6">Works with popular AI models</h2>
        <div className="flex justify-center items-center space-x-6 flex-wrap">
          {llmLogos.map(logo => (
            <div key={logo.name} className="p-2" title={logo.name}>
              <Image 
                src={logo.src} 
                alt={logo.alt} 
                width={100} 
                height={40} 
                className="rounded opacity-75 hover:opacity-100 transition-opacity"
                data-ai-hint={logo.hint}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
