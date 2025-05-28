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
