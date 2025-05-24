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
  input: {schema: RefinePromptInputSchema},
  output: {schema: RefinePromptOutputSchema},
  prompt: `You are an AI prompt refinement expert. Given a user prompt, you will generate three distinct and improved versions of the prompt. Each refined prompt should have a different style and purpose.

  For each refined prompt, generate a one-word tag that describes the style or purpose of the prompt (e.g., "Natural", "Formal", "SEO", "Emotional", "Fun", etc.).

  Return the refined prompts in the following JSON format:
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

  User Prompt: {{{prompt}}}`,
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
