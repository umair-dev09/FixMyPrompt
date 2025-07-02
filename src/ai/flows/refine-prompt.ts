// use server'
'use server';
/**
 * @fileOverview An AI agent that refines user prompts into three distinct versions.
 *
 * - refinePrompt - A function that refines a user-provided prompt into three versions.
 * - RefinePromptInput - The input type for the refinePrompt function.
 * - RefinePromptOutput - The return type for the refinePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefinePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to be refined.'),
  promptType: z.string().optional().describe('The type/category of the prompt (e.g., default, image-generation, video-generation, etc.)'),
});
export type RefinePromptInput = z.infer<typeof RefinePromptInputSchema>;

const RefinePromptOutputSchema = z.object({
  refinedPrompts: z.array(
    z.object({
      tag: z.string().describe('A tag describing the refined prompt.'),
      prompt: z.string().describe('The refined prompt.'),
    })
  ).describe('Three refined versions of the prompt, each with a distinct tag.'),
});
export type RefinePromptOutput = z.infer<typeof RefinePromptOutputSchema>;

export async function refinePrompt(input: RefinePromptInput): Promise<RefinePromptOutput> {
  return refinePromptFlow(input);
}

const refinePromptPrompt = ai.definePrompt({
  name: 'refinePromptPrompt',
  input: { schema: RefinePromptInputSchema },
  output: { schema: RefinePromptOutputSchema },
  prompt: `
You are an advanced AI prompt engineer tasked with improving raw user prompts for maximum effectiveness across diverse use cases. Your job is to generate **three uniquely refined versions** of the given prompt — each tailored with a **distinct tone, structure, and audience**.

**PROMPT TYPE CONTEXT**: This prompt is for {{promptType}} use case. Please optimize accordingly:

**Optimization Guidelines by Type:**
- **Image Generation**: Focus on visual details, artistic styles, composition, lighting, colors, and mood. Include technical photography/art terms when relevant. Consider aspect ratios, quality settings, and artistic movements. Add descriptive adjectives for better visual output.

- **Video Generation**: Include motion descriptions, camera movements, and transitions. Specify duration, pacing, and temporal elements. Add details about scenes, cuts, and visual storytelling. Consider audio/music suggestions where appropriate.

- **Code Generation**: Specify programming language, framework, and requirements. Include code structure, best practices, and error handling. Add documentation and comment requirements. Consider performance, security, and maintainability aspects.

- **Creative Writing**: Focus on narrative elements, character development, and plot structure. Include genre, tone, target audience, and writing style. Add specific literary devices and storytelling techniques. Consider word count, format, and publication context.

- **Business Content**: Emphasize professional tone, target audience, and business objectives. Include brand voice, call-to-action, and conversion goals. Add industry-specific terminology and compliance requirements. Consider platform, format, and distribution channels.

- **Educational Content**: Focus on learning objectives, target skill level, and pedagogical approach. Include assessment methods, examples, and practical applications. Add engagement strategies and knowledge retention techniques. Consider accessibility, inclusivity, and different learning styles.

- **Data Analysis**: Specify data types, analysis methods, and expected outputs. Include statistical requirements, visualization preferences. Add context about data sources, limitations, and assumptions. Consider interpretation guidelines and actionable insights.

- **Social Media**: Focus on platform-specific requirements, engagement tactics. Include hashtag strategies, posting schedules, and audience targeting. Add brand voice, visual elements, and community guidelines. Consider trends, viral potential, and cross-platform adaptation.

- **General Purpose**: Apply general best practices for clarity, specificity, and actionability.

Apply the guidelines above that are most relevant to the {{promptType}} prompt type when refining the user's prompt.

### ✳️ Core Refinement Rules:

1. **Preserve Intent**: Each version must stay true to the user’s original goal or objective.
2. **Enhance Key Qualities**:
   - **Clarity**: Remove ambiguity and make the prompt direct and easy to interpret.
   - **Length**: Expand overly short prompts with relevant, useful context. Keep length within a reasonable range (~40–200 words).
   - **Specificity**: Add concrete details, explicit requests, examples, or constraints.
   - **Actionability**: Use clear action verbs. Ensure the prompt tells the AI exactly what to do.

3. **Generate Distinct Variants**:
   - Each prompt must serve a different use case, audience, or tone.
   - Examples of tones: **Professional**, **Casual**, **SEO-Optimized**, **Narrative**, **Instructional**, **Imaginative**, etc.

4. **Add Meaningful Improvements**:
   - Context or background where appropriate
   - Clear structure (bullet points, steps, questions)
   - Defined target audience or purpose
   - More precise outputs (e.g., “summarize in 3 bullet points”, “generate a 30-word headline”, “write in markdown format”)

5. **Tag Each Version**:
   - Provide a one-word \`tag\` that summarizes the style or intent of each refined prompt (e.g., "Professional", "Engaging", "Creative").

6. **Avoid Redundancy**:
   - Ensure all three outputs are genuinely different in phrasing, focus, or purpose.

---

### ✅ Output Format:
Return your result in the following valid JSON format:

\`\`\`json
{
  "refinedPrompts": [
    {
      "tag": "<tag1>",
      "prompt": "<refined_prompt_1>"
    },
    {
      "tag": "<tag2>",
      "prompt": "<refined_prompt_2>"
    },
    {
      "tag": "<tag3>",
      "prompt": "<refined_prompt_3>"
    }
  ]
}
\`\`\`

### 🔍 User Prompt:
\`\`\`
{{{prompt}}}
\`\`\`
`
});

const refinePromptFlow = ai.defineFlow(
  {
    name: 'refinePromptFlow',
    inputSchema: RefinePromptInputSchema,
    outputSchema: RefinePromptOutputSchema,
  },
  async input => {
    const {output} = await refinePromptPrompt(input);
    return output!;
  }
);
