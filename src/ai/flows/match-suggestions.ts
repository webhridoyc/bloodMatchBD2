// match-suggestions.ts
'use server';
/**
 * @fileOverview AI-powered blood donor match suggestions.
 *
 * - suggestMatches - A function that suggests potential blood donor matches based on blood type and location.
 * - SuggestMatchesInput - The input type for the suggestMatches function.
 * - SuggestMatchesOutput - The return type for the suggestMatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMatchesInputSchema = z.object({
  bloodType: z
    .string()
    .describe('The blood type of the requester (e.g., A+, O-, AB+).'),
  location: z.string().describe('The location of the requester.'),
  urgency: z.string().describe('The urgency of the request (e.g., high, medium, low).'),
  donorBloodTypes: z.array(z.string()).describe('An array of available donor blood types.'),
  donorLocations: z.array(z.string()).describe('An array of available donor locations.'),
});
export type SuggestMatchesInput = z.infer<typeof SuggestMatchesInputSchema>;

const SuggestMatchesOutputSchema = z.object({
  suggestedDonors: z.array(
    z.object({
      bloodType: z.string().describe('The blood type of the suggested donor.'),
      location: z.string().describe('The location of the suggested donor.'),
      matchReason: z.string().describe('The reason why this donor is a good match.'),
    })
  ).describe('An array of suggested donors and their information.'),
});

export type SuggestMatchesOutput = z.infer<typeof SuggestMatchesOutputSchema>;

export async function suggestMatches(input: SuggestMatchesInput): Promise<SuggestMatchesOutput> {
  return suggestMatchesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMatchesPrompt',
  input: {schema: SuggestMatchesInputSchema},
  output: {schema: SuggestMatchesOutputSchema},
  prompt: `You are an AI assistant designed to suggest blood donor matches based on blood type and location.

  Given a blood request with the following details:
  - Blood Type: {{{bloodType}}}
  - Location: {{{location}}}
  - Urgency: {{{urgency}}}

  And a list of available donors with the following blood types: {{{donorBloodTypes}}}
  And the following locations: {{{donorLocations}}}

  Suggest potential donors based on blood type compatibility and proximity to the requester's location.
  Explain the reasoning behind each suggested match.

  Prioritize donors with matching blood types and locations.
  Consider urgency when suggesting matches; prioritize matches that can fulfill urgent requests.

  Format your response as a JSON array of suggested donors, including their blood type, location, and a brief explanation of why they are a good match.
  `,
});

const suggestMatchesFlow = ai.defineFlow(
  {
    name: 'suggestMatchesFlow',
    inputSchema: SuggestMatchesInputSchema,
    outputSchema: SuggestMatchesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
