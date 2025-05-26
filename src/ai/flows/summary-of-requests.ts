
'use server';
/**
 * @fileOverview Generates a summary of the current blood requests, including location and blood type.
 *
 * - summarizeRequests - A function that generates the summary of requests.
 * - SummaryOfRequestsInput - The input type for the summarizeRequests function.
 * - SummaryOfRequestsOutput - The return type for the summarizeRequests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummaryOfRequestsInputSchema = z.object({
  requests: z.array(
    z.object({
      bloodGroup: z.string().describe('The blood group of the request.'),
      location: z.string().describe('The location of the request.'),
      urgency: z.string().describe('The urgency of the request.'),
      contactInformation: z.string().describe('The contact information for the request.'),
    })
  ).describe('A list of blood requests.'),
});
export type SummaryOfRequestsInput = z.infer<typeof SummaryOfRequestsInputSchema>;

const SummaryOfRequestsOutputSchema = z.object({
  summary: z.string().describe('A summary of the current blood requests, including location and blood type.'),
});
export type SummaryOfRequestsOutput = z.infer<typeof SummaryOfRequestsOutputSchema>;

export async function summarizeRequests(input: SummaryOfRequestsInput): Promise<SummaryOfRequestsOutput> {
  return summarizeRequestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRequestsPrompt',
  input: {schema: SummaryOfRequestsInputSchema},
  output: {schema: SummaryOfRequestsOutputSchema},
  prompt: `You are an administrator summarizing blood requests.
\nRequests: {{{JSON.stringify requests}}}
\nSummarize the current blood requests, including location and blood type. Focus on summarizing the location and blood type, and only include urgency and contact information if needed.  Return the summary.`, 
});

const summarizeRequestsFlow = ai.defineFlow(
  {
    name: 'summarizeRequestsFlow',
    inputSchema: SummaryOfRequestsInputSchema,
    outputSchema: SummaryOfRequestsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        console.warn("AI prompt for summary of requests returned no output. Input:", input);
        // Return a default summary message, which conforms to the output schema.
        return { summary: "Could not generate summary at this time. The AI model did not provide a response." };
      }
      return output;
    } catch (error) {
      console.error("Error in summarizeRequestsFlow:", error, "Input:", input);
      // Re-throw or return a default summary
      // return { summary: "An error occurred while generating the summary." };
      // For now, re-throwing to ensure errors are visible.
      throw error;
    }
  }
);

