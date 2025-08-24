'use server';
/**
 * @fileOverview An AI agent that reviews code for style and efficiency.
 *
 * - reviewCode - A function that handles the code review process.
 * - CodeReviewInput - The input type for the reviewCode function.
 * - CodeReviewOutput - The return type for the reviewCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeReviewInputSchema = z.object({
  code: z.string().describe('The code to be reviewed.'),
  language: z.string().describe('The programming language of the code.'),
  githubLink: z.string().optional().describe('Optional link to the GitHub file.'),
});
export type CodeReviewInput = z.infer<typeof CodeReviewInputSchema>;

const CodeReviewOutputSchema = z.object({
  feedback: z.string().describe('The AI-powered feedback on code style and efficiency, with suggestions for improvement.'),
  grade: z.string().describe('A grade for the code based on the review.'),
});
export type CodeReviewOutput = z.infer<typeof CodeReviewOutputSchema>;

export async function reviewCode(input: CodeReviewInput): Promise<CodeReviewOutput> {
  return codeReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeReviewPrompt',
  input: {schema: CodeReviewInputSchema},
  output: {schema: CodeReviewOutputSchema},
  prompt: `You are an AI code reviewer that specializes in grading code for style and efficiency, and providing suggestions for improvement.

  Review the following code, written in {{language}}:

  {{code}}

  {% if githubLink %}The code can be found at this Github link: {{githubLink}}{% endif %}

  Provide feedback and a grade for the code.
  `,
});

const codeReviewFlow = ai.defineFlow(
  {
    name: 'codeReviewFlow',
    inputSchema: CodeReviewInputSchema,
    outputSchema: CodeReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
